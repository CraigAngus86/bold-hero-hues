
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  [key: string]: string;
}

/**
 * Get all site configuration settings
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
      
    if (error) throw error;
    
    // Convert array of key-value pairs to a single object
    const config: SiteConfig = {};
    data.forEach((item) => {
      config[item.key] = item.value;
    });
    
    return config;
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    return {};
  }
}

/**
 * Get a specific site configuration value
 */
export async function getSiteConfigValue(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No matching row found
        return null;
      }
      throw error;
    }
    
    return data.value;
  } catch (error) {
    console.error(`Error fetching site configuration value (${key}):`, error);
    return null;
  }
}

/**
 * Update multiple site configuration settings
 */
export async function updateSiteConfig(config: SiteConfig): Promise<{ success: boolean; error: string | null }> {
  try {
    // For each key-value pair, upsert the setting
    const promises = Object.entries(config).map(([key, value]) => 
      supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })
    );
    
    // Wait for all operations to complete
    const results = await Promise.all(promises);
    
    // Check for any errors
    const errors = results
      .filter(result => result.error)
      .map(result => result.error);
    
    if (errors.length > 0) {
      throw new Error(`Failed to update ${errors.length} settings: ${errors.map(e => e?.message).join(', ')}`);
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating site configuration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Update a single site configuration value
 */
export async function updateSiteConfigValue(key: string, value: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' });
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error updating site configuration value (${key}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Delete a site configuration setting
 */
export async function deleteSiteConfigValue(key: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting site configuration value (${key}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get default site configuration
 */
export function getDefaultSiteConfig(): SiteConfig {
  return {
    'site.name': 'Banks o\' Dee FC',
    'site.description': 'Official website of Banks o\' Dee Football Club',
    'site.url': 'https://banksofdeefc.co.uk',
    'site.email': 'info@banksofdeefc.co.uk',
    'site.phone': '+44 1234 567890',
    'site.address': 'Spain Park, Aberdeen',
    'social.facebook': 'https://facebook.com/banksofdeefc',
    'social.twitter': 'https://twitter.com/banksofdeefc',
    'social.instagram': 'https://instagram.com/banksofdeefc',
    'social.youtube': '',
    'seo.title': 'Banks o\' Dee FC | Official Website',
    'seo.description': 'Official website of Banks o\' Dee Football Club - Aberdeen\'s Highland League team',
    'seo.ogImage': '/lovable-uploads/banks-o-dee-logo.png',
    'analytics.googleId': '',
    'maintenance.enabled': 'false',
    'maintenance.message': 'We\'re currently updating our website. Please check back soon.',
  };
}

/**
 * Reset site configuration to defaults
 */
export async function resetToDefaultSiteConfig(): Promise<{ success: boolean; error: string | null }> {
  try {
    const defaultConfig = getDefaultSiteConfig();
    return await updateSiteConfig(defaultConfig);
  } catch (error) {
    console.error('Error resetting site configuration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
