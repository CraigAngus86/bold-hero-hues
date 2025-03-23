
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayersSection from './PlayersSection';
import StaffSection from './StaffSection';
import { TeamProvider } from './contexts/TeamContext';

const AdminTeamSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Team & Management</h2>
      
      <TeamProvider>
        <Tabs defaultValue="players" className="space-y-4">
          <TabsList>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="staff">Management & Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="players">
            <PlayersSection />
          </TabsContent>
          
          <TabsContent value="staff">
            <StaffSection />
          </TabsContent>
        </Tabs>
      </TeamProvider>
    </div>
  );
};

export default AdminTeamSection;
