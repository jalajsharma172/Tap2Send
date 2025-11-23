# PayPhone - Send Money Instantly

## Overview

PayPhone is a blockchain-based payment application that enables users to send money instantly using just phone numbers. The application features an animated interface with moving transaction visualizations and provides a simplified user experience for cryptocurrency transfers. Built as a React single-page application with an Express backend, it uses a phone number-based abstraction layer over blockchain wallet addresses.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API request handling

**UI Framework**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes through CSS variables
- Component library follows the "new-york" style variant

**Design System**
The application implements a reference-based design conversion from existing HTML/CSS specifications (documented in `design_guidelines.md`):
- Typography hierarchy using Roboto as primary font with specific sizing and weights
- Strict color palette (black background, white containers, green accents for transactions)
- Precise spacing system using 4px-based increments
- Animated background with moving transaction elements in six directional patterns
- Container max-width of 380px with 20px border radius for mobile-first design

**State Management**
- React Query handles all server state with configured defaults (no refetch on window focus, infinite stale time)
- Local component state using React hooks for UI interactions
- Custom hooks for mobile detection and toast notifications

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with ES modules
- Separate development and production entry points (`index-dev.ts` and `index-prod.ts`)
- Development mode integrates Vite middleware for HMR
- Production mode serves pre-built static files from `dist/public`

**Request Handling**
- JSON body parsing with raw body capture for webhook verification
- Request/response logging with timing metrics for API routes
- Credential-based session handling (cookies enabled)
- Custom error handling middleware

**Storage Interface**
The application defines an `IStorage` interface for data persistence operations:
- In-memory storage implementation (`MemStorage`) for development
- User management methods (create, retrieve by ID/username)
- Designed to be swappable with database-backed implementations

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL dialect
- Neon Database serverless driver (`@neondatabase/serverless`)
- Schema defined in TypeScript with automatic type inference
- Migration output directory: `./migrations`

**Schema Design**
Currently implements a minimal user table:
- UUID primary keys with database-generated defaults
- Username/password authentication fields
- Zod validation schemas generated from Drizzle definitions

**Session Management**
- `connect-pg-simple` package for PostgreSQL-backed session storage
- Configured to work with Express sessions

### Authentication and Authorization

The foundation is established but implementation is minimal:
- User schema includes username/password fields
- Zod schemas validate user input on insert operations
- Storage interface provides user lookup methods
- No active authentication middleware or session management currently implemented

### External Dependencies

**UI Component Library**
- Radix UI primitives for accessible, unstyled components (dialogs, popovers, tooltips, etc.)
- Full suite of 30+ component primitives imported

**Utilities**
- `clsx` and `tailwind-merge` for conditional className composition
- `class-variance-authority` for component variant management
- `date-fns` for date manipulation
- `nanoid` for unique ID generation

**Development Tools**
- TypeScript with strict mode enabled
- ESBuild for production server bundling
- Replit-specific plugins (runtime error overlay, cartographer, dev banner) for enhanced development experience
- PostCSS with Tailwind CSS and Autoprefixer

**Build and Development**
- Development script uses `tsx` for direct TypeScript execution with hot reload
- Production build creates bundled server code and Vite-optimized client assets
- Type checking via `tsc --noEmit`
- Database schema push command via Drizzle Kit

**Path Aliases**
Configured for cleaner imports:
- `@/*` → client source files
- `@shared/*` → shared code between client/server  
- `@assets/*` → attached assets directory

**Asset Management**
The `attached_assets` directory contains reference HTML/CSS files documenting the original design specifications that the React application replicates.