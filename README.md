# Aero NewsApp Frontend

Aero NewsApp is a modern, multi-role news portal frontend built with React and Vite. It supports users, editors, reporters, admins, and super admins, providing a rich, role-based experience for reading, submitting, and managing news articles.

## Features

- Role-based dashboards: User, Editor, Reporter, Admin, Super Admin
- News feed with category, tag, and language filtering
- Article submission, editing, and approval workflows
- Responsive, modern UI with Material-UI and custom styles
- Audio playback for news articles
- Authentication and profile management
- Pagination, search, and more

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material-UI (MUI)](https://mui.com/)
- [Sonner](https://sonner.emilkowal.ski/) (notifications)
- [Axios](https://axios-http.com/) (API requests)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.
```

## Project Structure

```
frontend/
  src/
    Components/    # Reusable UI components (cards, dashboards, etc.)
    Pages/         # Top-level pages (Home, Dashboards, etc.)
    services/      # API service modules
    contexts/      # React context providers (auth, language, search)
    assets/        # Static assets (images, icons)
    Styles/        # Custom CSS
    config.ts      # App-wide config
  public/          # Static public files
  index.html       # Main HTML entry
  package.json     # Project metadata and scripts
```
