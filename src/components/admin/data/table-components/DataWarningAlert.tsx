
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DataWarningAlertProps {
  title: string;
  description: string;
}

const DataWarningAlert: React.FC<DataWarningAlertProps> = ({ title, description }) => {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default DataWarningAlert;
