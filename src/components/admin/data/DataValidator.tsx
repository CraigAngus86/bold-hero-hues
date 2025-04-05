
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { TeamStats } from '@/components/league/types';
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

const DataValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    teamCount: number;
    invalidTeams: string[];
    pointsIssues: string[];
    gamesPlayedIssues: string[];
    message: string;
  } | null>(null);

  const validateData = async () => {
    setIsValidating(true);
    try {
      // Fetch the data
      const data = await fetchLeagueTableFromSupabase();
      
      // Initialize validation state
      const results = {
        valid: true,
        teamCount: data.length,
        invalidTeams: [] as string[],
        pointsIssues: [] as string[],
        gamesPlayedIssues: [] as string[],
        message: 'Data validation successful'
      };
      
      // Check each team
      data.forEach((team: TeamStats) => {
        // Check for invalid team names
        if (!team.team || team.team.length <= 2 || !isNaN(Number(team.team))) {
          results.valid = false;
          results.invalidTeams.push(`Position ${team.position}: "${team.team}"`);
        }
        
        // Check points calculation
        const calculatedPoints = (team.won * 3) + team.drawn;
        if (Math.abs(calculatedPoints - team.points) > 2) {
          results.valid = false;
          results.pointsIssues.push(
            `${team.team}: Points ${team.points} but calculated ${calculatedPoints}`
          );
        }
        
        // Check games played
        const totalGames = team.won + team.drawn + team.lost;
        if (team.played !== totalGames) {
          results.valid = false;
          results.gamesPlayedIssues.push(
            `${team.team}: Played ${team.played} but W/D/L adds to ${totalGames}`
          );
        }
      });
      
      // Set overall message
      if (!results.valid) {
        results.message = 'Data validation failed with issues';
      }
      
      setValidationResults(results);
      
      if (results.valid) {
        toast.success('Data validation passed successfully');
      } else {
        toast.error('Data validation found issues');
      }
      
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate data');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Validator</CardTitle>
          <CardDescription>
            Check data structure and quality
          </CardDescription>
        </div>
        <Button
          onClick={validateData}
          disabled={isValidating}
          variant="outline"
          size="sm"
        >
          {isValidating ? 'Validating...' : 'Validate Data'}
        </Button>
      </CardHeader>
      <CardContent>
        {validationResults ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant={validationResults.valid ? "outline" : "destructive"}
                className={validationResults.valid ? "border-green-500 text-green-600" : ""}
              >
                {validationResults.valid ? (
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                )}
                {validationResults.valid ? 'VALID' : 'INVALID'}
              </Badge>
              <span className="text-sm text-gray-600">
                {validationResults.teamCount} teams found
              </span>
            </div>
            
            {/* Invalid Team Names */}
            {validationResults.invalidTeams.length > 0 && (
              <div className="border border-red-200 rounded-md p-3 bg-red-50">
                <h3 className="font-medium flex items-center text-red-700 mb-1">
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  Invalid Team Names
                </h3>
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {validationResults.invalidTeams.map((issue, i) => (
                    <li key={`team-${i}`}>{issue}</li>
                  ))}
                </ul>
                <div className="mt-2 text-xs text-red-600">
                  <strong>Fix:</strong> Team names should be valid strings, not numbers.
                  Try refreshing data or check the scraping function.
                </div>
              </div>
            )}
            
            {/* Points Calculation Issues */}
            {validationResults.pointsIssues.length > 0 && (
              <div className="border border-yellow-200 rounded-md p-3 bg-yellow-50">
                <h3 className="font-medium flex items-center text-yellow-700 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Points Calculation Issues
                </h3>
                <ul className="text-sm text-yellow-600 list-disc list-inside">
                  {validationResults.pointsIssues.map((issue, i) => (
                    <li key={`points-${i}`}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Games Played Issues */}
            {validationResults.gamesPlayedIssues.length > 0 && (
              <div className="border border-yellow-200 rounded-md p-3 bg-yellow-50">
                <h3 className="font-medium flex items-center text-yellow-700 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Games Played Issues
                </h3>
                <ul className="text-sm text-yellow-600 list-disc list-inside">
                  {validationResults.gamesPlayedIssues.map((issue, i) => (
                    <li key={`games-${i}`}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* All Valid */}
            {validationResults.valid && (
              <div className="border border-green-200 rounded-md p-3 bg-green-50">
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  All data validation checks passed successfully
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Click 'Validate Data' to check for common issues in the league table data
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataValidator;
