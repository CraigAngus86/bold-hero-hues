
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Shield, Briefcase } from 'lucide-react';
import TeamMembersManager from '@/components/admin/team/TeamMembersManager';
import TeamMemberEditor from '@/components/admin/team/TeamMemberEditor';
import PositionsManager from '@/components/admin/team/PositionsManager';
import SquadsManager from '@/components/admin/team/SquadsManager';

const { H2 } = Typography;

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleAddNewMember = () => {
    setSelectedMember(null);
    setIsEditing(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setSelectedMember(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <H2 className="mb-1">Team Management</H2>
            <p className="text-gray-500">Manage players, coaching staff, and club officials</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-1" onClick={handleAddNewMember}>
              <PlusCircle size={16} />
              New Team Member
            </Button>
          </div>
        </div>

        {isEditing ? (
          <TeamMemberEditor 
            member={selectedMember} 
            onClose={handleCloseEditor} 
          />
        ) : (
          <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users size={16} />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="squads" className="flex items-center gap-2">
                <Shield size={16} />
                Squads
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2">
                <Briefcase size={16} />
                Positions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members">
              <TeamMembersManager onEditMember={handleEditMember} />
            </TabsContent>
            
            <TabsContent value="squads">
              <SquadsManager />
            </TabsContent>
            
            <TabsContent value="positions">
              <PositionsManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
