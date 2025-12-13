# MindMentor AI Frontend

This is the React frontend for MindMentor AI - an intelligent productivity and learning management platform.

## Features

- **Authentication**: Login/Signup with JWT tokens
- **Dashboard**: Welcome screen with metrics
- **Responsive Design**: Mobile and desktop layouts
- **Dark/Light Mode**: Theme support
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080/api`. Make sure your Spring Boot backend is running before starting the frontend.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── pages/             # Page components
├── services/          # API services
├── utils/             # Utility functions
├── App.tsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests.

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Headless UI
