
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataInfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 font-medium">How the data works</p>
          <p className="text-sm text-blue-600 mt-1">
            By default, the app uses mock data for the league table. This data is refreshed when you click the 
            "Refresh League Data" button.
          </p>
          <p className="text-sm text-blue-600 mt-2">
            For technical users: You can set up a server to scrape real-time data from the BBC Sport Highland League 
            page. The server settings are optional and only needed if you want to use real scraped data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataInfoCard;
