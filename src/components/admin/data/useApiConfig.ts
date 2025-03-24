
import { useState, useEffect } from 'react';
import { getApiConfig, saveApiConfig, DEFAULT_API_CONFIG, ApiConfig } from '@/services/config/apiConfig';

export const useApiConfig = () => {
  // Initialize with default config that includes apiServerUrl
  const [config, setConfig] = useState<ApiConfig>({
    ...DEFAULT_API_CONFIG,
    apiServerUrl: DEFAULT_API_CONFIG.apiServerUrl || 'http://localhost:3001'
  });

  // Load config on initial mount
  useEffect(() => {
    const loadedConfig = getApiConfig();
    
    // Merge with default server URL if needed
    const configWithServer = {
      ...loadedConfig,
      apiServerUrl: loadedConfig.apiServerUrl || 'http://localhost:3001'
    };
    
    setConfig(configWithServer);
    
    // Auto-save the configuration
    saveApiConfig(configWithServer);
  }, []);

  // Handle changes to text input fields
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle changes to switch components
  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig({
      ...config,
      [name]: checked
    });
  };

  // Save configuration
  const saveConfig = () => {
    saveApiConfig(config);
    return config;
  };

  // Reset config to defaults
  const resetToDefaults = () => {
    setConfig(DEFAULT_API_CONFIG);
    return DEFAULT_API_CONFIG;
  };

  return {
    config,
    setConfig,
    handleConfigChange,
    handleSwitchChange,
    saveConfig,
    resetToDefaults
  };
};
