
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ListFilter } from "lucide-react";

const AlternativeViewsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-team-blue">
          Alternative Table Views
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert variant="info" className="mb-6">
          <ListFilter className="h-4 w-4" />
          <AlertDescription>
            This section will provide alternative ways to view the league table data, such as home games only, away games only, form tables, and head-to-head comparisons.
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

export default AlternativeViewsPanel;
