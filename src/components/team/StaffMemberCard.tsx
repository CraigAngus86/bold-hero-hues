
import React from 'react';
import { TeamMember } from '@/types/team';

interface StaffMemberProps {
  member: TeamMember;
}

const StaffMemberCard: React.FC<StaffMemberProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-52 overflow-hidden">
        <img 
          src={member.image_url || '/placeholder.svg'} 
          alt={member.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl text-team-blue">{member.name}</h3>
        <p className="text-gray-600 font-medium">{member.position}</p>
        
        {member.experience && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-clamp-3">{member.experience}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffMemberCard;
