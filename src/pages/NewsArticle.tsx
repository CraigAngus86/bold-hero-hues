
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import BaseText from '@/components/ui/BaseText';
import { Card } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Mock data for the news article
const mockArticle = {
  id: '1',
  title: 'Banks O\' Dee Secure Important Victory',
  content: `
    <p>The Banks O' Dee first team secured an important victory in their quest for the league title with a convincing 3-0 win against their rivals.</p>
    
    <p>Goals from Kane Winton, Mark Gilmour, and Lachie MacLeod sealed the win for the home side, who dominated possession throughout the match.</p>
    
    <p>Manager Josh Winton was delighted with the performance, stating: "The lads showed great character today against a tough opponent. We controlled the game from start to finish and fully deserved the three points."</p>
    
    <p>Banks O' Dee have now gone five games unbeaten in the league, putting them in a strong position as they head into the final stretch of the season.</p>
    
    <p>The team's next fixture will be an away match against Fraserburgh FC on Tuesday evening, where they'll look to continue their good form.</p>
    
    <p>Supporters are encouraged to make the journey to provide their backing for the team in what will be another crucial match in the title race.</p>
  `,
  image: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
  date: '2025-04-01',
  author: 'Club Reporter',
  category: 'Match Report'
};

const NewsArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the article data based on the ID
  // const article = useFetchArticle(id);
  const article = mockArticle; // Using mock data for now
  
  // Format date to be more user-friendly (e.g., "11 June 2025")
  const formatUserFriendlyDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <MainLayout>
      <Container size="md" padding="lg" className="py-8">
        <Card className="overflow-hidden border-none shadow-lg bg-white">
          {/* Article Header */}
          <div className="relative">
            <AspectRatio ratio={21/9}>
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center text-white/80 mb-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatUserFriendlyDate(article.date)}</span>
                {article.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{article.author}</span>
                  </>
                )}
              </div>
              <BaseText variant="h1" className="text-white mb-2">
                {article.title}
              </BaseText>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="p-6 md:p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          
          {/* Article Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="bg-secondary-300 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <button 
                onClick={() => window.history.back()} 
                className="text-primary-800 hover:text-primary-600 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Back to News
              </button>
            </div>
          </div>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default NewsArticle;
