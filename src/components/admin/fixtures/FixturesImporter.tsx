
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Check, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Fixture } from '@/types/fixtures';
import { supabase } from '@/lib/supabase';

interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  fixtures?: Fixture[];
}

const FixturesImporter = () => {
  const [csvData, setCsvData] = useState<string>('');
  const [importing, setImporting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const validateFixtureData = (data: any[]): Fixture[] => {
    // Basic validation
    return data.filter(item => 
      item.date && 
      item.time && 
      item.home_team && 
      item.away_team && 
      item.competition
    ).map(item => ({
      id: item.id || undefined,
      date: item.date,
      time: item.time,
      home_team: item.home_team,
      away_team: item.away_team,
      competition: item.competition,
      venue: item.venue || undefined,
      is_completed: item.is_completed === 'true' || item.is_completed === true || false,
      home_score: item.home_score ? parseInt(item.home_score, 10) : undefined,
      away_score: item.away_score ? parseInt(item.away_score, 10) : undefined,
      ticket_link: item.ticket_link || undefined,
      season: item.season || '2024-2025',
      import_date: new Date().toISOString(),
      source: 'csv-import'
    }));
  };

  const handleImport = async () => {
    setImporting(true);
    setSuccess(false);
    setError(null);

    try {
      const parsedData = parseCsv(csvData);
      const validatedFixtures = validateFixtureData(parsedData);

      if (!validatedFixtures || validatedFixtures.length === 0) {
        throw new Error('No valid fixture data found in CSV.');
      }

      // Upload to Supabase
      const { error } = await supabase
        .from('fixtures')
        .insert(validatedFixtures);

      if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
      }

      setSuccess(true);
      toast({
        title: "Fixtures Imported",
        description: `${validatedFixtures.length} fixtures have been successfully imported.`
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during import.');
      toast({
        title: "Import Failed",
        description: err.message || "An error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const parseCsv = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const results: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      if (data.length === headers.length) {
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = data[j].trim();
        }
        results.push(obj);
      }
    }
    return results;
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Label htmlFor="csv-upload" className="text-sm font-medium">
          Upload Fixtures CSV
        </Label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={importing}
          className="hidden"
        />
        <Button asChild variant="outline" disabled={importing}>
          <label htmlFor="csv-upload" className="flex items-center space-x-2">
            <UploadCloud className="h-4 w-4" />
            <span>{importing ? 'Uploading...' : 'Select CSV File'}</span>
          </label>
        </Button>
        {csvData && (
          <Textarea
            value={csvData}
            readOnly
            rows={4}
            className="text-xs"
          />
        )}
        <Button onClick={handleImport} disabled={importing || !csvData}>
          {importing ? (
            <span className="flex items-center">
              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </span>
          ) : (
            'Import Fixtures'
          )}
        </Button>
        {success && (
          <div className="text-green-500 flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Fixtures imported successfully!</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FixturesImporter;
