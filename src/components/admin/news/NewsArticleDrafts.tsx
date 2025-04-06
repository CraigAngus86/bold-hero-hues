
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '@/types/news';

// Mock data for drafts
const mockDrafts: NewsArticle[] = [
  {
    id: 'd1',
    title: 'Upcoming Summer Training Camp',
    slug: 'upcoming-summer-training-camp',
    content: 'Details about our summer training camp schedule.',
    publish_date: null, // null publish_date indicates a draft
    is_draft: true,
    is_published: false,
    created_at: '2023-04-15T09:24:00Z',
    updated_at: '2023-04-15T10:30:00Z',
    author: 'Coach Williams',
    category: 'Training',
    image_url: '/placeholder.svg',
    is_featured: false
  },
  {
    id: 'd2',
    title: 'New Team Kit Reveal',
    slug: 'new-team-kit-reveal',
    content: 'First look at our new team kit for the upcoming season.',
    publish_date: null,
    is_draft: true,
    is_published: false,
    created_at: '2023-04-10T14:12:00Z',
    updated_at: '2023-04-10T16:45:00Z',
    author: 'Marketing Team',
    category: 'Announcement',
    image_url: '/placeholder.svg',
    is_featured: false
  },
  {
    id: 'd3',
    title: 'Season Review - Work in Progress',
    slug: 'season-review-wip',
    content: 'Analyzing the highlights and challenges from this past season.',
    publish_date: null,
    is_draft: true,
    is_published: false,
    created_at: '2023-04-05T11:30:00Z',
    updated_at: '2023-04-07T09:15:00Z',
    author: 'Technical Director',
    category: 'Analysis',
    image_url: '/placeholder.svg',
    is_featured: false
  }
];

export const NewsArticleDrafts: React.FC = () => {
  const [drafts] = useState<NewsArticle[]>(mockDrafts);

  const handlePreview = (draft: NewsArticle) => {
    console.log('Preview draft:', draft);
    // In a real app, show a preview modal
  };

  const handleEdit = (draft: NewsArticle) => {
    console.log('Edit draft:', draft);
    // In a real app, redirect to editor with draft ID
  };

  const handleDelete = (draft: NewsArticle) => {
    console.log('Delete draft:', draft);
    // In a real app, show confirmation and delete
  };

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No drafts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Draft Articles</h2>
      </div>

      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card key={draft.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{draft.title}</h3>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      Draft
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    <span>{draft.category || 'Uncategorized'}</span>
                    <span className="mx-2">•</span>
                    <span>By {draft.author || 'Unknown author'}</span>
                    <span className="mx-2">•</span>
                    <span>
                      Last edited {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {draft.content?.substring(0, 150)}...
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(draft)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(draft)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(draft)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
