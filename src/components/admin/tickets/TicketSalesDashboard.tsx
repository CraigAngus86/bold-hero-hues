
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PoundSterling, Users, CalendarRange, BarChart3 } from 'lucide-react';

// Mock data for charts
const ticketTypeData = [
  { name: 'Adult', value: 850, color: '#2563eb' },
  { name: 'Concession', value: 340, color: '#7c3aed' },
  { name: 'Child', value: 220, color: '#16a34a' },
  { name: 'Family', value: 150, color: '#ea580c' },
  { name: 'Season', value: 267, color: '#c026d3' },
];

const monthlySalesData = [
  { month: 'Jul', online: 45, physical: 20 },
  { month: 'Aug', online: 165, physical: 95 },
  { month: 'Sep', online: 120, physical: 75 },
  { month: 'Oct', online: 95, physical: 60 },
  { month: 'Nov', online: 80, physical: 45 },
  { month: 'Dec', online: 70, physical: 30 },
  { month: 'Jan', online: 85, physical: 40 },
  { month: 'Feb', online: 90, physical: 50 },
];

const matchSalesData = [
  { name: 'Banks o\' Dee vs Buckie Thistle', tickets: 235 },
  { name: 'Banks o\' Dee vs Fraserburgh', tickets: 310 },
  { name: 'Banks o\' Dee vs Formartine United', tickets: 175 },
  { name: 'Banks o\' Dee vs Brechin City', tickets: 220 },
  { name: 'Banks o\' Dee vs Huntly', tickets: 195 },
];

const statCards = [
  { title: 'Total Revenue', value: '£32,450', icon: <PoundSterling size={24} />, color: 'from-green-500 to-emerald-700' },
  { title: 'Tickets Sold', value: '1,827', icon: <Users size={24} />, color: 'from-blue-500 to-blue-700' },
  { title: 'Season Tickets', value: '267', icon: <CalendarRange size={24} />, color: 'from-purple-500 to-purple-700' },
  { title: 'Online Sales %', value: '72%', icon: <BarChart3 size={24} />, color: 'from-orange-500 to-amber-700' },
];

const TicketSalesDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={`overflow-hidden`}>
            <div className={`bg-gradient-to-r ${stat.color} p-4 text-white`}>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {stat.title}
                </p>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold mt-2">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Online vs Physical ticket sales by month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="online" name="Online Sales" fill="#2563eb" />
                <Bar dataKey="physical" name="Physical Sales" fill="#9ca3af" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Type Distribution</CardTitle>
            <CardDescription>Breakdown of sales by ticket type</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {ticketTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Matches</CardTitle>
          <CardDescription>Matches with the highest ticket sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matchSalesData.map((match, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="font-medium">{match.name}</p>
                <div className="flex items-center">
                  <div className="w-32 h-3 bg-gray-200 rounded-full mr-3">
                    <div 
                      className="h-3 bg-blue-600 rounded-full" 
                      style={{ width: `${(match.tickets / 350) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700">{match.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>This is a sample sales dashboard with mock data. In a future update, this will be connected to real sales data from Supabase.</p>
      </div>
    </div>
  );
};

export default TicketSalesDashboard;
