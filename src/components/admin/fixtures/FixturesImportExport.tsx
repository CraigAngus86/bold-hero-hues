
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Import, Upload, Download } from 'lucide-react';
import { Match } from '@/components/fixtures/types';
import { importMockDataToSupabase } from '@/services/supabase/fixturesService';
import { toast } from 'sonner';

interface FixturesImportExportProps {
  onImportComplete: () => Promise<void>;
  onClose: () => void;
  currentMatches: Match[];
}

const FixturesImportExport: React.FC<FixturesImportExportProps> = ({ 
  onImportComplete,
  onClose,
  currentMatches
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      setIsImporting(true);
      
      // Read the file content
      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, 'UTF-8');
      
      fileReader.onload = async (e) => {
        try {
          if (!e.target || typeof e.target.result !== 'string') {
            toast.error('Failed to read file');
            return;
          }
          
          // Parse the JSON data
          const matches = JSON.parse(e.target.result);
          
          if (!Array.isArray(matches)) {
            toast.error('Invalid file format - expected an array of matches');
            return;
          }
          
          // Validate basic structure
          const validMatches = matches.filter(match => 
            match.homeTeam && 
            match.awayTeam && 
            match.date &&
            match.time &&
            match.competition
          );
          
          if (validMatches.length !== matches.length) {
            toast.warning(`${matches.length - validMatches.length} invalid matches will be skipped`);
          }
          
          if (validMatches.length === 0) {
            toast.error('No valid matches found in the file');
            return;
          }
          
          // Confirm before import
          if (window.confirm(`Are you sure you want to import ${validMatches.length} matches?`)) {
            // Import to Supabase (modify this to use your import function)
            const success = await importMockDataToSupabase(validMatches);
            
            if (success) {
              toast.success(`Successfully imported ${validMatches.length} matches`);
              await onImportComplete();
              onClose();
            } else {
              toast.error('Failed to import matches');
            }
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          toast.error('Invalid JSON format');
        } finally {
          setIsImporting(false);
        }
      };
      
      fileReader.onerror = () => {
        toast.error('Error reading file');
        setIsImporting(false);
      };
      
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast.error('Failed to import fixtures');
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    try {
      // Prepare the data for export (strip any internal fields)
      const exportData = currentMatches.map(match => ({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time,
        competition: match.competition,
        venue: match.venue,
        isCompleted: match.isCompleted,
        homeScore: match.isCompleted ? match.homeScore : undefined,
        awayScore: match.isCompleted ? match.awayScore : undefined
      }));
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `banks-o-dee-fixtures-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      toast.success('Fixtures exported successfully');
      
    } catch (error) {
      console.error('Error exporting fixtures:', error);
      toast.error('Failed to export fixtures');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Import Fixtures</h3>
        <p className="text-sm text-muted-foreground">
          Import fixtures from a JSON file. The file should contain an array of match objects.
        </p>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            onChange={handleFileChange} 
            accept=".json" 
            className="flex-1"
          />
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || isImporting}
            className="whitespace-nowrap"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-lg font-medium">Export Fixtures</h3>
        <p className="text-sm text-muted-foreground">
          Export all fixtures to a JSON file.
        </p>
        <Button 
          onClick={handleExport} 
          disabled={currentMatches.length === 0}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Export {currentMatches.length} Fixtures
        </Button>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

// Styled file input component
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default FixturesImportExport;
