
// Configuration for image storage
export const imageStorageConfig = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeMB: 10, // Maximum file size in MB
  buckets: {
    news: 'news_images',
    teams: 'player_images',
    sponsors: 'sponsor_logos',
    general: 'images',
    media: 'media'
  },
  thumbnailSizes: {
    small: 200,
    medium: 400,
    large: 800
  },
  defaultOptimization: {
    maxWidth: 1920,
    quality: 85
  }
};

// Image formats by use case
export const imageFormats = {
  webDisplay: {
    format: 'image/webp',
    quality: 80
  },
  thumbnails: {
    format: 'image/webp',
    quality: 60
  },
  highQuality: {
    format: 'image/jpeg',
    quality: 90
  }
};

// Default alt text patterns
export const defaultAltPatterns = {
  news: 'News image: {title}',
  player: '{name} - Banks o\' Dee FC player',
  sponsor: '{name} logo - Banks o\' Dee FC sponsor',
  fixture: 'Match between {homeTeam} and {awayTeam}',
  team: 'Banks o\' Dee FC team photo'
};

// Image path generators
export const imagePaths = {
  newsImage: (slug: string, filename: string) => `news/${slug}/${filename}`,
  playerImage: (playerId: string, filename: string) => `players/${playerId}/${filename}`,
  sponsorLogo: (sponsorId: string, filename: string) => `sponsors/${sponsorId}/${filename}`,
  mediaImage: (category: string, filename: string) => `media/${category}/${filename}`,
  fixtureImage: (fixtureId: string, filename: string) => `fixtures/${fixtureId}/${filename}`
};
