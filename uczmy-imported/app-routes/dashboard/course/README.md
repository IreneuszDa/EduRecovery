# Course Dashboard Structure

This directory contains the course dashboard pages that have been broken down into sub-pages for better organization and navigation.

## File Structure

```
app/dashboard/course/
├── layout.tsx          # Shared layout with navigation tabs
├── page.tsx            # Main dashboard overview
├── types.ts            # Shared TypeScript types
├── subjects/
│   └── page.tsx        # Subject selection and learning paths
├── analytics/
│   └── page.tsx        # Analytics and progress statistics
└── lesson-plan/
    └── page.tsx        # Detailed lesson plans
```

## Routes

- `/dashboard/course` - Main dashboard with progress overview
- `/dashboard/course/subjects` - Subject selection and learning paths
- `/dashboard/course/analytics` - Analytics and detailed statistics
- `/dashboard/course/lesson-plan` - Lesson plans (with subject query parameter)

## Features

### Layout (`layout.tsx`)
- Shared navigation tabs for all sub-pages
- Responsive design with proper styling
- Active state indication for current page

### Main Dashboard (`page.tsx`)
- Progress overview with user statistics
- Quick navigation to other sections
- Streak tracking and motivation

### Subjects (`subjects/page.tsx`)
- Subject selection interface
- Learning path visualization
- Individual lesson access
- Progress tracking per subject

### Analytics (`analytics/page.tsx`)
- Detailed statistics and charts
- Progress analysis
- Performance metrics

### Lesson Plan (`lesson-plan/page.tsx`)
- Detailed lesson plans for different subjects
- Subject switching via query parameters
- Structured learning content

## Shared Types (`types.ts`)

Contains common TypeScript interfaces:
- `UserProgress` - User progress tracking data
- `LessonNodeData` - Individual lesson information
- `PlanView` - View state enumeration

## Navigation Flow

1. Users start at the main dashboard (`/dashboard/course`)
2. Navigation tabs allow switching between sections
3. Subject selection can lead to detailed learning paths
4. Each page maintains proper back navigation
5. Session storage is used for cross-page data sharing
