
import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography = {
  H1: ({ children, className = '', as: Component = 'h1' }: TextProps) => (
    <Component className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </Component>
  ),
  H2: ({ children, className = '', as: Component = 'h2' }: TextProps) => (
    <Component className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`}>
      {children}
    </Component>
  ),
  H3: ({ children, className = '', as: Component = 'h3' }: TextProps) => (
    <Component className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </Component>
  ),
  H4: ({ children, className = '', as: Component = 'h4' }: TextProps) => (
    <Component className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
      {children}
    </Component>
  ),
  P: ({ children, className = '', as: Component = 'p' }: TextProps) => (
    <Component className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </Component>
  ),
  Small: ({ children, className = '', as: Component = 'p' }: TextProps) => (
    <Component className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </Component>
  ),
  Lead: ({ children, className = '', as: Component = 'p' }: TextProps) => (
    <Component className={`text-xl text-muted-foreground ${className}`}>
      {children}
    </Component>
  ),
  Large: ({ children, className = '', as: Component = 'div' }: TextProps) => (
    <Component className={`text-lg font-semibold ${className}`}>
      {children}
    </Component>
  ),
  BlockQuote: ({ children, className = '', as: Component = 'blockquote' }: TextProps) => (
    <Component className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </Component>
  ),
};

export default Typography;
