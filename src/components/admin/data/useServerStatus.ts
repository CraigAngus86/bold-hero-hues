
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
      console.log(`Checking server status at ${serverUrl}/api/status`);
      
      // Use AbortController to set a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(`${serverUrl}/api/status`, {
        headers: {
          ...(configToUse.apiKey ? { 'X-API-Key': configToUse.apiKey } : {}),
          'Accept': 'application/json'
        },
        signal: controller.signal,
        mode: 'cors', // Explicitly enable CORS
        credentials: 'omit' // Omit credentials for cross-origin requests
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
      
      return data;
    } catch (error) {
      console.error('Server status check failed:', error);
      setServerStatus('error');
      
      if (autoConnecting) {
        setAutoConnecting(false);
        toast.error("Could not connect to the Highland League server. Please check if the server is running.");
      }
      
      return null;
    } finally {
      setIsStatusChecking(false);
    }
  };

  // Set up initial check and periodic checks
  useEffect(() => {
    // Skip automatic check during development to reduce console noise
    if (import.meta.env.DEV) {
      console.log('Skipping automatic server check in development mode');
      return;
    }
    
    // Auto-check server status on initial load with a delay
    const initialCheckTimeout = setTimeout(() => {
      if (config.apiServerUrl) {
        checkServerStatus(config);
      } else {
        setServerStatus('error');
        setAutoConnecting(false);
        toast.info("No server configured. Using mock data instead.");
      }
    }, 1000);
    
    // Set up periodic server checks
    const interval = setInterval(() => {
      if (config.apiServerUrl) { // Only check if a server URL is configured
        checkServerStatus(config);
      }
    }, 300000); // Check every 5 minutes
    
    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(interval);
    };
  }, [config.apiServerUrl, config.apiKey]);

  return {
    isStatusChecking,
    serverStatus,
    lastUpdated,
    checkServerStatus
  };
};
