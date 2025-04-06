
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  BadgeCheck, 
  Users,
  AlertCircle,
  Calendar 
} from 'lucide-react';
import { format, isPast, addDays } from 'date-fns';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sponsor } from '@/types/sponsors';
import { deleteSponsor } from '@/services/sponsorsService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SponsorsListProps {
  sponsors: Sponsor[];
  onEdit: (id: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const SponsorsList: React.FC<SponsorsListProps> = ({ 
  sponsors, 
  onEdit, 
  onAddNew, 
  onRefresh 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [renewalFilter, setRenewalFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | null>(null);

  // Apply filters and search
  const filteredSponsors = sponsors.filter(sponsor => {
    // Filter by tier
    if (tierFilter !== 'all' && sponsor.tier !== tierFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter === 'active' && sponsor.is_active !== true) {
      return false;
    }
    if (statusFilter === 'inactive' && sponsor.is_active !== false) {
      return false;
    }
    
    // Filter by renewal status
    if (renewalFilter !== 'all') {
      if (renewalFilter === 'expiring-soon') {
        if (!sponsor.end_date) return false;
        const endDate = new Date(sponsor.end_date);
        const thirtyDaysFromNow = addDays(new Date(), 30);
        if (!(isPast(endDate) || endDate <= thirtyDaysFromNow)) {
          return false;
        }
      } else if (renewalFilter === 'active') {
        if (sponsor.renewal_status !== 'active') return false;
      } else if (renewalFilter === 'pending') {
        if (sponsor.renewal_status !== 'pending') return false;
      } else if (renewalFilter === 'expired') {
        if (sponsor.end_date && !isPast(new Date(sponsor.end_date))) {
          return false;
        }
      }
    }
    
    // Filter by search query
    if (searchQuery && !sponsor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleDelete = async () => {
    if (!deletingSponsor) return;
    
    try {
      const response = await deleteSponsor(deletingSponsor.id);
      if (response.success) {
        toast.success(`${deletingSponsor.name} has been deleted`);
        onRefresh();
      } else {
        toast.error(`Failed to delete: ${response.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the sponsor');
      console.error('Delete sponsor error:', error);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingSponsor(null);
    }
  };

  const openDeleteDialog = (sponsor: Sponsor) => {
    setDeletingSponsor(sponsor);
    setDeleteDialogOpen(true);
  };

  const getSponsorExpiryStatus = (sponsor: Sponsor) => {
    if (!sponsor.end_date) return null;
    
    const endDate = new Date(sponsor.end_date);
    const today = new Date();
    
    if (isPast(endDate)) {
      return {
        label: 'Expired',
        status: 'error',
        icon: <AlertCircle className="h-3 w-3" />
      };
    }
    
    const thirtyDaysFromNow = addDays(today, 30);
    if (endDate <= thirtyDaysFromNow) {
      return {
        label: 'Expiring Soon',
        status: 'warning',
        icon: <Calendar className="h-3 w-3" />
      };
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={renewalFilter} onValueChange={setRenewalFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Renewals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Renewals</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending">Pending Renewal</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={onAddNew} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> Add Sponsor
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium"></th>
                <th className="px-4 py-3 text-left font-medium">Sponsor</th>
                <th className="px-4 py-3 text-left font-medium">Tier</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Period</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSponsors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No sponsors found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSponsors.map((sponsor) => {
                  const expiryStatus = getSponsorExpiryStatus(sponsor);
                  
                  return (
                    <tr key={sponsor.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded">
                          {sponsor.logo_url ? (
                            <img 
                              src={sponsor.logo_url} 
                              alt={`${sponsor.name} logo`} 
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Users className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          {sponsor.website_url && (
                            <a 
                              href={sponsor.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-blue-600 hover:underline truncate block max-w-[200px]"
                            >
                              {sponsor.website_url}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={
                            sponsor.tier === 'platinum' ? 'bg-zinc-300 text-zinc-800' :
                            sponsor.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                            sponsor.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                            'bg-amber-100 text-amber-800'
                          }
                        >
                          {sponsor.tier?.charAt(0).toUpperCase() + sponsor.tier?.slice(1) || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {sponsor.start_date || sponsor.end_date ? (
                          <div className="text-sm">
                            <div className="flex items-center">
                              {sponsor.start_date && (
                                <span>From {format(new Date(sponsor.start_date), 'MMM d, yyyy')}</span>
                              )}
                              
                              {sponsor.start_date && sponsor.end_date && (
                                <span className="mx-1">-</span>
                              )}
                              
                              {sponsor.end_date && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className={`${expiryStatus ? (
                                        expiryStatus.status === 'error' ? 'text-red-600 font-medium' : 
                                        expiryStatus.status === 'warning' ? 'text-amber-600 font-medium' : 
                                        ''
                                      ) : ''} flex items-center gap-1`}>
                                        To {format(new Date(sponsor.end_date), 'MMM d, yyyy')}
                                        {expiryStatus?.icon && expiryStatus.icon}
                                      </span>
                                    </TooltipTrigger>
                                    {expiryStatus && (
                                      <TooltipContent>
                                        <p>{expiryStatus.label}</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            {sponsor.renewal_status && sponsor.renewal_status !== 'active' && (
                              <Badge 
                                variant="outline" 
                                className="mt-1 text-xs"
                              >
                                {sponsor.renewal_status.charAt(0).toUpperCase() + sponsor.renewal_status.slice(1)}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No period set</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Badge variant={sponsor.is_active ? "outline" : "secondary"} className="gap-1">
                          {sponsor.is_active ? (
                            <>
                              <BadgeCheck className="h-3 w-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            'Inactive'
                          )}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(sponsor.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(sponsor)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sponsor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingSponsor?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SponsorsList;
