
import React from 'react';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/types/news';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, RotateCcw } from 'lucide-react';

export const NewsArticleArchive: React.FC = () => {
  // These would be fetched from the API in a real application
  const mockArchived: NewsArticle[] = [
    {
      id: "archive-1",
      title: "End of Season Review",
      content: "Looking back at our successful season...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
      category: "Season Review",
      author: "John Writer",
      is_featured: false,
      slug: "end-of-season-review",
      created_at: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "archive-2",
      title: "Summer Transfer Recap",
      content: "A look at all our summer transfer activity...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      category: "Transfer News",
      author: "Sarah Editor",
      is_featured: true,
      slug: "summer-transfer-recap",
      created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "archive-3",
      title: "Preseason Tour Results",
      content: "Results and highlights from our preseason tour...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      category: "Match Reports",
      author: "Admin User",
      is_featured: false,
      slug: "preseason-tour-results",
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Archived Articles</h3>
        <p className="text-sm text-gray-500">Older articles removed from active rotation</p>
      </div>

      {mockArchived.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No archived articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockArchived.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              {article.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-75 grayscale transition-all hover:grayscale-0 hover:opacity-100" 
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Published {new Date(article.publish_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsArticleArchive;
