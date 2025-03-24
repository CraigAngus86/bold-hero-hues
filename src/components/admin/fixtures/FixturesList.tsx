
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ScrapedFixture } from '@/types/fixtures';

interface FixturesListProps {
  fixtures: ScrapedFixture[];
  onExport: () => void;
}

const FixturesList: React.FC<FixturesListProps> = ({ fixtures, onExport }) => {
  if (fixtures.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Fetched Fixtures:</h3>
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
      </div>
      <div className="max-h-60 overflow-y-auto border rounded-md p-4">
        {fixtures.map((fixture, index) => (
          <div key={index} className="mb-2 text-sm">
            {fixture.date} {fixture.time}: {fixture.homeTeam} vs {fixture.awayTeam}
            {fixture.isCompleted && (
              <span className="ml-2 text-green-600">
                ({fixture.homeScore} - {fixture.awayScore})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixturesList;
