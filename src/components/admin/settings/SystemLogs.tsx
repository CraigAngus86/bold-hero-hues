
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SystemLogsProps {
  maxDisplayCount?: number;
}

const SystemLogs: React.FC<SystemLogsProps> = ({ maxDisplayCount = 10 }) => {
  // Make sure maxDisplayCount is a number
  const displayCount = typeof maxDisplayCount === 'number' 
    ? maxDisplayCount  
    : parseInt(String(maxDisplayCount), 10) || 10; // Convert to number with fallback

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Usage</span>
            <span>65%</span>
          </div>
          <Progress value={65} className="h-2" />
          
          <div className="mt-4">
            <div className="text-sm font-medium">Recent Logs</div>
            <div className="mt-2 space-y-1">
              {/* Show only the number of logs specified by displayCount */}
              {Array.from({ length: displayCount }).map((_, i) => (
                <div key={i} className="text-xs text-gray-500 border-l-2 border-gray-200 pl-2">
                  <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> System check completed
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
