import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { DateRange } from "react-day-picker";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedFixturesFilterProps {
  selectedCompetition: string;
  setSelectedCompetition: (competition: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  showPast: boolean;
  setShowPast: (show: boolean) => void;
  showUpcoming: boolean;
  setShowUpcoming: (show: boolean) => void;
  competitions: string[];
  availableMonths: string[];
  venues?: string[];
  onClearFilters: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  dateRange?: DateRange | undefined;
  setDateRange?: (range: DateRange | undefined) => void;
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
  searchQuery = '',
  setSearchQuery = () => {},
  dateRange,
  setDateRange = () => {},
}) => {
  const [selectedVenue, setSelectedVenue] = useState<string>('All Venues');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  
  const handleClearFilters = () => {
    setSelectedVenue('All Venues');
    setSearchQuery('');
    setDateRange(undefined);
    onClearFilters();
    setIsAdvancedFilterOpen(false);
    setIsDatePickerOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Competition Filter */}
          <div>
            <Label htmlFor="competition-filter" className="mb-2 block text-sm font-medium">
              Competition
            </Label>
            <Select
              value={selectedCompetition}
              onValueChange={setSelectedCompetition}
            >
              <SelectTrigger id="competition-filter" className="w-full">
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

          {/* Month Filter */}
          <div>
            <Label htmlFor="month-filter" className="mb-2 block text-sm font-medium">
              Month
            </Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month-filter" className="w-full">
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

          {/* Date Range Picker */}
          <div>
            <Label htmlFor="date-range" className="mb-2 block text-sm font-medium">
              Date Range
            </Label>
            <Popover
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
                <div className="flex justify-end gap-2 p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateRange(undefined);
                      setIsDatePickerOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsDatePickerOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Input */}
          <div>
            <Label htmlFor="search-filter" className="mb-2 block text-sm font-medium">
              Search
            </Label>
            <div className="relative">
              <Input
                id="search-filter"
                placeholder="Search fixtures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-past"
              checked={showPast}
              onCheckedChange={setShowPast}
            />
            <Label htmlFor="show-past">Show Past Fixtures</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-upcoming" 
              checked={showUpcoming}
              onCheckedChange={setShowUpcoming}
            />
            <Label htmlFor="show-upcoming">Show Upcoming Fixtures</Label>
          </div>
          
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            size="sm"
          >
            Reset Filters
          </Button>
        </div>
        
        {/* Advanced Filters Panel */}
        {isAdvancedFilterOpen && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="text-sm font-medium mb-3">Advanced Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Venue Filter */}
              {venues.length > 0 && (
                <div>
                  <Label htmlFor="venue-filter" className="mb-2 block text-sm font-medium">
                    Venue
                  </Label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger id="venue-filter">
                      <SelectValue placeholder="Select Venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Venues">All Venues</SelectItem>
                      {venues.map((venue) => (
                        <SelectItem key={venue} value={venue}>
                          {venue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Additional filters can be added here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFixturesFilter;
