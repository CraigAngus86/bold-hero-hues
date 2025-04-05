
import { useState, useEffect } from 'react';
import OfficialCard from './OfficialCard';
import { useTeamStore, TeamMember } from '@/services/teamService';

export default function ClubOfficials() {
  const [officials, setOfficials] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { teamMembers, loadTeamMembers } = useTeamStore();
  
  useEffect(() => {
    // Load team members if not already loaded
    if (teamMembers.length === 0) {
      loadTeamMembers();
    }
    
    // Filter officials from team members
    const filteredOfficials = teamMembers.filter(member => member.member_type === 'official');
    setOfficials(filteredOfficials);
    setLoading(false);
  }, [teamMembers, loadTeamMembers]);
  
  if (loading) {
    return <div className="text-center py-10">Loading club officials...</div>;
  }
  
  if (officials.length === 0) {
    return <div className="text-center py-10">No officials found.</div>;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-team-blue mb-6">Club Officials</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officials.map((official) => (
          <OfficialCard key={official.id} official={official} />
        ))}
      </div>
    </div>
  );
}
