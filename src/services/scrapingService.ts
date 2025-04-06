
// Create a minimal version of the missing exports
export interface ScrapeLog {
  id: string;
  source: string;
  status: string;
  items_found?: number;
  items_added?: number;
  items_updated?: number;
  error_message?: string;
  created_at: string;
}

export type ScrapingSource = "highland_league" | "club_website" | "other";

export const fetchScrapingLogs = async (): Promise<ScrapeLog[]> => {
  // Implementation would go here
  return [];
};

export const downloadScrapeData = async (source: ScrapingSource): Promise<Blob> => {
  // Implementation would go here
  return new Blob([""], { type: 'application/json' });
};
