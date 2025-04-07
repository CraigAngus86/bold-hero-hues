
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { SystemStatusName } from '@/types/system/status';

interface StatusItemProps {
  status: SystemStatusName;
  label: string;
  description?: string;
  lastChecked?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ status, label, description, lastChecked }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'degraded':
        return 'text-orange-600';
      case 'critical':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Operational';
      case 'warning':
        return 'Minor Issues';
      case 'degraded':
        return 'Degraded';
      case 'critical':
      case 'error':
        return 'Critical Issues';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-start space-x-3 border rounded-md p-3">
      <div className="mt-0.5">{getStatusIcon()}</div>
      <div className="flex-1">
        <h4 className="font-medium">{label}</h4>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm font-medium ${getStatusClass()}`}>{getStatusText()}</span>
          {lastChecked && (
            <span className="text-xs text-gray-400">Last check: {lastChecked}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
