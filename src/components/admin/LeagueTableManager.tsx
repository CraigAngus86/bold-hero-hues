
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, Edit, Plus, RefreshCw, FileImage } from "lucide-react";
import { TeamStats } from '@/components/league/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const LeagueTableManager = () => {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  
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
  
  const handleUpdateLogo = async () => {
    if (!selectedTeam || !logoUrl.trim()) return;
    
    try {
      const { error } = await supabase
        .from('highland_league_table')
        .update({ logo: logoUrl })
        .eq('id', selectedTeam.id);
      
      if (error) throw error;
      
      toast.success(`Updated logo for ${selectedTeam.team}`);
      fetchTeams();
      setSelectedTeam(null);
      setLogoUrl("");
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Failed to update team logo');
    }
  };
  
  const handleEditTeam = async (team: TeamStats) => {
    setSelectedTeam(team);
    setLogoUrl(team.logo || "");
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
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.length > 0 ? teams.map((team) => (
                      <TableRow key={team.id} className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}>
                        <TableCell>{team.position}</TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell>
                          {team.logo ? (
                            <img 
                              src={team.logo} 
                              alt={`${team.team} logo`} 
                              className="h-8 w-8 object-contain" 
                            />
                          ) : (
                            <Badge variant="outline">No Logo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditTeam(team)}
                          >
                            <FileImage className="h-4 w-4 mr-1" />
                            Update Logo
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No teams found. Refresh data from the scraper control panel.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Update Logo Dialog */}
              <Dialog open={!!selectedTeam} onOpenChange={(open) => !open && setSelectedTeam(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Team Logo</DialogTitle>
                  </DialogHeader>
                  
                  {selectedTeam && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">{selectedTeam.team}</p>
                        {selectedTeam.logo && (
                          <img 
                            src={selectedTeam.logo} 
                            alt={`${selectedTeam.team} current logo`} 
                            className="h-12 w-12 object-contain border border-gray-200 rounded-md p-1" 
                          />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input 
                          id="logoUrl" 
                          placeholder="Enter logo URL" 
                          value={logoUrl} 
                          onChange={(e) => setLogoUrl(e.target.value)} 
                        />
                        <p className="text-xs text-gray-500">
                          Enter a URL to an image. Ideally a transparent PNG logo.
                        </p>
                      </div>
                      
                      {logoUrl && (
                        <div className="border border-gray-200 rounded-md p-2">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <img 
                            src={logoUrl} 
                            alt="Logo preview" 
                            className="h-12 w-12 object-contain mx-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/100x100/gray/white?text=Error";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateLogo}>Update Logo</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueTableManager;
