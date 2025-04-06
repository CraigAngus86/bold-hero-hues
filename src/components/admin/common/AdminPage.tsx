
import React, { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { Helmet } from 'react-helmet-async';
import { spacing } from '@/styles/designTokens';

interface AdminPageProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

const AdminPage: React.FC<AdminPageProps> = ({
  children,
  title,
  description,
  actions
}) => {
  return (
    <AdminLayout>
      <AdminPageLayout
        title={title}
        description={description}
        actions={actions}
      >
        <div className={spacing.sectionMargin}>
          {children}
        </div>
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default AdminPage;
