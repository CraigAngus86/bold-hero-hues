
import React, { ReactNode } from 'react';
import { layoutStyles, typography } from '@/styles/designTokens';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

interface AdminPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
}

/**
 * Standardized layout component for admin pages
 */
export const AdminPageLayout = ({
  children,
  title,
  description,
  className,
  actions,
}: AdminPageLayoutProps) => {
  return (
    <div className={cn(layoutStyles.pageContainer, className)}>
      <Helmet>
        <title>{title} - Banks o' Dee FC Admin</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className={typography.pageTitle}>{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        
        {actions && (
          <div className="mt-4 md:mt-0 flex gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export default AdminPageLayout;
