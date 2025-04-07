
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TeamMember } from '@/types/team';
import PlayerEditor from './PlayerEditor';
import PlayersList from './PlayersList';
import StaffEditor from './StaffEditor';
import StaffList from './StaffList';

export interface TeamMembersManagerProps {
  memberType: 'player' | 'staff' | 'coach' | 'official' | 'management';
  members: TeamMember[];
}

const TeamMembersManager: React.FC<TeamMembersManagerProps> = ({ memberType, members }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setActiveTab('add');
  };

  const handleAfterSave = () => {
    setActiveTab('list');
  };

  const renderEditor = () => {
    switch (memberType) {
      case 'player':
        return <PlayerEditor onSave={handleAfterSave} onCancel={() => setActiveTab('list')} />;
      case 'staff':
      case 'coach':
      case 'official':
      case 'management':
        return <StaffEditor staff={{ member_type: memberType } as TeamMember} onSave={handleAfterSave} onCancel={() => setActiveTab('list')} />;
      default:
        return null;
    }
  };

  // Update the component to pass the correct props to PlayersList and StaffList
  const renderList = () => {
    switch (memberType) {
      case 'player':
        return <PlayersList 
                 onSelectPlayer={(player) => console.log(`Selected player: ${player.id}`)}
                 onViewPlayerStats={(player) => console.log(`View stats for: ${player.id}`)}
                 onCreateNew={handleAddNew} 
               />;
      case 'staff':
      case 'coach':
      case 'official':
      case 'management':
        return <StaffList 
                 onSelectStaff={(staff) => console.log(`Selected staff: ${staff.id}`)} 
                 onCreateNew={handleAddNew} 
               />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{memberType}s Management</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[400px]">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="list" className="p-0">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${memberType}s...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="ml-4" onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {memberType}
            </Button>
          </div>
          {renderList()}
        </TabsContent>
        <TabsContent value="add" className="p-0">
          {renderEditor()}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default TeamMembersManager;
