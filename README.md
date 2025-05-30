# Todo Application

A full-stack todo application built with NextJS frontend and NestJS backend, featuring user authentication and todo management.

## Features

- **User Authentication**: Sign up and sign in functionality
- **User Management**: Secure user registration with email and username
- **Todo Management**: Create, view, and manage todos with different statuses
- **Public Todo Feed**: View todos created by all users on the homepage
- **Personal Todo Dashboard**: Manage your own todos in a dedicated page
- **Modern UI**: Clean and responsive design using Tailwind CSS and Shadcn UI components

## Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT tokens with Passport.js
- **Validation**: class-validator and class-transformer
- **Password Hashing**: bcryptjs

### Frontend (NextJS)
- **Framework**: NextJS 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI with Radix UI primitives
- **HTTP Client**: Axios
- **State Management**: React Context for authentication

## Project Structure

```
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   ├── todos/          # Todo management module
│   │   └── main.ts         # Application entry point
│   └── package.json
├── frontend/               # NextJS frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and API client
│   │   └── types/        # TypeScript type definitions
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-tools-demo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run start:dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

### Usage

1. **Homepage**: Visit `http://localhost:3000` to see all public todos
2. **Sign Up**: Create a new account at `/signup`
3. **Sign In**: Login to your account at `/signin`
4. **My Todos**: Access your personal todo dashboard at `/todos` (requires authentication)

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login with email/username and password

### Todos
- `GET /todos` - Get all public todos
- `POST /todos` - Create a new todo (requires authentication)
- `GET /todos/my-todos` - Get current user's todos (requires authentication)

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Todos Table
- `id` - Primary key
- `name` - Todo title
- `description` - Todo description
- `status` - Todo status (pending, in_progress, completed)
- `userId` - Foreign key to users table
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration for frontend-backend communication
- Protected routes requiring authentication

## Development

### Backend Development
```bash
cd backend
npm run start:dev  # Start in watch mode
npm run build      # Build for production
npm run test       # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 