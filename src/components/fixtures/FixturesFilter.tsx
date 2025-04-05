
import { Filter, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FixturesFilterProps {
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
  onClearFilters: () => void;
}

const FixturesFilter = ({
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
  onClearFilters
}: FixturesFilterProps) => {
  const noFiltersApplied = 
    selectedCompetition === "All Competitions" && 
    selectedMonth === "All Months" && 
    showPast && 
    showUpcoming;

  return (
    <div className="mb-10 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-team-blue" />
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${showPast ? 'bg-team-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setShowPast(!showPast)}
            >
              Past Results
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${showUpcoming ? 'bg-team-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setShowUpcoming(!showUpcoming)}
            >
              Upcoming Fixtures
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month || "all-months"}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Competition" />
            </SelectTrigger>
            <SelectContent>
              {competitions.map((comp) => (
                <SelectItem key={comp} value={comp || "all-competitions"}>
                  {comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!noFiltersApplied && (
        <div className="mt-4 text-center">
          <button 
            className="text-team-blue hover:underline text-sm"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FixturesFilter;
