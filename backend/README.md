# Brainly - Content Management System

A full-stack content management system built with React, TypeScript, Node.js, and MongoDB. This application allows users to manage and share various types of content including YouTube videos, Twitter posts, and documents.

## Features

- User authentication (signup/signin)
- Content management (add, view, delete)
- Support for multiple content types:
  - YouTube videos
  - Twitter posts
  - Document uploads
- Real-time content updates
- Responsive design with dark/light mode
- Secure file handling
- RESTful API with Swagger documentation

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication
- Multer (file uploads)
- Swagger (API documentation)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd brainly
npm install

# Install frontend dependencies
cd ../brainly-frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Brainly
JWT_PASSWORD=your-secret-key
FRONTEND_URL=http://localhost:5173
```

4. Start the development servers:

```bash
# Start backend server (from brainly directory)
npm run dev

# Start frontend server (from brainly-frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## Project Structure

```
brainly/                 # Backend
├── src/
│   ├── index.ts        # Main server file
│   ├── config.ts       # Configuration
│   ├── db.ts          # Database models
│   ├── middleware.ts  # Authentication middleware
│   └── utils.ts       # Utility functions
└── uploads/           # Document storage

brainly-frontend/       # Frontend
├── src/
│   ├── components/    # Reusable components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom hooks
│   ├── context/      # React context
│   └── config.ts     # Frontend configuration
```

## API Documentation

The API documentation is available at `/api-docs` when the backend server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 