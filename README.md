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


## Project Structure

```
frontend/
  src/
    Components/
      Admin/         # Admin dashboard, sidebar, user/content/category management
      Editor/        # Editor dashboard, pending articles, edit history, navigation
      Reporter/      # Reporter dashboard, submissions, article form, sidebar, settings
      User/          # User-facing components: news card, profile, audio player, header/footer, search, language selector
      Auth/          # User registration and email verification
      ReporterApplications.jsx
    Pages/
      Home.jsx
      SuperAdminPortal.jsx
      RoleBasedLogin.jsx
      Admin/
        AdminPanel.jsx
        ReporterReg.jsx
      Editor/
        (Editor-specific pages if any)
      Reporter/
        ReporterPanel.jsx
        ReporterApplicationDashboard.jsx
        ReporterApplicationLogin.jsx
        ReporterRegistration.jsx
      User/
        UserDashboard.jsx
        AllNews.jsx
        CategoryPage.jsx
        CategoryNews.jsx
        ContentManagement.jsx
        NewsDetail.jsx
        Login.jsx
    services/         # API service modules (auth, news, view, category, application)
    constants/        # Shared data (newsapp-news.categories.json)
    contexts/         # React context providers (SearchContext, LanguageContext)
    assets/           # Static assets (e.g., react.svg)
    Images/           # News category images
    Styles/           # Custom CSS (Header.css, Footer.css, CategoryPage.css, LoginPage.css)
    config.ts         # App-wide config
    App.jsx           # Main app component
    main.jsx          # App entry point
    index.css         # Global styles
    App.css           # App-specific styles
    DummyNews.jsx     # (Large dummy data/component)
  public/             # Static public files (vite.svg, etc.)
  index.html          # Main HTML entry
  package.json        # Project metadata and scripts
```


