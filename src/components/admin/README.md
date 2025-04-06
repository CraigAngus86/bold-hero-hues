
# Banks o' Dee FC Admin System

This directory contains the components and functionality for the Banks o' Dee FC admin system.

## Directory Structure

- `/admin`
  - `/layout`: Layout components for the admin interface
  - `/fixtures`: Components for managing fixtures and results
  - `/league-table`: Components for managing league table data
  - `/news`: Components for managing news articles
  - `/team`: Components for managing team members
  - `/sponsors`: Components for managing sponsor information
  - `/image-manager`: Components for managing media and images

## Usage Guidelines

1. All admin pages should use the `AdminLayout` component
2. Use the Supabase service functions rather than direct database calls
3. Follow the established patterns for:
   - Loading states (using isLoading state)
   - Error handling (try/catch with toast notifications)
   - Form validation (using react-hook-form)
   - Modal dialogs (using shadcn Dialog component)

## Standardized Admin Patterns

1. Data fetching: Use service functions in `/services` directory
2. Form handling: Use `react-hook-form` with zod validation
3. Notifications: Use `toast` from sonner package for success/error messages
4. Tables: Use the shadcn Table component
5. Filtering: Use consistent filter components

## TODO Items

- Implement user roles and permissions
- Add comprehensive form validation
- Improve mobile responsiveness of data tables
- Create comprehensive documentation for admin features
