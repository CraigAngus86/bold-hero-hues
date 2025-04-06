
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface EnhancedQuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  description?: string;
  tooltip?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'primary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  badgeCount?: number;
  badgeColor?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function EnhancedQuickActionButton({ 
  icon, 
  label, 
  href, 
  description, 
  tooltip,
  variant = 'outline',
  size = 'default',
  className,
  badgeCount,
  badgeColor = "bg-primary-800",
  onClick
}: EnhancedQuickActionButtonProps) {
  const content = (
    <Button 
      asChild
      variant={variant}
      className={cn(
        "flex flex-col items-center justify-start h-auto py-4 px-2 gap-2 relative",
        "text-center w-full transition-all hover:bg-accent/5",
        size === 'sm' ? 'p-3' : 'p-4',
        className
      )}
      onClick={onClick}
    >
      <Link to={href}>
        <div className={cn(
          "rounded-full text-primary-800 flex items-center justify-center mb-2",
          size === 'sm' ? 'h-8 w-8 bg-primary-800/10' : 'h-10 w-10 bg-primary-800/10'
        )}>
          {icon}
        </div>
        <span className={cn(
          "font-medium",
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>{label}</span>
        {description && (
          <p className={cn(
            "text-muted-foreground mt-1",
            size === 'sm' ? 'text-[0.7rem]' : 'text-xs'
          )}>{description}</p>
        )}
        
        {badgeCount !== undefined && (
          <span className={cn(
            "absolute top-2 right-2 text-white rounded-full flex items-center justify-center",
            badgeColor,
            size === 'sm' ? 'h-4 w-4 text-[0.65rem]' : 'h-5 w-5 text-xs'
          )}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </Link>
    </Button>
  );
  
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return content;
}

export default EnhancedQuickActionButton;
