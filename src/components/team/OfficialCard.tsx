
import React from 'react';
import { TeamMember } from '@/types/team';

interface OfficialProps {
  official: TeamMember;
}

const OfficialCard: React.FC<OfficialProps> = ({ official }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-52 overflow-hidden">
        <img 
          src={official.image_url || '/placeholder.svg'} 
          alt={official.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl text-team-blue">{official.name}</h3>
        <p className="text-gray-600 font-medium">{official.position}</p>
        
        {official.experience && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-clamp-3">{official.experience}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialCard;
