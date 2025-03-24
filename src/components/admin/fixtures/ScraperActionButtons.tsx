
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe } from "lucide-react";

interface ScraperActionButtonsProps {
  isLoading: boolean;
  testLoading: boolean;
  onTestFetch: () => Promise<void>;
  onFetchFromBBC: () => Promise<void>;
  onFetchFromHFL: () => Promise<void>;
  success?: boolean;
}

const ScraperActionButtons: React.FC<ScraperActionButtonsProps> = ({
  isLoading,
  testLoading,
  onTestFetch,
  onFetchFromBBC,
  onFetchFromHFL,
  success
}) => {
  return (
    <>
      <Button
        className="w-full sm:w-auto"
        onClick={onTestFetch}
        disabled={testLoading || isLoading}
        variant="outline"
      >
        {testLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Test BBC Sport Connection
          </>
        )}
      </Button>
      
      <Button
        className="w-full sm:w-auto"
        onClick={onFetchFromBBC}
        disabled={isLoading || testLoading}
      >
        {isLoading && success === false ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Fetching from BBC Sport...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Fetch from BBC Sport
          </>
        )}
      </Button>
      
      <Button
        className="w-full sm:w-auto"
        onClick={onFetchFromHFL}
        disabled={isLoading || testLoading}
        variant="secondary"
      >
        {isLoading && success === true ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Fetching from HFL...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Fetch from Highland League
          </>
        )}
      </Button>
    </>
  );
};

export default ScraperActionButtons;
