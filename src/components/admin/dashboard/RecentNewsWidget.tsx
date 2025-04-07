
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Eye, MessageCircle, Edit } from 'lucide-react';

// Mock data - in a real app, this would be fetched from an API
const newsArticles = [
  {
    id: '1',
    title: 'Banks o\' Dee secure victory against Formartine',
    excerpt: 'A stunning performance by the team leads to a 3-1 win in a thrilling match.',
    category: 'Match Report',
    author: 'John Smith',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    views: 238,
    comments: 12
  },
  {
    id: '2',
    title: 'New Signing: Michael Johnson joins from Buckie Thistle',
    excerpt: 'The club is delighted to announce the signing of striker Michael Johnson on a two-year deal.',
    category: 'Transfer News',
    author: 'Jane Doe',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    views: 412,
    comments: 27
  },
  {
    id: '3',
    title: 'Youth Academy Players Selected for Regional Squad',
    excerpt: 'Three of our youth players have been selected to represent the North Region in the upcoming tournament.',
    category: 'Youth',
    author: 'Robert Brown',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    views: 156,
    comments: 5
  }
];

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Match Report':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Transfer News':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Youth':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const RecentNewsWidget = () => {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Recent News</CardTitle>
        <button className="text-blue-500 text-sm font-medium hover:underline">
          Add News
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {newsArticles.map((article) => (
            <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={`${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {formatDate(article.publishedAt)}
                </div>
              </div>
              <h3 className="font-medium text-base mb-1">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>By {article.author}</div>
                <div className="flex space-x-3">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {article.views}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {article.comments}
                  </div>
                  <button className="flex items-center text-blue-500 hover:underline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-3 border-t">
          <button className="text-blue-500 font-medium text-sm w-full text-center hover:underline">
            View All News
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNewsWidget;
