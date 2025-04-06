
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FixturePreviewProps {
  fixtures: any[] | null;  // Using any[] for now since the exact type might vary
  isLoading: boolean;
}

const FixturePreview: React.FC<FixturePreviewProps> = ({ fixtures, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Fixtures
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : fixtures && fixtures.length > 0 ? (
          <div className="space-y-4">
            {fixtures.slice(0, 3).map((fixture, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{format(new Date(fixture.date), 'dd MMM yyyy')}</span>
                  <span className="text-sm text-gray-600">{fixture.time || '15:00'}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>{fixture.homeTeam}</span>
                  <span className="font-bold mx-2">vs</span>
                  <span>{fixture.awayTeam}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {fixture.competition}, {fixture.venue || 'TBD'}
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/fixtures">
                <Button variant="outline" size="sm" className="w-full">
                  View All Fixtures
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming fixtures to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FixturePreview;
