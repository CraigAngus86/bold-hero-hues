
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import FixturesManager from '@/components/admin/fixtures/FixturesManager';

const FixtureManagement = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Fixture Management</h1>
        <FixturesManager />
      </div>
    </AdminLayout>
  );
};

export default FixtureManagement;
