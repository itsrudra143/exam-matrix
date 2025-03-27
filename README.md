# Exam Matrix

A comprehensive full-stack web application for managing online examinations and tests. This platform enables teachers to create and manage tests while allowing students to take them in a structured environment.

## System Architecture

```mermaid
graph TB
    Client[Client Browser] --> Frontend[Frontend React App]
    Frontend --> API[Express Backend API]
    API --> DB[(PostgreSQL Database)]
    API --> Auth[JWT Authentication]

    subgraph Frontend Components
        Frontend --> UI[UI Components]
        Frontend --> State[State Management]
        Frontend --> Router[React Router]
    end

    subgraph Backend Services
        API --> UserService[User Service]
        API --> TestService[Test Service]
        API --> ClassService[Class Service]
    end
```

## Database Schema

```mermaid
erDiagram
    User ||--o{ Test : creates
    User ||--o{ Class : creates
    User ||--o{ TestAttempt : attempts
    User ||--|| Profile : has
    User ||--o{ Enrollment : has

    Test ||--o{ Question : contains
    Test ||--o{ TestAttempt : has
    Test ||--o{ TestClass : belongs_to

    Class ||--o{ Enrollment : has
    Class ||--o{ TestClass : has

    Question ||--o{ Option : has
    Question ||--o{ Answer : has

    TestAttempt ||--o{ Answer : contains
```

## Component Structure

```mermaid
graph TD
    App[App.jsx] --> Auth[Auth Context]
    App --> Router[Router]

    Router --> Dashboard[Dashboard]
    Router --> Login[Login]
    Router --> Register[Register]
    Router --> Class[Class Management]
    Router --> Test[Test Management]

    Dashboard --> UserProfile[User Profile]
    Dashboard --> Stats[Statistics]

    Class --> ClassList[Class List]
    Class --> ClassDetail[Class Detail]
    Class --> Enrollment[Enrollment]

    Test --> TestList[Test List]
    Test --> TestCreate[Test Creation]
    Test --> TestAttempt[Test Attempt]
```

## Features

- User Authentication and Authorization
- Class Management
- Test Creation and Management
- Multiple Question Types Support (MCQ, Checkbox, Text, Coding)
- Test Attempt Tracking
- Score Management
- Class Enrollment System

## Tech Stack

### Frontend

- React with Vite
- Material-UI (@mui/material)
- React Query for data fetching
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization

### Backend

- Node.js with Express
- PostgreSQL database with Prisma ORM
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── api/              # API integration
│   ├── utils/            # Utility functions
│   ├── services/         # Business logic
│   ├── context/          # React context
│   └── assets/           # Static assets
├── server/               # Backend code
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── prisma/              # Database schema and migrations
└── public/              # Public assets
```

## Database Schema

The application includes several key models:

- `User` - Handles user accounts with roles (STUDENT/ADMIN)
- `Profile` - Additional user information
- `Test` - Exam/test management
- `Question` - Different types of questions
- `Class` - Class management
- `Enrollment` - Student enrollment in classes
- `TestAttempt` - Student attempts at tests
- `Answer` - Student answers to questions

## API Endpoints

The backend exposes several API routes:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/tests` - Test management
- `/api/classes` - Class management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd exam-matrix
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/exam_matrix"
PORT=5000
JWT_SECRET=[your-secret-key]
```

4. Set up the database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Start the backend server:

```bash
npm run dev:server
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Development

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio for database management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
