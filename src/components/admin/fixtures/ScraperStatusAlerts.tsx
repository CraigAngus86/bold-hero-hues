
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Globe } from "lucide-react";

interface ScraperStatusAlertsProps {
  error: string | null;
  success: boolean;
  resultsCount: number;
}

const ScraperStatusAlerts: React.FC<ScraperStatusAlertsProps> = ({ 
  error, 
  success, 
  resultsCount 
}) => {
  return (
    <>
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertTitle>Data Sources</AlertTitle>
        <AlertDescription>
          This tool offers two data sources: The official Highland Football League website and BBC Sport's
          Highland League section. The BBC source typically provides more reliable structured data.
        </AlertDescription>
      </Alert>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Successfully fetched {resultsCount} fixtures
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ScraperStatusAlerts;
