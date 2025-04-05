
# Banks o' Dee FC Website Source Code

This directory contains the source code for the Banks o' Dee FC website, a React-based web application using Vite, Typescript, and Tailwind CSS.

## Project Structure

- `components/` - Reusable UI components organized by feature
  - `admin/` - Components related to the admin dashboard
  - `fixtures/` - Components for displaying match fixtures and results
  - `forms/` - Form components used throughout the application
  - `layout/` - Site layout components (header, footer, etc.)
  - `league/` - Components related to league table display
  - `team/` - Components for displaying team information
  - `ui/` - Shared UI components (buttons, cards, etc.) including shadcn/ui components

- `hooks/` - Custom React hooks
  - `useSupabaseFetch.ts` - Hook for fetching data from Supabase
  - `useDebounce.ts` - Hook for debouncing state changes
  - `useLocalStorage.ts` - Hook for persisting state to localStorage
  - `useMemoWithDeps.ts` - Enhanced version of useMemo with deep dependency comparison

- `pages/` - Page components corresponding to routes
  - `admin/` - Admin dashboard pages
  - `Index.tsx` - Homepage
  - `Fixtures.tsx` - Fixtures and results page
  - `LeagueTable.tsx` - League standings page
  - And others...

- `services/` - Service modules for data fetching and API interactions
  - `cache/` - Caching services
  - `config/` - Configuration services
  - `supabase/` - Supabase-related services

- `utils/` - Utility functions
  - `errorHandling.ts` - Error handling utilities
  - `env.ts` - Environment variable utilities
  - `date.ts` - Date formatting utilities

## Key Technologies

- React - UI library
- TypeScript - Type safety
- Tailwind CSS - Styling
- shadcn/ui - UI component library
- Framer Motion - Animations
- Supabase - Backend services
- TanStack Query (React Query) - Data fetching and caching

## Development Guidelines

1. **Component Creation**
   - Create new components in the appropriate feature folder
   - Use TypeScript interfaces for props
   - Use shadcn/ui components when possible

2. **State Management**
   - Use React hooks for component state
   - Use TanStack Query for server state
   - Use custom hooks to encapsulate complex logic

3. **Error Handling**
   - Wrap components with ErrorBoundary
   - Use try/catch with safeAsync for async operations
   - Log errors appropriately

4. **Styling**
   - Use Tailwind CSS for styling
   - Follow the color scheme defined in tailwind.config.js
   - Use responsive classes for different screen sizes

## Building and Running

The application uses Vite for building and development.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

See `.env.example` for required environment variables.

## Error Handling Strategy

The application uses a centralized error handling approach:

1. Component-level errors are caught with ErrorBoundary components
2. Async operation errors are handled with the safeAsync utility
3. API errors are processed through handleApiError
4. User-facing errors are displayed with toast notifications
