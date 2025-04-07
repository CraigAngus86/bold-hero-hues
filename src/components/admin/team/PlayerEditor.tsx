import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { TeamMember } from '@/types/team';
import { useTeamStore } from '@/services/teamService';
import PlayerImageUploader from './PlayerImageUploader';

interface PlayerEditorProps {
  player: TeamMember;
  onBack: () => void;
}

const PlayerEditor: React.FC<PlayerEditorProps> = ({ player, onBack }) => {
  const { addTeamMember, updateTeamMember } = useTeamStore((state) => ({
    addTeamMember: state.addTeamMember,
    updateTeamMember: state.updateTeamMember,
  }));

  const [name, setName] = useState(player.name);
  const [position, setPosition] = useState(player.position || '');
  const [nationality, setNationality] = useState(player.nationality || '');
  const [jerseyNumber, setJerseyNumber] = useState(player.jersey_number?.toString() || '');
  const [bio, setBio] = useState(player.bio || '');
  const [experience, setExperience] = useState(player.experience || '');
  const [isActive, setIsActive] = useState(player.is_active);
  const [previousClubs, setPreviousClubs] = useState<string[]>(player.previous_clubs as string[] || []);
  const [newPreviousClub, setNewPreviousClub] = useState('');
  const [imageUrl, setImageUrl] = useState(player.image_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddPreviousClub = () => {
    if (newPreviousClub.trim()) {
      setPreviousClubs([...previousClubs, newPreviousClub.trim()]);
      setNewPreviousClub('');
    }
  };

  const handleRemovePreviousClub = (index: number) => {
    const updatedClubs = [...previousClubs];
    updatedClubs.splice(index, 1);
    setPreviousClubs(updatedClubs);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPlayer = {
        ...player,
        name,
        position,
        nationality,
        jersey_number: jerseyNumber ? parseInt(jerseyNumber, 10) : 0,
        bio,
        experience,
        is_active: isActive,
        previous_clubs: previousClubs,
        image_url: imageUrl,
        created_at: player.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (player.id) {
        await updateTeamMember(updatedPlayer);
      } else {
        await addTeamMember(updatedPlayer, 'player');
      }
      
      onBack();
    } catch (error) {
      console.error('Error saving player:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>{player.id ? 'Edit Player' : 'Add New Player'}</CardTitle>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Player
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Player Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Nationality"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jersey-number">Jersey Number</Label>
                <Input
                  id="jersey-number"
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                  placeholder="Jersey Number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Player biography"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Experience"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Previous Clubs</Label>
              <div className="flex space-x-2">
                <Input
                  value={newPreviousClub}
                  onChange={(e) => setNewPreviousClub(e.target.value)}
                  placeholder="Add previous club"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPreviousClub();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddPreviousClub}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {previousClubs.map((club, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{club}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePreviousClub(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active-status"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active-status">Active Player</Label>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Player Image</Label>
            <PlayerImageUploader 
              currentUrl={imageUrl} 
              onUpload={handleImageUpload}
              playerName={name}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerEditor;
