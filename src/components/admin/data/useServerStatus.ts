
import { useState, useEffect } from 'react';
import { ApiConfig } from '@/services/config/apiConfig';
import { toast } from "sonner";

export const useServerStatus = (config: ApiConfig) => {
  const [isStatusChecking, setIsStatusChecking] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [autoConnecting, setAutoConnecting] = useState(true);

  // Check server status
  const checkServerStatus = async (configToUse = config) => {
    try {
      setIsStatusChecking(true);
      
      // If no server URL is configured, don't try to connect
      if (!configToUse.apiServerUrl) {
        setServerStatus('error');
        setIsStatusChecking(false);
        if (autoConnecting) {
          setAutoConnecting(false);
          toast.info("No server configured. Using mock data instead.");
        }
        return;
      }
      
      const serverUrl = configToUse.apiServerUrl;
      
      // Use AbortController to set a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${serverUrl}/api/status`, {
        headers: {
          ...(configToUse.apiKey ? { 'X-API-Key': configToUse.apiKey } : {})
        },
        signal: controller.signal,
        mode: 'cors' // Explicitly enable CORS
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus('ok');
      setLastUpdated(data.lastUpdated);
      
      if (autoConnecting) {
        setAutoConnecting(false);
        toast.success("Connected to Highland League data server");
      }
    } catch (error) {
      console.error('Server status check failed:', error);
      setServerStatus('error');
      
      if (autoConnecting) {
        setAutoConnecting(false);
        toast.info("Could not connect to the Highland League server. Using mock data instead.");
      }
    } finally {
      setIsStatusChecking(false);
    }
  };

  // Set up initial check and periodic checks
  useEffect(() => {
    // Auto-check server status on initial load
    checkServerStatus(config);
    
    // Set up periodic server checks
    const interval = setInterval(() => {
      if (config.apiServerUrl) { // Only check if a server URL is configured
        checkServerStatus(config);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [config.apiServerUrl, config.apiKey]);

  return {
    isStatusChecking,
    serverStatus,
    lastUpdated,
    checkServerStatus
  };
};
