
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { spacing, typography } from '@/styles/designTokens';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  actions
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={typography.sectionHeader}>{title}</CardTitle>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className={spacing.cardPadding}>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
