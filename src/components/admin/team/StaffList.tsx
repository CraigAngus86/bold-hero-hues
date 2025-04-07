import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useTeamStore } from '@/services/teamStore';
import { TeamMember } from '@/types/team';

interface StaffListProps {
  onSelectStaff: (staff: TeamMember) => void;
  onCreateNew: () => void;
}

const StaffList: React.FC<StaffListProps> = ({ onSelectStaff, onCreateNew }) => {
  const { teamMembers, isLoading, deleteTeamMember } = useTeamStore(state => ({
    teamMembers: state.teamMembers.filter(m => m.member_type !== 'player'),
    isLoading: state.isLoading,
    deleteTeamMember: state.deleteTeamMember,
  }));

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      await deleteTeamMember(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff & Management</CardTitle>
        <Button onClick={onCreateNew} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No staff members found. Add your first staff member to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 font-semibold">Name</th>
                  <th className="pb-2 font-semibold">Position</th>
                  <th className="pb-2 font-semibold">Nationality</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3">
                      <div className="flex items-center">
                        {staff.image_url && (
                          <img 
                            src={staff.image_url} 
                            alt={staff.name} 
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                          />
                        )}
                        <span>{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{staff.position}</td>
                    <td className="py-3">{staff.nationality}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        staff.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectStaff(staff)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(staff.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffList;
