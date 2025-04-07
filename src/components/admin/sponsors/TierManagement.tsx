
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PlusCircle, Pencil, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSponsorshipTiers, createSponsorshipTier, updateSponsorshipTier, deleteSponsorshipTier } from '@/services/sponsorsService';
import { SponsorshipTier } from '@/types/sponsors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const tierFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  benefits: z.string().optional(),
  color: z.string().optional(),
  order_position: z.number().int().min(0).default(0),
});

const TierManagement: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<SponsorshipTier | null>(null);
  const queryClient = useQueryClient();
  
  const { data: tiers = [], isLoading, refetch } = useQuery({
    queryKey: ['sponsorshipTiers'],
    queryFn: async () => {
      const response = await fetchSponsorshipTiers();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tiers');
      }
      return response.data || [];
    }
  });

  const form = useForm<z.infer<typeof tierFormSchema>>({
    resolver: zodResolver(tierFormSchema),
    defaultValues: {
      name: '',
      description: '',
      benefits: '',
      color: '#888888',
      order_position: 0,
    },
  });

  useEffect(() => {
    if (editingTier) {
      form.reset({
        name: editingTier.name,
        description: editingTier.description || '',
        benefits: editingTier.benefits || '',
        color: editingTier.color || '#888888',
        order_position: editingTier.order_position,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        benefits: '',
        color: '#888888',
        order_position: tiers.length > 0 ? Math.max(...tiers.map(tier => tier.order_position)) + 10 : 10,
      });
    }
  }, [editingTier, tiers, form]);

  const createTierMutation = useMutation({
    mutationFn: createSponsorshipTier,
    onSuccess: () => {
      toast.success('Tier created successfully');
      queryClient.invalidateQueries({ queryKey: ['sponsorshipTiers'] });
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to create tier');
      console.error('Error creating tier:', error);
    }
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<SponsorshipTier> }) => updateSponsorshipTier(id, data),
    onSuccess: () => {
      toast.success('Tier updated successfully');
      queryClient.invalidateQueries({ queryKey: ['sponsorshipTiers'] });
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to update tier');
      console.error('Error updating tier:', error);
    }
  });

  const deleteTierMutation = useMutation({
    mutationFn: deleteSponsorshipTier,
    onSuccess: () => {
      toast.success('Tier deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sponsorshipTiers'] });
    },
    onError: (error) => {
      toast.error('Failed to delete tier');
      console.error('Error deleting tier:', error);
    }
  });

  const onSubmit = async (values: z.infer<typeof tierFormSchema>) => {
    if (editingTier) {
      updateTierMutation.mutate({
        id: editingTier.id,
        data: values
      });
    } else {
      createTierMutation.mutate(values as any);
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      deleteTierMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTier(null);
    form.reset();
  };

  const handleMoveUp = async (tier: SponsorshipTier, index: number) => {
    if (index === 0) return;
    
    const prevTier = tiers[index - 1];
    const newPosition = prevTier.order_position - 5;
    
    updateTierMutation.mutate({
      id: tier.id,
      data: { order_position: newPosition }
    });
  };

  const handleMoveDown = async (tier: SponsorshipTier, index: number) => {
    if (index === tiers.length - 1) return;
    
    const nextTier = tiers[index + 1];
    const newPosition = nextTier.order_position + 5;
    
    updateTierMutation.mutate({
      id: tier.id,
      data: { order_position: newPosition }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sponsorship Tiers</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTier(null);
              setIsAddDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTier ? 'Edit Tier' : 'Add New Tier'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Gold, Silver, Bronze" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Brief description of this tier" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="List benefits for this tier" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-12 h-10" />
                          <Input type="text" {...field} className="flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {editingTier ? 'Update Tier' : 'Create Tier'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Tiers</CardTitle>
          <CardDescription>
            Configure the different sponsorship tiers available for your sponsors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading tiers...</div>
          ) : tiers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tiers have been created yet.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)} 
                className="mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first tier
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier, index) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{tier.description}</TableCell>
                    <TableCell>{tier.order_position}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: tier.color || '#888888' }}
                        />
                        {tier.color || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveUp(tier, index)}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveDown(tier, index)}
                          disabled={index === tiers.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingTier(tier);
                            setIsAddDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTier(tier.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TierManagement;
