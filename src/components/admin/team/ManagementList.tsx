
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { StaffMember } from './StaffForm';

interface ManagementListProps {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
}

export const ManagementList = ({ staff, onEdit, onDelete }: ManagementListProps) => {
  // Group staff by role type
  const groupedStaff = staff.reduce((groups, member) => {
    const roleType = getRoleType(member.role);
    if (!groups[roleType]) {
      groups[roleType] = [];
    }
    groups[roleType].push(member);
    return groups;
  }, {} as Record<string, StaffMember[]>);
  
  // Order of role types
  const roleOrder = ['Management', 'Coaching', 'Medical', 'Support'];
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Bio</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.length > 0 ? (
            roleOrder.map(roleType => {
              const members = groupedStaff[roleType] || [];
              if (members.length === 0) return null;
              
              return (
                <React.Fragment key={roleType}>
                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={4} className="font-medium py-2">
                      {roleType}
                    </TableCell>
                  </TableRow>
                  
                  {members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-semibold">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="hidden md:table-cell line-clamp-1">
                        {member.bio || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(member)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(member.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center p-4 text-gray-500">
                No staff members found. Add staff using the button above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to determine role type
function getRoleType(role: string): string {
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('manager') || roleLower.includes('director')) {
    return 'Management';
  } else if (roleLower.includes('coach') || roleLower.includes('trainer')) {
    return 'Coaching';
  } else if (roleLower.includes('physio') || roleLower.includes('doctor') || roleLower.includes('medical')) {
    return 'Medical';
  } else {
    return 'Support';
  }
}
