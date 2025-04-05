import { useState, useEffect } from 'react';
import OfficialCard from './OfficialCard';
import { useTeamStore, TeamMember } from '@/services/teamService';

interface ClubOfficialsProps {
  officials?: { 
    name: string; 
    role: string; 
    image: string; 
    bio: string; 
    experience: string;
  }[];
}

export default function ClubOfficials({ officials: propOfficials }: ClubOfficialsProps = {}) {
  const [officials, setOfficials] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { teamMembers, loadTeamMembers } = useTeamStore();
  
  useEffect(() => {
    // If officials are provided as props, use those
    if (propOfficials && propOfficials.length > 0) {
      // Convert prop officials to TeamMember format
      const convertedOfficials = propOfficials.map((official, index) => ({
        id: `official-${index}`,
        name: official.name,
        member_type: 'official' as const,
        position: official.role,
        image_url: official.image,
        bio: official.bio,
        experience: official.experience,
        is_active: true
      }));
      
      setOfficials(convertedOfficials);
      setLoading(false);
      return;
    }
    
    // Otherwise load from team store
    if (teamMembers.length === 0) {
      loadTeamMembers();
    }
    
    // Filter officials from team members
    const filteredOfficials = teamMembers.filter(member => member.member_type === 'official');
    setOfficials(filteredOfficials);
    setLoading(false);
  }, [teamMembers, loadTeamMembers, propOfficials]);
  
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
