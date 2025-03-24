
import React, { useState } from 'react';
import { AlertCircle, Server, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerStatus } from './useServerStatus';
import { ApiConfig } from '@/services/config/apiConfig';
import { toast } from "sonner";

interface ServerMonitorProps {
  config: ApiConfig;
}

const ServerMonitor: React.FC<ServerMonitorProps> = ({ config }) => {
  const { serverStatus, isStatusChecking, lastUpdated, checkServerStatus } = useServerStatus(config);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState(false);

  const handleCheckStatus = async () => {
    try {
      setLastError(null);
      await checkServerStatus();
      toast.success("Server status check complete");
    } catch (error) {
      console.error("Error checking server status:", error);
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      toast.error("Failed to check server status");
    }
  };

  const renderServerStatus = () => {
    switch (serverStatus) {
      case 'ok':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Connected</span>
            {lastUpdated && (
              <Badge variant="outline" className="ml-2">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </Badge>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Error connecting to server</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Server className="h-5 w-5" />
            <span>Status unknown</span>
          </div>
        );
    }
  };

  const troubleshootingSteps = [
    {
      title: "Check server is running",
      description: "Make sure you've started the Node.js server. Navigate to the server directory and run 'npm start'."
    },
    {
      title: "Verify server URL",
      description: `Currently configured to: ${config.apiServerUrl || 'Not configured'}. Default should be http://localhost:3001`
    },
    {
      title: "Check API key",
      description: config.apiKey ? "API key is configured." : "No API key is configured. This is optional and only needed if your server requires it."
    },
    {
      title: "Check browser console for errors",
      description: "Open your browser's developer tools (F12) and check the console tab for specific error messages."
    },
    {
      title: "CORS issues",
      description: "If you're seeing CORS errors in the console, make sure your server has proper CORS configuration enabled."
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5" />
          Server Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Status:</div>
            {renderServerStatus()}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium">Server URL:</div>
            <div className="font-mono text-sm">
              {config.apiServerUrl || 'Not configured'}
            </div>
          </div>

          {serverStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                Could not connect to the Highland League server. See troubleshooting steps below.
              </AlertDescription>
            </Alert>
          )}

          {serverStatus === 'error' && (
            <Accordion
              type="single" 
              collapsible
              value={expandedTroubleshooting ? "troubleshooting" : ""}
              onValueChange={(val) => setExpandedTroubleshooting(val === "troubleshooting")}
            >
              <AccordionItem value="troubleshooting">
                <AccordionTrigger>Troubleshooting Steps</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    {troubleshootingSteps.map((step, index) => (
                      <div key={index} className="border-b pb-2 last:border-0">
                        <div className="font-medium">{index + 1}. {step.title}</div>
                        <div className="text-muted-foreground mt-1">{step.description}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCheckStatus}
              disabled={isStatusChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isStatusChecking ? 'animate-spin' : ''}`} />
              {isStatusChecking ? 'Checking...' : 'Check Connection'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check server connection status</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
