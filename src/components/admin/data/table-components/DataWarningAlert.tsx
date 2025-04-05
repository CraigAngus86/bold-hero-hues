
import React from 'react';
import { AlertTriangle } from "lucide-react";

/**
 * Component displaying a warning when data quality issues are detected
 */
export const DataWarningAlert: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-md shadow-sm">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
        <p className="font-medium text-yellow-800">Data Quality Warning</p>
      </div>
      <p className="text-sm text-yellow-700 mt-1 ml-7">
        Some team names appear to be invalid (numeric or missing). Try refreshing the data or check the scraper configuration.
      </p>
    </div>
  );
};
