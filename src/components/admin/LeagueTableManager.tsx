
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { TeamStats } from '@/types/fixtures';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import TeamList from './league/TeamList';
import LogoEditorDialog from './league/LogoEditorDialog';

const LeagueTableManager = () => {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  
  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('highland_league_table')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeams();
  }, []);
  
  const handleEditTeam = (team: TeamStats) => {
    setSelectedTeam(team);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Highland League Teams</CardTitle>
          <Button onClick={fetchTeams} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <TeamList 
            teams={teams} 
            isLoading={isLoading} 
            onEditTeam={handleEditTeam} 
          />
          
          {selectedTeam && (
            <LogoEditorDialog 
              team={selectedTeam} 
              isOpen={!!selectedTeam} 
              onOpenChange={(open) => !open && setSelectedTeam(null)}
              onSuccess={fetchTeams}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueTableManager;
