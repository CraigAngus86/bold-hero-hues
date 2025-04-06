
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit2 } from 'lucide-react';

interface TeamDataRowProps {
  team: {
    position: number;
    name: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
  onUpdate: (updatedTeam: any) => void;
}

const TeamDataRow: React.FC<TeamDataRowProps> = ({ team, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });
  
  const handleChange = (field: string, value: string) => {
    // Convert value to number if field is numeric
    const numericFields = ['position', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];
    const processedValue = numericFields.includes(field) ? Number(value) : value;
    
    setEditedTeam(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };
  
  const handleSave = () => {
    onUpdate(editedTeam);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTeam({ ...team });
    setIsEditing(false);
  };
  
  return (
    <tr>
      <td className="px-3 py-2 text-center">{isEditing ? (
        <Input 
          value={editedTeam.position.toString()} 
          onChange={(e) => handleChange('position', e.target.value)}
          className="h-8 w-12 text-center" 
        />
      ) : team.position}</td>
      
      <td className="px-3 py-2">
        {isEditing ? (
          <Input 
            value={editedTeam.name} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="h-8" 
          />
        ) : team.name}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.played.toString()} 
            onChange={(e) => handleChange('played', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.played}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.won.toString()} 
            onChange={(e) => handleChange('won', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.won}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.drawn.toString()} 
            onChange={(e) => handleChange('drawn', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.drawn}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.lost.toString()} 
            onChange={(e) => handleChange('lost', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.lost}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.goalsFor.toString()} 
            onChange={(e) => handleChange('goalsFor', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.goalsFor}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.goalsAgainst.toString()} 
            onChange={(e) => handleChange('goalsAgainst', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.goalsAgainst}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <Input 
            value={editedTeam.goalDifference.toString()} 
            onChange={(e) => handleChange('goalDifference', e.target.value)}
            className="h-8 w-12 text-center" 
          />
        ) : team.goalDifference}
      </td>
      
      <td className="px-3 py-2 text-center font-bold">
        {isEditing ? (
          <Input 
            value={editedTeam.points.toString()} 
            onChange={(e) => handleChange('points', e.target.value)}
            className="h-8 w-12 text-center font-bold" 
          />
        ) : team.points}
      </td>
      
      <td className="px-3 py-2 text-center">
        {isEditing ? (
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSave}
              className="h-8 w-8 p-0 text-green-600"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleCancel}
              className="h-8 w-8 p-0 text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
};

export default TeamDataRow;
