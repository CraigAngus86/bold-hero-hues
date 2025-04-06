
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  Calendar, 
  BarChart3, 
  Settings, 
  Link,
  BadgePound,
  UserCircle
} from 'lucide-react';

import MatchTicketing from '@/components/admin/tickets/MatchTicketing';
import TicketTypesManager from '@/components/admin/tickets/TicketTypesManager';
import SeasonTicketsManager from '@/components/admin/tickets/SeasonTicketsManager';
import TicketSalesDashboard from '@/components/admin/tickets/TicketSalesDashboard';

const TicketsManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Ticket Management - Banks o' Dee FC Admin</title>
        </Helmet>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-team-blue">Ticket Management</h1>
          <p className="text-gray-600 mt-2">
            Manage match tickets, season tickets, and track sales.
          </p>
        </div>
        
        <Tabs defaultValue="match-tickets" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <TabsTrigger value="match-tickets" className="flex items-center gap-2">
              <Ticket size={16} />
              Match Tickets
            </TabsTrigger>
            <TabsTrigger value="ticket-types" className="flex items-center gap-2">
              <BadgePound size={16} />
              Ticket Types
            </TabsTrigger>
            <TabsTrigger value="season-tickets" className="flex items-center gap-2">
              <Calendar size={16} />
              Season Tickets
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Sales Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="match-tickets">
            <MatchTicketing />
          </TabsContent>
          
          <TabsContent value="ticket-types">
            <TicketTypesManager />
          </TabsContent>
          
          <TabsContent value="season-tickets">
            <SeasonTicketsManager />
          </TabsContent>
          
          <TabsContent value="sales">
            <TicketSalesDashboard />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Ticketing System Settings</h2>
              <p className="text-gray-600 mb-4">Configure external ticketing system integration settings.</p>
              
              <div className="p-8 text-center text-gray-500">
                <Link size={48} className="mx-auto mb-4 opacity-40" />
                <p>External ticketing system integration is coming soon.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TicketsManagement;
