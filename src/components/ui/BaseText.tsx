
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * BaseText component for consistent text styling across the application
 * @param variant - The text style variant to apply
 * @param children - The content to display
 * @param className - Additional CSS classes to apply
 * @param color - Optional color override
 * @param as - Optional component to render as
 */
interface BaseTextProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'small';
  children: React.ReactNode;
  className?: string;
  color?: string;
  as?: React.ElementType;
}

const variantClasses = {
  h1: 'text-3xl md:text-4xl font-bold',
  h2: 'text-2xl md:text-3xl font-bold',
  h3: 'text-xl md:text-2xl font-semibold',
  h4: 'text-lg md:text-xl font-semibold',
  subtitle: 'text-lg font-medium',
  body: 'text-base',
  small: 'text-sm',
};

const defaultElementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  subtitle: 'p',
  body: 'p',
  small: 'span',
};

const defaultColorMap = {
  h1: 'text-primary-800',
  h2: 'text-primary-800',
  h3: 'text-primary-800',
  h4: 'text-primary-800',
  subtitle: 'text-primary-600',
  body: 'text-gray-700',
  small: 'text-gray-500',
};

const BaseText = ({ variant, children, className, color, as }: BaseTextProps) => {
  const Element = as || defaultElementMap[variant];
  const colorClass = color || defaultColorMap[variant];
  
  return (
    <Element className={cn(variantClasses[variant], colorClass, className)}>
      {children}
    </Element>
  );
};

export default BaseText;
