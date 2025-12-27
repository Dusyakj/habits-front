# Habit Tracker Frontend

A modern, big-tech level React application for tracking daily habits built with Vite, TypeScript, and Tailwind CSS.

## Features

### Authentication
- **User Registration** - Create new account with email verification
- **Login/Logout** - Secure authentication with JWT tokens
- **Email Verification** - Verify email before accessing the app
- **Token Refresh** - Automatic token refresh on expiration

### Habit Management
- **Create Habits** - Create habits with custom schedules
  - Interval-based (every N days)
  - Weekly schedule (specific days of the week)
- **Edit Habits** - Update habit details, schedule, and appearance
- **Delete Habits** - Soft delete habits
- **Color Coding** - Choose from 17 vibrant colors

### Habit Tracking
- **Confirm Completion** - Mark habits as done for the current period
- **Add Notes** - Optional notes for each confirmation
- **Streak Tracking** - Visual streak counter with fire icon
- **Auto-reset** - Backend cron job handles missed deadlines

### Statistics & History
- **Current Streak** - Track ongoing completion streaks
- **Longest Streak** - See your best performance
- **Total Completions** - Count of all confirmations
- **Success Rate** - Percentage completion rate
- **History View** - View past 30 confirmations with notes

## Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### State & Data
- **Zustand** - Global state management (auth)
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client with interceptors

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Custom Components** - Reusable UI components (Button, Input, Card)

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration

### Routing
- **React Router v6** - Client-side routing

### Utilities
- **date-fns** - Date formatting and manipulation
- **clsx + tailwind-merge** - Conditional className merging

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Running backend API (see main project README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_URL=http://localhost:8080
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
front/
├── src/
│   ├── components/
│   │   ├── habits/              # Habit-related components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # Reusable UI components
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── store/                   # Zustand stores
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utility functions
│   └── lib/                     # Configurations
├── .env                         # Environment variables
├── tailwind.config.js           # Tailwind configuration
└── vite.config.ts               # Vite configuration
```

## Key Features

- Automatic token refresh
- Optimistic UI updates
- Responsive design
- Loading states & skeletons
- Error handling
- Form validation
- Color-coded habits
- Real-time streak tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
