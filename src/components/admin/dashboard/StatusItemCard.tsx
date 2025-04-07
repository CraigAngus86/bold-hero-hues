
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SystemStatusType } from '@/types/system/status';

export interface StatusItemCardProps {
  status: SystemStatusType;
  label: ReactNode;
  value?: number | string;
  icon?: React.ReactNode;
  color?: string;
  lastChecked?: Date;
}

const StatusItemCard: React.FC<StatusItemCardProps> = ({
  status,
  label,
  value,
  icon,
  color = 'blue',
  lastChecked
}) => {
  const getStatusColor = (status: SystemStatusType) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
      case 'unknown':
      default:
        return 'bg-slate-300';
    }
  };

  const getStatusTextColor = (status: SystemStatusType) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      case 'unknown':
      default:
        return 'text-slate-500';
    }
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-500">{icon}</div>}
            <div>
              <h3 className="font-medium text-sm text-gray-700">{label}</h3>
              {value !== undefined && (
                <p className="text-xl font-bold text-gray-900">{value}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(status)} mr-2`}></div>
            <span className={`text-xs font-medium ${getStatusTextColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        
        {lastChecked && (
          <div className="mt-2 text-xs text-gray-400">
            Updated: {lastChecked.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusItemCard;
