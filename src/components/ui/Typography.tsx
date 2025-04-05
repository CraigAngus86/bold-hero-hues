
import React from 'react';
import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const H1: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'h1'
}) => (
  <Component className={cn("text-3xl md:text-4xl font-bold text-primary-800", className)}>
    {children}
  </Component>
);

export const H2: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'h2'
}) => (
  <Component className={cn("text-2xl md:text-3xl font-bold text-primary-800", className)}>
    {children}
  </Component>
);

export const H3: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'h3'
}) => (
  <Component className={cn("text-xl md:text-2xl font-semibold text-primary-800", className)}>
    {children}
  </Component>
);

export const H4: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'h4'
}) => (
  <Component className={cn("text-lg md:text-xl font-semibold text-primary-800", className)}>
    {children}
  </Component>
);

export const Subtitle: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'p'
}) => (
  <Component className={cn("text-lg font-medium text-primary-600", className)}>
    {children}
  </Component>
);

export const Body: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'p'
}) => (
  <Component className={cn("text-base text-gray-700", className)}>
    {children}
  </Component>
);

export const Small: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'p'
}) => (
  <Component className={cn("text-sm text-gray-500", className)}>
    {children}
  </Component>
);

const Typography = {
  H1,
  H2,
  H3,
  H4,
  Subtitle,
  Body,
  Small
};

export default Typography;
