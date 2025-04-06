import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  CalendarRange, 
  Filter, 
  X, 
  ChevronDown, 
  Bookmark,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    competition: string;
    month: string;
    showPast: boolean;
    showUpcoming: boolean;
    dateRange: DateRange | undefined;
    venue?: string;
    searchQuery?: string;
  };
}

interface EnhancedFixturesFilterProps {
  selectedCompetition: string;
  setSelectedCompetition: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  showPast: boolean;
  setShowPast: (value: boolean) => void;
  showUpcoming: boolean;
  setShowUpcoming: (value: boolean) => void;
  competitions: string[];
  availableMonths: string[];
  venues?: string[];
  onClearFilters: () => void;
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const EnhancedFixturesFilter: React.FC<EnhancedFixturesFilterProps> = ({
  selectedCompetition,
  setSelectedCompetition,
  selectedMonth,
  setSelectedMonth,
  showPast,
  setShowPast,
  showUpcoming,
  setShowUpcoming,
  competitions,
  availableMonths,
  venues = [],
  onClearFilters,
  dateRange,
  setDateRange,
  searchQuery = '',
  setSearchQuery = () => {},
}) => {
  const [selectedVenue, setSelectedVenue] = useState<string>('All Venues');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: '1',
      name: 'Highland League Fixtures',
      filters: {
        competition: 'Highland League',
        month: 'All Months',
        showPast: false,
        showUpcoming: true,
        dateRange: undefined,
      }
    },
    {
      id: '2',
      name: 'Recent Results',
      filters: {
        competition: 'All Competitions',
        month: 'All Months',
        showPast: true,
        showUpcoming: false,
        dateRange: undefined,
      }
    }
  ]);

  // Generate list of available venues
  const availableVenues = ['All Venues', ...venues];

  const hasActiveFilters = () => {
    return selectedCompetition !== 'All Competitions' || 
           selectedMonth !== 'All Months' || 
           selectedVenue !== 'All Venues' ||
           !showPast || 
           !showUpcoming || 
           !!dateRange ||
           !!searchQuery;
  };

  const handleClearFilters = () => {
    onClearFilters();
    setSelectedVenue('All Venues');
    if (setDateRange) setDateRange(undefined);
    if (setSearchQuery) setSearchQuery('');
  };

  const applyPreset = (preset: FilterPreset) => {
    setSelectedCompetition(preset.filters.competition);
    setSelectedMonth(preset.filters.month);
    setShowPast(preset.filters.showPast);
    setShowUpcoming(preset.filters.showUpcoming);
    
    if (setDateRange && preset.filters.dateRange) {
      setDateRange(preset.filters.dateRange);
    }
    
    if (preset.filters.venue) {
      setSelectedVenue(preset.filters.venue);
    } else {
      setSelectedVenue('All Venues');
    }
    
    if (setSearchQuery && preset.filters.searchQuery) {
      setSearchQuery(preset.filters.searchQuery);
    } else if (setSearchQuery) {
      setSearchQuery('');
    }
    
    toast.success(`Applied filter preset: ${preset.name}`);
  };

  const saveCurrentAsPreset = () => {
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: `Custom Preset ${presets.length + 1}`,
      filters: {
        competition: selectedCompetition,
        month: selectedMonth,
        showPast,
        showUpcoming,
        dateRange,
        venue: selectedVenue !== 'All Venues' ? selectedVenue : undefined,
        searchQuery: searchQuery || undefined
      }
    };
    
    setPresets([...presets, newPreset]);
    toast.success('Filter preset saved');
  };

  const renderFilterBadges = () => {
    const badges = [];
    
    if (selectedCompetition !== 'All Competitions') {
      badges.push(
        <Badge key="competition" variant="outline" className="flex items-center gap-1">
          {selectedCompetition}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setSelectedCompetition('All Competitions')} 
          />
        </Badge>
      );
    }
    
    if (selectedMonth !== 'All Months') {
      badges.push(
        <Badge key="month" variant="outline" className="flex items-center gap-1">
          {selectedMonth}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setSelectedMonth('All Months')} 
          />
        </Badge>
      );
    }
    
    if (selectedVenue !== 'All Venues') {
      badges.push(
        <Badge key="venue" variant="outline" className="flex items-center gap-1">
          {selectedVenue}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setSelectedVenue('All Venues')} 
          />
        </Badge>
      );
    }
    
    if (!showPast) {
      badges.push(
        <Badge key="past" variant="outline" className="flex items-center gap-1">
          Hide Past
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setShowPast(true)} 
          />
        </Badge>
      );
    }
    
    if (!showUpcoming) {
      badges.push(
        <Badge key="upcoming" variant="outline" className="flex items-center gap-1">
          Hide Upcoming
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setShowUpcoming(true)} 
          />
        </Badge>
      );
    }
    
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from).toLocaleDateString();
      const toDate = dateRange.to ? new Date(dateRange.to).toLocaleDateString() : fromDate;
      badges.push(
        <Badge key="dateRange" variant="outline" className="flex items-center gap-1">
          {fromDate} {dateRange.to ? `- ${toDate}` : ''}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setDateRange && setDateRange(undefined)} 
          />
        </Badge>
      );
    }
    
    if (searchQuery) {
      badges.push(
        <Badge key="search" variant="outline" className="flex items-center gap-1">
          "{searchQuery}"
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setSearchQuery('')} 
          />
        </Badge>
      );
    }
    
    return badges;
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search & Main Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search fixtures..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-1 items-center">
                <CalendarRange className="h-4 w-4 mr-1" />
                {dateRange?.from ? "Date Range" : "All Dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="end">
              <div className="space-y-2 p-2">
                <Typography.Small className="font-medium">Select Date Range</Typography.Small>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="outline" 
            className={cn("flex gap-1", showFilters ? "bg-gray-100" : "")}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-1" />
                Presets
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Saved Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {presets.map((preset) => (
                <DropdownMenuItem 
                  key={preset.id} 
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="h-4 w-4" />
                  {preset.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={saveCurrentAsPreset}
                className="flex items-center gap-2 cursor-pointer"
                disabled={!hasActiveFilters()}
              >
                <CheckCircle2 className="h-4 w-4" />
                Save Current Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Advanced Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="competition">Competition</Label>
            <Select
              value={selectedCompetition}
              onValueChange={setSelectedCompetition}
            >
              <SelectTrigger id="competition">
                <SelectValue placeholder="Select Competition" />
              </SelectTrigger>
              <SelectContent>
                {competitions.map((competition) => (
                  <SelectItem key={competition} value={competition}>
                    {competition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="month">Month</Label>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Select
              value={selectedVenue}
              onValueChange={setSelectedVenue}
            >
              <SelectTrigger id="venue">
                <SelectValue placeholder="Select Venue" />
              </SelectTrigger>
              <SelectContent>
                {availableVenues.map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col justify-end gap-2 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showPast" 
                checked={showPast} 
                onCheckedChange={() => setShowPast(!showPast)}
              />
              <Label htmlFor="showPast" className="cursor-pointer flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Show Past Matches
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showUpcoming" 
                checked={showUpcoming}
                onCheckedChange={() => setShowUpcoming(!showUpcoming)}
              />
              <Label htmlFor="showUpcoming" className="cursor-pointer flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Show Upcoming Matches
              </Label>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Badges */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600">Active Filters:</span>
          {renderFilterBadges()}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2 ml-2"
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedFixturesFilter;
