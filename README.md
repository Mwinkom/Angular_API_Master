# Angular Posts Management Application

A modern Angular 19 application for managing blog posts with advanced features including pagination, caching, authentication, and comprehensive error handling.

## Project Overview

This application demonstrates modern Angular development practices with a complete CRUD interface for blog posts using JSONPlaceholder API.

## Features

### Core Functionality
- **Post Management**: Create, read, update, and delete blog posts
- **Post Details**: View individual posts with comments
- **Form Validation**: Client-side validation with custom profanity filter
- **Responsive Design**: Modern UI with consistent styling

### Advanced Features
- **Pagination**: Client-side pagination with URL query parameters
- **Caching System**: In-memory caching with TTL (5-minute expiration)
- **Error Handling**: Smart retry logic for failed requests
- **Authentication**: Login/logout functionality with route guards
- **Loading States**: Prevents content flashing during API calls
- **Toast Notifications**: Success/error feedback system



## Workflow

### 1. Application Startup
- Angular bootstraps with standalone components
- Routes are configured with lazy loading
- HTTP interceptors are registered for authentication
- Global error handling is initialized

### 2. Post Listing Flow
- User navigates to home page (`/`)
- Post-list component loads with pagination
- API service checks cache before making HTTP requests
- Posts are displayed in a responsive grid layout
- Pagination controls allow navigation between pages

### 3. Post Creation/Editing Flow
- User clicks "New Post" or "Edit Post" button
- Auth guard checks authentication status
- Post-form component loads with reactive forms
- Form validation includes profanity filtering
- On successful submission:
  - Cache is cleared to ensure fresh data
  - User is redirected with success toast notification

### 4. Post Detail Flow
- User clicks on a post card
- Post-detail component loads with loading state
- API fetches post data and comments simultaneously
- Error handling displays appropriate messages
- Edit button is available for authenticated users

### 5. Error Handling Flow
- HTTP errors trigger retry logic (3 attempts for server errors)
- Client errors (4xx) are not retried
- User-friendly error messages are displayed
- Loading states prevent UI flashing

### 6. Caching Strategy
- GET requests are cached for 5 minutes
- Cache keys include pagination parameters
- Manual cache clearing available via UI button
- Cache is automatically cleared after data modifications

## Development Setup

### Installation
```bash
npm install
```

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

### Build
```bash
ng build
```

### Testing
```bash
ng test
```

## API Integration

This application uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a fake REST API for demonstration purposes.

**Note**: Since JSONPlaceholder is a mock API, create/update operations will appear successful but won't persist data. This is normal behavior for testing and demonstration.

## Key Technologies

- **Angular 19**: Latest Angular with standalone components
- **RxJS**: Reactive programming for HTTP operations
- **SCSS**: Advanced styling with design system
- **TypeScript**: Type-safe development
- **Angular Reactive Forms**: Form handling and validation

