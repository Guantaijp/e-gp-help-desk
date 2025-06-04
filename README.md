# Shift Management System

A full-stack application for managing work shifts with a React frontend and NestJS backend.

## Features

- 📅 Monthly and weekly calendar views
- ➕ Create, update, and delete shifts
- 🎨 Color-coded shift visualization
- 👥 Agent requirement management
- 📱 Responsive design
- 🔄 Real-time data synchronization

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- Custom hooks for API integration

### Backend
- NestJS with TypeScript
- PostgreSQL database
- TypeORM for database operations


## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+



### Frontend Setup

1. **Install dependencies:**
   
   pnpm install


2. **Set up environment variables:**
  
   cp .env.example .env

  

3. **Start the frontend:**
 
   pnpm run dev
  

   The app will be available at `http://localhost:5173`


## API Endpoints

### Shifts
- `GET /shifts` - Get all shifts
- `POST /shifts` - Create a new shift
- `GET /shifts/:id` - Get a specific shift
- `PATCH /shifts/:id` - Update a shift
- `DELETE /shifts/:id` - Delete a shift

## Database Schema




## Development

### Adding New Features

1. **Backend (NestJS):**
    - Add new entities in `src/entities/`
    - Create DTOs in `src/dto/`
    - Implement services in `src/services/`
    - Add controllers in `src/controllers/`

2. **Frontend (React):**
    - Add components in `src/components/`
    - Create hooks in `src/hooks/`
    - Update types in `src/types/`
    - Add API calls in `src/services/`

## License

This project is licensed under the MIT License.
