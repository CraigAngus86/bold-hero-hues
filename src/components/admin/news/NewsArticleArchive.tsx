
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, ArchiveRestore, Search } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { format, parseISO } from 'date-fns';

// Mock data for archived articles
const mockArchives: NewsArticle[] = [
  {
    id: 'a1',
    title: 'End of Season Awards 2022',
    slug: 'end-of-season-awards-2022',
    content: 'Recap of our annual end of season awards ceremony.',
    publish_date: '2022-05-30T18:00:00Z',
    is_draft: false,
    is_published: true,
    created_at: '2022-05-28T10:00:00Z',
    updated_at: '2022-05-30T18:00:00Z',
    author: 'Club Secretary',
    category: 'Events',
    image_url: '/placeholder.svg',
    is_featured: false,
    is_archived: true
  },
  {
    id: 'a2',
    title: 'Winter Training Schedule 2022',
    slug: 'winter-training-schedule-2022',
    content: 'Information about our winter training schedule for December through February.',
    publish_date: '2022-11-15T09:00:00Z',
    is_draft: false,
    is_published: true,
    created_at: '2022-11-10T14:00:00Z',
    updated_at: '2022-11-15T09:00:00Z',
    author: 'Coaching Staff',
    category: 'Training',
    image_url: '/placeholder.svg',
    is_featured: false,
    is_archived: true
  },
  {
    id: 'a3',
    title: 'Youth Team Tryouts - 2022 Season',
    slug: 'youth-team-tryouts-2022',
    content: 'Details about upcoming tryouts for our youth teams for the 2022 season.',
    publish_date: '2022-02-10T12:00:00Z',
    is_draft: false,
    is_published: true,
    created_at: '2022-02-01T09:30:00Z',
    updated_at: '2022-02-10T12:00:00Z',
    author: 'Youth Development Coach',
    category: 'Youth',
    image_url: '/placeholder.svg',
    is_featured: false,
    is_archived: true
  }
];

export const NewsArticleArchive: React.FC = () => {
  const [archives] = useState<NewsArticle[]>(mockArchives);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredArchives = archives.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(archives.map(a => a.category)))];

  const handleView = (article: NewsArticle) => {
    console.log('View archived article:', article);
    // In a real app, show a preview modal or redirect to article view
  };

  const handleRestore = (article: NewsArticle) => {
    console.log('Restore archived article:', article);
    // In a real app, restore the article from archive
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search archives..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem 
                key={category} 
                value={category}
              >
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredArchives.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No archived articles found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArchives.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{article.title}</h3>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Archived
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      <span>{article.category || 'Uncategorized'}</span>
                      <span className="mx-2">•</span>
                      <span>Published on {format(parseISO(article.publish_date), 'MMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <span>By {article.author || 'Unknown author'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleView(article)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRestore(article)}>
                      <ArchiveRestore className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
