import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScraperSettings {
  url: string;
  frequency: string;
  validateData: boolean;
  autoCorrect: boolean;
  retryOnError: boolean;
  teamNameMapping: Record<string, string>;
}

const ScraperConfigPanel = () => {
  const [settings, setSettings] = useState<ScraperSettings>({
    url: 'https://www.bbc.com/sport/football/scottish-highland-league/table',
    frequency: 'daily',
    validateData: true,
    autoCorrect: false,
    retryOnError: true,
    teamNameMapping: {
      'Banks O\'Dee': 'Banks o\' Dee',
      'Buckie': 'Buckie Thistle',
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'league_scraper_settings')
          .single();
        
        if (error) {
          console.error('Error loading scraper settings:', error);
          toast.error('Failed to load scraper settings');
        } else if (data && data.value) {
          try {
            const parsedSettings = JSON.parse(data.value);
            setSettings(parsedSettings);
          } catch (parseError) {
            console.error('Error parsing settings:', parseError);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      const settingsJson = JSON.stringify(settings);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'league_scraper_settings',
          value: settingsJson
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Scraper settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save scraper settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChange = (field: keyof ScraperSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleMappingChange = (originalName: string, newName: string) => {
    setSettings(prev => ({
      ...prev,
      teamNameMapping: {
        ...prev.teamNameMapping,
        [originalName]: newName
      }
    }));
  };
  
  const addNewMapping = () => {
    setSettings(prev => ({
      ...prev,
      teamNameMapping: {
        ...prev.teamNameMapping,
        '': ''
      }
    }));
  };
  
  const removeMapping = (originalName: string) => {
    const updatedMapping = { ...settings.teamNameMapping };
    delete updatedMapping[originalName];
    
    setSettings(prev => ({
      ...prev,
      teamNameMapping: updatedMapping
    }));
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Scraper Configuration...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-team-blue">
          BBC Scraper Configuration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Alert variant="info" className="mb-4">
            <AlertDescription>
              Configure how league data is scraped from the BBC Sport website. These settings affect how often and how accurately the league table is updated.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="scraper-url">BBC Highland League URL</Label>
            <Input
              id="scraper-url"
              value={settings.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://www.bbc.com/sport/football/scottish-highland-league/table"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scraper-frequency">Scraping Frequency</Label>
            <Select 
              value={settings.frequency} 
              onValueChange={(value) => handleChange('frequency', value)}
            >
              <SelectTrigger id="scraper-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily (Recommended)</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="match-days">Match Days Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-lg font-semibold">Validation & Error Handling</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="validate-data"
              checked={settings.validateData}
              onCheckedChange={(checked) => handleChange('validateData', checked)}
            />
            <Label htmlFor="validate-data">Validate data before saving</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="auto-correct" 
              checked={settings.autoCorrect}
              onCheckedChange={(checked) => handleChange('autoCorrect', checked)}
            />
            <Label htmlFor="auto-correct">Auto-correct common data issues</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="retry-on-error" 
              checked={settings.retryOnError}
              onCheckedChange={(checked) => handleChange('retryOnError', checked)}
            />
            <Label htmlFor="retry-on-error">Retry on error (up to 3 times)</Label>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-lg font-semibold">Team Name Mapping</h3>
          <p className="text-sm text-gray-600 mb-2">Map how BBC team names appear to our preferred versions</p>
          
          <div className="space-y-2">
            {Object.entries(settings.teamNameMapping).map(([original, mapped], index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-center">
                <Input
                  placeholder="BBC Name"
                  value={original}
                  onChange={(e) => {
                    const oldKey = original;
                    const newKey = e.target.value;
                    const updatedMapping = { ...settings.teamNameMapping };
                    delete updatedMapping[oldKey];
                    updatedMapping[newKey] = mapped;
                    handleChange('teamNameMapping', updatedMapping);
                  }}
                  className="col-span-2"
                />
                <span className="text-center">→</span>
                <Input
                  placeholder="Our Name"
                  value={mapped}
                  onChange={(e) => handleMappingChange(original, e.target.value)}
                  className="col-span-2"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeMapping(original)}
                  className="ml-auto"
                >
                  ✕
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addNewMapping}
              className="w-full mt-2"
            >
              + Add New Mapping
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 space-x-2">
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScraperConfigPanel;
