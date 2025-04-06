
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  description?: string;
}

export function QuickActionButton({ icon, label, href, description }: QuickActionButtonProps) {
  return (
    <Button 
      asChild
      variant="outline"
      className={cn(
        "flex flex-col items-center justify-start h-auto py-4 px-2 gap-2 bg-background hover:bg-muted/50 border-dashed",
        "text-center w-full transition-all"
      )}
    >
      <Link to={href}>
        <div className="h-10 w-10 rounded-full bg-primary-800/10 text-primary-800 flex items-center justify-center mb-2">
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </Link>
    </Button>
  );
}
