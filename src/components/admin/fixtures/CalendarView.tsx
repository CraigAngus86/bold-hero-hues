
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, Filter, Calendar as CalendarIcon, List } from 'lucide-react';
import { format } from 'date-fns';
import { getAllFixtures } from '@/services/fixturesService';
import { FixturesFilter } from '@/components/fixtures/FixturesFilter';
import { FixturesList } from '@/components/admin/fixtures/FixturesList';
import { LoadingIndicator } from '@/components/admin/fixtures/LoadingIndicator';
import { DateRange } from '@/components/admin/fixtures/DateRange';

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [filteredFixtures, setFilteredFixtures] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    competition: '',
    dateRange: { from: undefined, to: undefined } as { from: Date | undefined, to: Date | undefined },
    homeAway: 'all'
  });
  
  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setIsLoading(true);
        const response = await getAllFixtures();
        if (response.success) {
          setFixtures(response.data || []);
          setFilteredFixtures(response.data || []);
        } else {
          toast.error('Failed to load fixtures');
        }
      } catch (error) {
        console.error('Error loading fixtures:', error);
        toast.error('Error loading fixtures');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFixtures();
  }, []);
  
  // Filter fixtures based on search query and filter options
  useEffect(() => {
    let results = [...fixtures];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(fixture => 
        fixture.homeTeam.toLowerCase().includes(query) ||
        fixture.awayTeam.toLowerCase().includes(query)
      );
    }
    
    // Apply competition filter
    if (filterOptions.competition) {
      results = results.filter(fixture => 
        fixture.competition === filterOptions.competition
      );
    }
    
    // Apply date range filter
    if (filterOptions.dateRange.from) {
      results = results.filter(fixture => 
        new Date(fixture.date) >= filterOptions.dateRange.from!
      );
    }
    
    if (filterOptions.dateRange.to) {
      results = results.filter(fixture => 
        new Date(fixture.date) <= filterOptions.dateRange.to!
      );
    }
    
    // Apply home/away filter
    if (filterOptions.homeAway === 'home') {
      results = results.filter(fixture => 
        fixture.homeTeam === 'Banks o\' Dee FC'
      );
    } else if (filterOptions.homeAway === 'away') {
      results = results.filter(fixture => 
        fixture.awayTeam === 'Banks o\' Dee FC'
      );
    }
    
    setFilteredFixtures(results);
  }, [fixtures, searchQuery, filterOptions]);
  
  // Get unique competitions for filter dropdown
  const competitions = [...new Set(fixtures.map(fixture => fixture.competition))];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Fixtures Calendar</div>
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger 
                value="month" 
                onClick={() => setViewMode('month')}
                className={viewMode === 'month' ? 'bg-primary text-primary-foreground' : ''}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                onClick={() => setViewMode('week')}
                className={viewMode === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </TabsTrigger>
            </TabsList>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Filters Panel */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fixtures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Competition</label>
                  <Select
                    value={filterOptions.competition}
                    onValueChange={(value) => setFilterOptions({...filterOptions, competition: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All competitions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All competitions</SelectItem>
                      {competitions.map((competition) => (
                        <SelectItem key={competition} value={competition}>{competition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Date Range</label>
                  <DateRange 
                    onChange={(range) => 
                      setFilterOptions({...filterOptions, dateRange: range})
                    } 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Home/Away</label>
                  <Select
                    value={filterOptions.homeAway}
                    onValueChange={(value) => setFilterOptions({...filterOptions, homeAway: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All matches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All matches</SelectItem>
                      <SelectItem value="home">Home matches</SelectItem>
                      <SelectItem value="away">Away matches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterOptions({
                      competition: '',
                      dateRange: { from: undefined, to: undefined },
                      homeAway: 'all'
                    });
                    setSearchQuery('');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Calendar/List View */}
          <div>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <>
                {viewMode === 'list' ? (
                  <FixturesList fixtures={filteredFixtures} />
                ) : (
                  <div className="bg-card rounded-md border p-4">
                    <Calendar 
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="p-0"
                      modifiers={{
                        hasFixture: (date) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          return filteredFixtures.some(fixture => fixture.date === dateStr);
                        }
                      }}
                      modifiersStyles={{
                        hasFixture: {
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(var(--primary), 0.1)',
                          borderRadius: '100%',
                        }
                      }}
                    />
                    
                    {date && (
                      <div className="mt-4">
                        <h3 className="font-medium text-lg">
                          Fixtures for {format(date, 'MMMM d, yyyy')}
                        </h3>
                        {filteredFixtures.filter(
                          fixture => fixture.date === format(date, 'yyyy-MM-dd')
                        ).length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {filteredFixtures
                              .filter(fixture => fixture.date === format(date, 'yyyy-MM-dd'))
                              .map(fixture => (
                                <div key={fixture.id} className="p-3 border rounded-md hover:bg-muted">
                                  <div className="font-medium">{fixture.competition}</div>
                                  <div>
                                    {fixture.homeTeam} vs {fixture.awayTeam}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {fixture.time} • {fixture.venue || 'TBD'}
                                  </div>
                                  {fixture.isCompleted && (
                                    <div className="font-bold mt-1">
                                      {fixture.homeScore} - {fixture.awayScore}
                                    </div>
                                  )}
                                </div>
                              ))
                            }
                          </div>
                        ) : (
                          <div className="text-muted-foreground mt-2">
                            No fixtures on this date.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
