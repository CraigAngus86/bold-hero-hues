
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Sponsor } from '@/types/sponsors';
import { deleteSponsor } from '@/services/sponsorsService';

interface SponsorsListProps {
  sponsors: Sponsor[];
  onEditSponsor: (id: string) => void;
  onDeleteSponsor: () => void;
}

const SponsorsList: React.FC<SponsorsListProps> = ({ 
  sponsors, 
  onEditSponsor, 
  onDeleteSponsor 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteClick = (id: string) => {
    setSponsorToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!sponsorToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteSponsor(sponsorToDelete);
      if (result.success) {
        toast.success('Sponsor deleted successfully');
        onDeleteSponsor();
      } else if (result.error) {
        // Handle error case by checking if it's a string or object
        const errorMessage = typeof result.error === 'string' ? 
          result.error : 
          'Failed to delete sponsor';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('An error occurred while deleting the sponsor');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSponsorToDelete(null);
    }
  };
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="hidden md:table-cell">Website</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No sponsors found. Click 'Add New Sponsor' to create one.
              </TableCell>
            </TableRow>
          ) : (
            sponsors.map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell className="font-medium">{sponsor.name}</TableCell>
                <TableCell>
                  <span className="capitalize">{sponsor.tier || 'N/A'}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {sponsor.website_url ? (
                    <a 
                      href={sponsor.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      Visit Site
                    </a>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sponsor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sponsor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditSponsor(sponsor.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(sponsor.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this sponsor?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            This action cannot be undone. This will permanently delete the sponsor
            and all associated data.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsList;
