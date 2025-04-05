
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ScraperStatusAlertsProps {
  error: string | null;
  success: boolean;
  resultsCount: number;
}

const ScraperStatusAlerts = ({ error, success, resultsCount }: ScraperStatusAlertsProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="relative">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2"
          onClick={() => console.log('TODO: Implement dismiss')}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-700">Success</AlertTitle>
        <AlertDescription className="text-green-600">
          {resultsCount === 0 ? (
            'No Banks O\' Dee fixtures found'
          ) : (
            `Successfully fetched ${resultsCount} Banks O' Dee ${resultsCount === 1 ? 'fixture' : 'fixtures'}`
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default ScraperStatusAlerts;
