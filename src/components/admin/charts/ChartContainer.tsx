
import React from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';

// Sample chart data - in a real app, this would come from props or a service
const sampleData = [
  { name: 'Jan', value: 400, visits: 240 },
  { name: 'Feb', value: 300, visits: 139 },
  { name: 'Mar', value: 200, visits: 980 },
  { name: 'Apr', value: 278, visits: 390 },
  { name: 'May', value: 189, visits: 480 },
  { name: 'Jun', value: 239, visits: 380 },
  { name: 'Jul', value: 349, visits: 430 },
];

const samplePieData = [
  { name: 'News', value: 400 },
  { name: 'Fixtures', value: 300 },
  { name: 'Team', value: 300 },
  { name: 'Sponsors', value: 200 },
];

interface ChartContainerProps {
  type?: 'area' | 'bar' | 'line' | 'pie';
  data?: any[];
  isLoading?: boolean;
  height?: number | string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  type = 'area',
  data = sampleData,
  isLoading = false,
  height = '100%'
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2 text-sm text-muted-foreground">Loading chart data...</span>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#00105A" name="Activity" />
            <Bar dataKey="visits" fill="#C5E7FF" name="Visits" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#00105A" activeDot={{ r: 8 }} name="Activity" />
            <Line type="monotone" dataKey="visits" stroke="#C5E7FF" name="Visits" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={samplePieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {samplePieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'area':
      default:
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stackId="1" stroke="#00105A" fill="#00105A" fillOpacity={0.6} name="Activity" />
            <Area type="monotone" dataKey="visits" stackId="1" stroke="#C5E7FF" fill="#C5E7FF" fillOpacity={0.6} name="Visits" />
          </AreaChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

// This would typically come from a theme or design tokens
const COLORS = ['#00105A', '#C5E7FF', '#4A6FA5', '#166088', '#044389'];

// Also export a simpler version that just wraps the chart in a card
export const ChartCard: React.FC<ChartContainerProps & { title?: string; description?: string }> = ({
  title,
  description,
  ...props
}) => {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      <div className="h-64">
        <ChartContainer {...props} />
      </div>
    </Card>
  );
};

// Add default export to fix import issues
export default ChartContainer;
