
import { useState, useEffect } from 'react';
import StaffMemberCard from './StaffMemberCard';
import { TeamMember } from '@/types/team';
import { useTeamStore } from '@/services/teamService';

export default function ManagementTeam() {
  const [staff, setStaff] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const getManagementStaff = useTeamStore((state) => state.getManagementStaff);
  
  useEffect(() => {
    const fetchManagement = async () => {
      try {
        const managementStaff = await getManagementStaff();
        setStaff(managementStaff);
      } catch (error) {
        console.error("Error fetching management team:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchManagement();
  }, [getManagementStaff]);
  
  if (loading) {
    return <div className="text-center py-10">Loading management team...</div>;
  }
  
  if (staff.length === 0) {
    return <div className="text-center py-10">No management team members found.</div>;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-team-blue mb-6">Management Team</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <StaffMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
