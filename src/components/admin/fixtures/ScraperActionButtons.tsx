
import { Button } from "@/components/ui/button";
import { Download, Loader2, PlayCircle, Recycle, TestTube } from "lucide-react";

interface ScraperActionButtonsProps {
  isLoading: boolean;
  testLoading: boolean;
  onTestFetch: () => void;
  onFetchFromBBC: () => void;
  onFetchFromHFL: () => void;
  success: boolean;
}

const ScraperActionButtons = ({
  isLoading,
  testLoading,
  onTestFetch,
  onFetchFromBBC,
  onFetchFromHFL,
  success
}: ScraperActionButtonsProps) => {
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        disabled={testLoading}
        onClick={onTestFetch}
        className="text-xs sm:text-sm"
      >
        {testLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Testing...
          </>
        ) : (
          <>
            <TestTube className="mr-2 h-3.5 w-3.5" /> Test Connection
          </>
        )}
      </Button>

      <Button
        variant="default"
        size="sm"
        disabled={isLoading}
        onClick={onFetchFromBBC}
        className="text-xs sm:text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Importing...
          </>
        ) : (
          <>
            <PlayCircle className="mr-2 h-3.5 w-3.5" /> Import from BBC Sport
          </>
        )}
      </Button>

      <Button
        variant="default"
        size="sm"
        disabled={isLoading}
        onClick={onFetchFromHFL}
        className="text-xs sm:text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Importing...
          </>
        ) : (
          <>
            <Recycle className="mr-2 h-3.5 w-3.5" /> Import from HFL Website
          </>
        )}
      </Button>
    </>
  );
};

export default ScraperActionButtons;
