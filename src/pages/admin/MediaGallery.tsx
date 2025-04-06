
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from '@/components/admin/layout';
import { 
  Grid3X3, 
  Upload, 
  Tag, 
  Settings, 
  Images,
  SlidersHorizontal
} from 'lucide-react';
import MediaLibrary from '@/components/admin/media-gallery/MediaLibrary';
import MediaUploader from '@/components/admin/media-gallery/MediaUploader';
import CategoryManager from '@/components/admin/media-gallery/CategoryManager';
import GalleryManager from '@/components/admin/media-gallery/GalleryManager';
import OptimizationTools from '@/components/admin/media-gallery/OptimizationTools';

const MediaGallery = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Media Gallery Management - Banks o' Dee FC Admin</title>
        </Helmet>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-team-blue">Media Gallery Management</h1>
          <p className="text-gray-600 mt-2">
            Manage images and videos for the Banks o' Dee FC website.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Grid3X3 size={16} />
              Media Library
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} />
              Upload Media
            </TabsTrigger>
            <TabsTrigger value="galleries" className="flex items-center gap-2">
              <Images size={16} />
              Galleries
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag size={16} />
              Categories & Tags
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="space-y-4">
            <MediaLibrary />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <MediaUploader />
          </TabsContent>
          
          <TabsContent value="galleries" className="space-y-4">
            <GalleryManager />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <CategoryManager />
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-4">
            <OptimizationTools />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Media Settings</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Configure default settings for media uploads and display.
              </p>
              {/* Settings content will be implemented in future iterations */}
              <div className="py-4 text-gray-500 dark:text-gray-400 text-sm">
                Settings functionality will be available in a future update.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default MediaGallery;
