# HabitStacker Application - Design Choices & Architecture

## Project Overview
HabitStacker is a Next.js application designed to help users build sustainable habits by creating "stacks" of micro-habits. The application uses a clean, modern UI built with shadcn-ui components and stores data in the browser's local storage.

## Technology Stack
- Framework: Next.js 15.1.0
- UI Components: shadcn-ui (built on Radix UI)
- State Management: React Context API with useState/useEffect hooks
- Styling: Tailwind CSS
- Data Persistence: LocalStorage
- Theme Management: next-themes

## Key Components

### App Structure
- `app/layout.tsx`: Root layout with ThemeProvider and HabitProvider for global state
- `app/page.tsx`: Landing page showcasing the app's value proposition with example habit stacks
- `app/dashboard/page.tsx`: Main dashboard showing habit stacks and progress
- `app/settings/page.tsx`: Simplified settings page with theme selection only

### Core Components
- `components/habit-stacks.tsx`: Main component for displaying, completing, and managing habit stacks
  - Connected to HabitContext for reactive updates
  - Handles habit completion toggling
  - Provides CRUD operations for habits

- `components/progress-summary.tsx`: Visualizes habit completion progress 
  - Shows streaks and completion rates
  - Reactively updates based on habit completion state

- `components/site-header.tsx`: Navigation component with responsive design
  - Contains links to different sections of the app (Home, Stack, Add)
  - Features settings icon for accessing the settings page

- `components/theme-selector.tsx`: UI component for selecting application theme
  - Provides Light, Dark, and System theme options
  - Uses next-themes for theme persistence

- `components/theme-provider.tsx`: Provider component for theme context
  - Wraps application for theme state management
  - Handles theme persistence in localStorage

### Data Layer
- `lib/types.ts`: TypeScript interfaces for Habit and HabitStack
- `lib/contexts/HabitContext.tsx`: Context provider for centralized state management
- `lib/local-storage.ts`: Utilities for saving/retrieving data from localStorage
- `lib/utils.ts`: Utility functions like the Tailwind class merger

## Design Choices

### State Management
- Implemented React Context API for shared state management
- Created a HabitContext to handle all habit-related operations
- Ensured reactive updates across components when state changes
- Standardized localStorage key names (habitStacks, completedToday)

### Local-First Approach
- Data is stored entirely in localStorage for a no-backend approach
- Sample data is created on first use to demonstrate functionality
- Common state access pattern through context hooks

### Micro-Habits Philosophy
- Focus on tiny (2-minute) habits that are easy to adopt
- Habits are stacked sequentially (trigger-based) to create routines
- Emphasis on habit chaining as described by James Clear's Atomic Habits

### UI/UX Considerations
- Clean, minimal interface with strong visual hierarchy
- Progress visualization to encourage continued use
- Mobile-responsive design for on-the-go habit tracking
- Real-time UI updates when habits are completed/uncompleted

### Navigation Structure
- Consistent navigation bar across all pages
- Simple three-button primary navigation (Home, Stack, Add)
- Settings accessible through an icon in the header

### Simplified Settings
- Focused only on essential settings (theme)
- Removed unnecessary configuration options
- Streamlined UI with clear, minimal controls

## Implementation Challenges

### Dependency Conflicts
- Resolved date-fns/react-day-picker version conflict using --legacy-peer-deps

### LocalStorage Limitations
- Implemented null checks and error handling for SSR compatibility
- Added safeguards for potential localStorage quota issues
- Created consistent data access patterns via context

### State Synchronization
- Solved reactivity issues by implementing a centralized context
- Ensured habit completion status is reflected instantly across components
- Fixed multi-component update issues with proper context subscription

## Future Improvements
- User authentication for multi-device syncing
- Notifications/reminders for habit completion
- More detailed analytics and progress visualization
- Data export/import functionality
- Supabase backend integration for persistent cloud storage

## Component Architecture Decision
Chose to separate UI components (shadcn-ui extensions) from business logic components, connecting them through context providers for better maintainability and state management.
