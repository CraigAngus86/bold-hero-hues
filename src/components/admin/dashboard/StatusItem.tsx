
import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { SystemStatusType } from '@/types/system/status';

interface StatusItemProps {
  name: string;
  status: SystemStatusType;
  value?: string;
  metricValue?: string;
  details?: string;
  icon?: React.ElementType;
  count?: number;
  color?: string;
  viewAllLink?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({
  name,
  status,
  value,
  metricValue,
  details,
  icon: Icon,
  count,
  color = 'bg-gray-50',
  viewAllLink
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unknown':
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm border ${color}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-gray-500" />}
          <h3 className="font-medium">{name}</h3>
        </div>
        <div>{getStatusIcon()}</div>
      </div>
      
      <div className="mt-2">
        {(value || typeof count !== 'undefined') && (
          <div className="flex items-end">
            <span className="text-2xl font-bold">{value || count}</span>
            {metricValue && (
              <span className={`ml-2 text-sm ${status === 'healthy' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
                {metricValue}
              </span>
            )}
          </div>
        )}
        {details && <p className="mt-1 text-sm text-gray-500">{details}</p>}
      </div>
      
      {viewAllLink && (
        <div className="mt-4">
          <a href={viewAllLink} className="text-sm text-blue-600 hover:underline">
            View all
          </a>
        </div>
      )}
    </div>
  );
};

export default StatusItem;
