
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
  Users 
} from 'lucide-react';
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
import { deleteSponsor } from '@/services/sponsorsDbService';
import CustomTable from '@/components/ui/CustomTable';

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

  // Define table columns
  const columns = [
    {
      key: 'logo',
      title: '',
      render: (sponsor: Sponsor) => (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded">
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
      ),
    },
    {
      key: 'name',
      title: 'Sponsor Name',
      sortable: true,
      render: (sponsor: Sponsor) => (
        <div>
          <div className="font-medium">{sponsor.name}</div>
          {sponsor.website_url && (
            <a 
              href={sponsor.website_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-600 hover:underline"
            >
              {sponsor.website_url}
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'tier',
      title: 'Tier',
      sortable: true,
      render: (sponsor: Sponsor) => {
        const tierColors: Record<string, string> = {
          platinum: 'bg-zinc-300',
          gold: 'bg-yellow-100 text-yellow-800',
          silver: 'bg-gray-100 text-gray-800',
          bronze: 'bg-amber-100 text-amber-800',
        };
        
        return (
          <Badge className={tierColors[sponsor.tier] || 'bg-gray-100'}>
            {sponsor.tier?.charAt(0).toUpperCase() + sponsor.tier?.slice(1) || 'Unknown'}
          </Badge>
        );
      },
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (sponsor: Sponsor) => (
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
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (sponsor: Sponsor) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(sponsor.id)}>
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
      ),
    },
  ];

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
          
          <Button onClick={onAddNew} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> Add Sponsor
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <CustomTable 
          columns={columns}
          data={filteredSponsors}
          noDataMessage="No sponsors found. Add your first sponsor by clicking the 'Add Sponsor' button."
          initialSortKey="name"
          initialSortDirection="asc"
        />
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
