
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import SponsorsManager from '@/components/admin/SponsorsManager';

const SponsorsManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <SponsorsManager />
    </AdminLayout>
  );
};

export default SponsorsManagementPage;
