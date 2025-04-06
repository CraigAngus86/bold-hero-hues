
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Archive } from "lucide-react";

const SeasonArchivePanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-team-blue">
          Season Archives
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert variant="info" className="mb-6">
          <Archive className="h-4 w-4" />
          <AlertDescription>
            This feature will allow archiving league tables at the end of each season, creating a historical record that can be viewed and compared.
          </AlertDescription>
        </Alert>
        
        <div className="py-8 text-center">
          <p className="text-gray-600">
            This feature will be implemented in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonArchivePanel;
