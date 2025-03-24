
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye, EyeOff, Edit, Trash2, FileJson, Upload, Download, RefreshCw } from 'lucide-react';
import { Match } from '@/components/fixtures/types';
import { fetchAllMatches } from '@/services/leagueDataService';
import { toggleMatchVisibility, deleteMatchFromSupabase, scrapeAndStoreFixtures } from '@/services/supabase/fixturesService';
import { formatDate } from '@/components/fixtures/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import MatchForm from './MatchForm';
import FixturesImportExport from './FixturesImportExport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import { useFixturesFilter } from '@/hooks/useFixturesFilter';

const FixturesManager = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [uniqueCompetitions, setUniqueCompetitions] = useState<string[]>(['All Competitions']);
  const [isScraping, setIsScraping] = useState(false);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const allMatches = await fetchAllMatches();
      setMatches(allMatches);

      // Extract unique competitions
      const competitions = [...new Set(allMatches.map(match => match.competition))];
      setUniqueCompetitions(['All Competitions', ...competitions.sort()]);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const filterProps = useFixturesFilter({
    matches,
    competitions: uniqueCompetitions
  });

  const handleAddMatch = () => {
    setSelectedMatch(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteMatch = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        // For Supabase, id should be a string
        const success = await deleteMatchFromSupabase(id.toString());
        if (success) {
          setMatches(matches.filter(match => match.id !== id));
          toast.success('Match deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting match:', error);
        toast.error('Failed to delete match');
      }
    }
  };

  const handleToggleVisibility = async (id: string | number, visible: boolean) => {
    try {
      // For Supabase, id should be a string
      const success = await toggleMatchVisibility(id.toString(), !visible);
      if (success) {
        setMatches(matches.map(match => {
          if (match.id === id) {
            return { ...match, visible: !visible };
          }
          return match;
        }));
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update match visibility');
    }
  };

  const handleFormSubmit = async (updatedMatch: Match) => {
    // Form component will handle the database updates
    setIsFormOpen(false);
    // Reload all matches to get the latest data
    await loadMatches();
  };

  const handleScrapData = async () => {
    if (window.confirm('This will replace all existing fixture data with newly scraped data. Continue?')) {
      setIsScraping(true);
      try {
        const success = await scrapeAndStoreFixtures();
        if (success) {
          toast.success('Successfully scraped and imported fixture data');
          await loadMatches();
        }
      } catch (error) {
        console.error('Error scraping data:', error);
        toast.error('Failed to scrape fixture data');
      } finally {
        setIsScraping(false);
      }
    }
  };

  // Update filtered matches whenever the filter changes
  useEffect(() => {
    // Convert the grouped matches back to a flat array
    const flattenedMatches: Match[] = [];
    Object.values(filterProps.filteredMatches).forEach(groupedMatches => {
      flattenedMatches.push(...groupedMatches);
    });
    setFilteredMatches(flattenedMatches);
  }, [filterProps.filteredMatches]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">Manage Fixtures & Results</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" onClick={handleAddMatch} className="h-9">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Match
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsImportExportOpen(true)}
            className="h-9"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Import/Export
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleScrapData} 
            disabled={isScraping}
            className="h-9"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isScraping ? 'animate-spin' : ''}`} />
            {isScraping ? 'Scraping...' : 'Scrape Data'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming Fixtures</TabsTrigger>
          <TabsTrigger value="past">Past Results</TabsTrigger>
        </TabsList>
        
        <FixturesFilter 
          selectedCompetition={filterProps.selectedCompetition}
          setSelectedCompetition={filterProps.setSelectedCompetition}
          selectedMonth={filterProps.selectedMonth}
          setSelectedMonth={filterProps.setSelectedMonth}
          showPast={filterProps.showPast}
          setShowPast={filterProps.setShowPast}
          showUpcoming={filterProps.showUpcoming}
          setShowUpcoming={filterProps.setShowUpcoming}
          competitions={uniqueCompetitions}
          availableMonths={filterProps.availableMonths}
          onClearFilters={filterProps.clearFilters}
        />
        
        <TabsContent value="upcoming" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading matches...
                    </TableCell>
                  </TableRow>
                ) : filteredMatches.filter(match => !match.isCompleted).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No upcoming fixtures found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches
                    .filter(match => !match.isCompleted)
                    .map(match => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          {formatDate(match.date)}<br/>
                          <span className="text-xs text-gray-500">{match.time}</span>
                        </TableCell>
                        <TableCell>{match.competition}</TableCell>
                        <TableCell>
                          <span className={match.homeTeam === "Banks o' Dee" ? "font-semibold text-team-blue" : ""}>
                            {match.homeTeam}
                          </span>
                          <span className="mx-2">vs</span>
                          <span className={match.awayTeam === "Banks o' Dee" ? "font-semibold text-team-blue" : ""}>
                            {match.awayTeam}
                          </span>
                        </TableCell>
                        <TableCell>{match.venue}</TableCell>
                        <TableCell>
                          {(match as any).visible !== false ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleVisibility(match.id, (match as any).visible !== false)}
                              title={(match as any).visible !== false ? "Hide match" : "Show match"}
                            >
                              {(match as any).visible !== false ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMatch(match)}
                              title="Edit match"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMatch(match.id)}
                              title="Delete match"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading matches...
                    </TableCell>
                  </TableRow>
                ) : filteredMatches.filter(match => match.isCompleted).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No past results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches
                    .filter(match => match.isCompleted)
                    .map(match => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          {formatDate(match.date)}<br/>
                          <span className="text-xs text-gray-500">{match.time}</span>
                        </TableCell>
                        <TableCell>{match.competition}</TableCell>
                        <TableCell>
                          <span className={match.homeTeam === "Banks o' Dee" ? "font-semibold text-team-blue" : ""}>
                            {match.homeTeam}
                          </span>
                          <span className="mx-2">vs</span>
                          <span className={match.awayTeam === "Banks o' Dee" ? "font-semibold text-team-blue" : ""}>
                            {match.awayTeam}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{match.homeScore}</span>
                          <span className="mx-2">-</span>
                          <span className="font-medium">{match.awayScore}</span>
                        </TableCell>
                        <TableCell>
                          {(match as any).visible !== false ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleVisibility(match.id, (match as any).visible !== false)}
                              title={(match as any).visible !== false ? "Hide match" : "Show match"}
                            >
                              {(match as any).visible !== false ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMatch(match)}
                              title="Edit match"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMatch(match.id)}
                              title="Delete match"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Match' : 'Edit Match'}</DialogTitle>
            <DialogDescription>
              {formMode === 'add' 
                ? 'Add a new fixture or result to the database.' 
                : 'Update the details of this match.'}
            </DialogDescription>
          </DialogHeader>
          <MatchForm 
            match={selectedMatch} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsFormOpen(false)}
            mode={formMode}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import/Export Fixture Data</DialogTitle>
            <DialogDescription>
              Import data from JSON or export current data to a file.
            </DialogDescription>
          </DialogHeader>
          <FixturesImportExport 
            onImportComplete={loadMatches}
            onClose={() => setIsImportExportOpen(false)}
            currentMatches={matches}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixturesManager;
