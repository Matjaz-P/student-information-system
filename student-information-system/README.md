# Student Information System

A modern Angular application for managing student records and course enrollments. Built with Angular 20, PrimeNG, and json-server.

## Quick Start

### Prerequisites
- Node.js 18 or newer
- npm 9 or newer

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-information-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both the Angular dev server and json-server concurrently:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

4. **Open your browser** and visit http://localhost:4200

### Alternative: Run Services Separately
```bash
npm start           # Angular dev server only
npm run json-server # JSON Server API only
```

## Features

- Full CRUD operations: add, edit (courses only), and delete students
- Student overview table with sorting and pagination (20 per page by default)
- Lazy-loaded routing for the students feature module
- PrimeNG powered UI with custom styling and responsive layout
- Reactive forms with validation and inline feedback

## Technologies

- Angular 20.3
- PrimeNG 20
- TypeScript 5.9
- RxJS 7.8
- json-server 1.0

## Project Structure

```
src/app/
  features/students/     # Lazy-loaded student module
    overview/            # Student table component
    students.module.ts
  models/                # TypeScript interfaces
    student.model.ts
    course.model.ts
  services/              # HTTP services
    student.service.ts
  shared/                # Shared components (custom paginator)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Angular app and JSON Server |
| `npm start` | Start Angular dev server only |
| `npm run json-server` | Start JSON Server API only |
| `npm run build` | Production build |
| `npm test` | Run unit tests |

## API Endpoints

The application uses json-server to provide a REST API. Data is stored in `db.json`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students` | Get all students |
| `GET` | `/students/:id` | Get student by ID |
| `POST` | `/students` | Create new student |
| `PATCH` | `/students/:id` | Update student (courses only in UI) |
| `DELETE` | `/students/:id` | Delete student |
| `GET` | `/courses` | Get all available courses |

## Implementation Notes

### Requirements Fulfilled
- Add new student with basic info and courses
- Edit student (courses only)
- Delete student with confirmation
- Overview table with all student information
- Pagination: 20 students per page (default)
- Lazy-loaded routing (`/students` route)
- Latest Angular release and PrimeNG components throughout
- HTTP calls to json-server backend

### Key Features
- Clean architecture: dedicated service layer, reactive forms, and typed models
- User experience: confirmation dialogs, toast notifications, accessible form validation
- Professional UI: custom theme, tailored table styling, and responsive layout
- Data consistency: client-side normalization keeps IDs numeric and dates predictable

## License

This project was created as a technical assessment.
