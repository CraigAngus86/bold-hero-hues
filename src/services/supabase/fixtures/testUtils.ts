
import { Fixture } from '@/types/fixtures'; 
import { ImportResult } from '@/types/fixtures/importResults';

// Mock implementation for testing imports
export const mockImportResult = (
  fixtures: Fixture[], 
  added: number, 
  updated: number, 
  message: string = "Import successful"
): ImportResult => {
  return {
    success: true,
    added,
    updated,
    message,
    validFixtures: fixtures
  };
};

export const mockErrorImportResult = (
  message: string = "Import failed"
): ImportResult => {
  return {
    success: false,
    added: 0,
    updated: 0,
    message
  };
};
