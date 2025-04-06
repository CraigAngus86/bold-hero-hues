
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users2, 
  Camera, 
  MessageCircle, 
  BarChart4, 
  Heart, 
  MailCheck, 
  Settings 
} from 'lucide-react';

import FanZoneContent from '@/components/admin/fans/FanZoneContent';
import SocialMediaIntegration from '@/components/admin/fans/SocialMediaIntegration';
import PollsAndSurveys from '@/components/admin/fans/PollsAndSurveys';
import FanMessaging from '@/components/admin/fans/FanMessaging';
import CommunityInitiatives from '@/components/admin/fans/CommunityInitiatives';

const FansManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Fans Management - Banks o' Dee FC Admin</title>
        </Helmet>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-team-blue">Fans Management</h1>
          <p className="text-gray-600 mt-2">
            Manage fan content, engagement, and community initiatives.
          </p>
        </div>
        
        <Tabs defaultValue="fan-zone" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="fan-zone" className="flex items-center gap-2">
              <Camera size={16} />
              Fan Zone
            </TabsTrigger>
            <TabsTrigger value="social-media" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="polls-surveys" className="flex items-center gap-2">
              <BarChart4 size={16} />
              Polls & Surveys
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex items-center gap-2">
              <MailCheck size={16} />
              Messaging
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Heart size={16} />
              Community
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fan-zone">
            <FanZoneContent />
          </TabsContent>
          
          <TabsContent value="social-media">
            <SocialMediaIntegration />
          </TabsContent>
          
          <TabsContent value="polls-surveys">
            <PollsAndSurveys />
          </TabsContent>
          
          <TabsContent value="messaging">
            <FanMessaging />
          </TabsContent>
          
          <TabsContent value="community">
            <CommunityInitiatives />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Fan Engagement Settings</h2>
              <p className="text-gray-600 mb-4">Configure notification preferences, content moderation rules, and general fan engagement settings.</p>
              
              <div className="p-8 text-center text-gray-500">
                <Settings size={48} className="mx-auto mb-4 opacity-40" />
                <p>Advanced settings configuration is coming soon.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FansManagement;
