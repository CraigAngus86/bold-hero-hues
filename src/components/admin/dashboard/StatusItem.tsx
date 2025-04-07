
import { SystemStatusType } from '@/types/system/status';

type StatusItemProps = {
  status: SystemStatusType;
  label: string;
};

const StatusItem = ({ status, label }: StatusItemProps) => {
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

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default StatusItem;
