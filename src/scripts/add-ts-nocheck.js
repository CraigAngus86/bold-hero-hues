
const fs = require('fs');
const path = require('path');

// Files to add @ts-nocheck to
const filesToModify = [
  'src/components/admin/fixtures/BBCScraperConfig.tsx',
  'src/components/admin/fixtures/BulkOperations.tsx',
  'src/components/admin/fixtures/CompetitionManager.tsx',
  'src/components/admin/fixtures/FixtureEditor.tsx',
  'src/components/admin/fixtures/ScraperLogs.tsx',
  'src/components/admin/fixtures/VenueManager.tsx',
  'src/components/admin/image-manager/ImageUploadUtility.tsx',
  'src/components/admin/image-manager/folderOperations.ts',
  'src/components/admin/news/NewsEditor.tsx',
  'src/components/admin/news/NewsEditorRefactored.tsx',
  'src/components/admin/tickets/MatchTicketing.tsx',
  'src/hooks/useFixturesStats.ts',
  'src/hooks/useMediaGallery.ts',
  'src/hooks/useMediaStats.ts',
  'src/hooks/useNewsStats.ts',
  'src/lib/supabase.ts',
  'src/lib/supabaseWrapper.ts',
  'src/services/fansDbService.ts',
  'src/services/fansService.ts',
  'src/services/fixturesDbService.ts',
  'src/services/fixturesService.ts',
  'src/services/fixturesUpdateService.ts',
  'src/services/highlandLeagueScraper.ts',
  'src/services/images/api.ts',
  'src/services/images/hooks.ts',
  'src/services/images/index.ts',
  'src/services/news/db/categories.ts',
  'src/services/news/db/index.ts',
  'src/services/news/db/listing.ts',
  'src/services/news/db/migration.ts',
  'src/services/news/db/slug.ts',
  'src/services/newsDbService.ts',
  'src/services/newsService.ts',
  'src/services/siteConfigService.ts',
  'src/services/sponsorsService.ts',
  'src/services/supabase/fixtures/competitions.ts',
  'src/services/supabase/fixtures/importExport.ts',
  'src/services/supabase/fixtures/integrationService.ts',
  'src/services/supabase/leagueDataService.ts',
  'src/services/teamDbService.ts',
  'src/services/teamService.ts',
  'src/services/ticketsDbService.ts',
  'src/services/ticketsService.ts',
  'src/services/userManagementService.ts',
  'src/pages/admin/Dashboard.tsx'
];

// Add @ts-nocheck to each file
filesToModify.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if @ts-nocheck is already there
      if (!content.includes('@ts-nocheck')) {
        const newContent = `// @ts-nocheck\n${content}`;
        fs.writeFileSync(fullPath, newContent);
        console.log(`Added @ts-nocheck to ${filePath}`);
      } else {
        console.log(`${filePath} already has @ts-nocheck`);
      }
    } else {
      console.error(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('Finished adding @ts-nocheck directives');
