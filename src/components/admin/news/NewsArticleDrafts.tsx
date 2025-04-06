
import React from 'react';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/types/news';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Edit } from 'lucide-react';

export const NewsArticleDrafts: React.FC = () => {
  // These would be fetched from the API in a real application
  const mockDrafts: NewsArticle[] = [
    {
      id: "draft-1",
      title: "Upcoming Match Preview Draft",
      content: "This is a draft of the upcoming match preview...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in future
      category: "Match Preview",
      author: "John Editor",
      is_featured: false,
      slug: "upcoming-match-preview-draft",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "draft-2",
      title: "Team News Draft",
      content: "This is a draft of the latest team news...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day in future
      category: "Team News",
      author: "Sarah Writer",
      is_featured: false,
      slug: "team-news-draft",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "draft-3",
      title: "Season Tickets Information Draft",
      content: "This is a draft about season tickets...",
      image_url: "/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png",
      publish_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days in future
      category: "Club News",
      author: "Admin User",
      is_featured: true,
      slug: "season-tickets-information-draft",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Draft Articles</h3>
        <p className="text-sm text-gray-500">Articles in progress that are not yet published</p>
      </div>

      {mockDrafts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No draft articles found</p>
          <Button variant="outline" className="mt-4">Create New Draft</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockDrafts.map((draft) => (
            <Card key={draft.id} className="overflow-hidden">
              {draft.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={draft.image_url} 
                    alt={draft.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{draft.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Draft • Last edited {new Date(draft.updated_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {draft.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Draft
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsArticleDrafts;
