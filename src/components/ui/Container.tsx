
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

const Container = ({ 
  children, 
  className,
  size = 'md',
  padding = 'md',
  as: Component = 'div'
}: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'px-0',
    sm: 'px-3 py-4',
    md: 'px-4 md:px-6 py-6 md:py-8',
    lg: 'px-4 md:px-8 py-8 md:py-12',
  };
  
  return (
    <Component className={cn('mx-auto', sizeClasses[size], paddingClasses[padding], className)}>
      {children}
    </Component>
  );
};

export default Container;
