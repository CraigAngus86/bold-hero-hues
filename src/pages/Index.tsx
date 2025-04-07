
// Around line 45, update the FeaturedItem to match FeaturedArticle
const featuredItems = featuredArticles.map(article => ({
  ...article,
  image_url: article.image_url || '/placeholder-image.jpg',
  category: article.category || 'News',
  publish_date: article.publish_date || new Date().toISOString(),
}));
