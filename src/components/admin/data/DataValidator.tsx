
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/services/supabase/supabaseClient';
import { TeamStats } from '@/components/league/types';

const DataValidator = () => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationResults, setValidationResults] = React.useState<string[]>([]);

  // Function to validate the table structure
  const validateLeagueTableStructure = async () => {
    try {
      setIsValidating(true);
      setValidationResults([]);
      const messages: string[] = [];

      // Get the table structure
      messages.push("Checking table structure...");
      const { data: tableInfo, error: tableError } = await supabase
        .from('highland_league_table')
        .select('*')
        .limit(1);

      if (tableError) {
        messages.push(`Error fetching table info: ${tableError.message}`);
        setValidationResults(messages);
        return;
      }

      if (!tableInfo || tableInfo.length === 0) {
        messages.push("No data found in highland_league_table");
        setValidationResults(messages);
        return;
      }

      // Check the structure of the first row
      const firstRow = tableInfo[0];
      messages.push("Table structure:");
      
      // Check each expected field
      const expectedFields = [
        'id', 'position', 'team', 'played', 'won', 'drawn', 'lost', 
        'goalsFor', 'goalsAgainst', 'goalDifference', 'points', 'form', 'logo'
      ];
      
      expectedFields.forEach(field => {
        const exists = field in firstRow;
        const value = firstRow[field];
        messages.push(`${field}: ${exists ? 'exists' : 'missing'}, value: ${JSON.stringify(value)}`);
      });
      
      setValidationResults(messages);
      toast.success("Validation completed");
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>League Data Validator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button 
              onClick={validateLeagueTableStructure} 
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Validate League Table Structure"}
            </Button>
          </div>

          {validationResults.length > 0 && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Validation Results:</h3>
              <pre className="text-xs overflow-auto max-h-96">
                {validationResults.join('\n')}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataValidator;
