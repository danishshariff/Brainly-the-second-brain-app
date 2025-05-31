# Brainly - Your Second Brain App 🧠

Brainly is a powerful knowledge management application that helps you organize, store, and share your digital content effectively. Think of it as your second brain, where you can store everything from tweets to articles, and access them whenever you need.

## 🚀 Features

### 1. User Authentication
- **Sign Up**: Create your account with email and password
  <img src="docs/images/sign-up.png" alt="Sign Up Feature" width="600" height="400" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

- **Sign In**: Secure login to access your personal dashboard
  <img src="docs/images/sign-in.png" alt="Sign In Feature" width="600" height="400" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

### 2. Modern UI with Dark Mode Support
- **Light Mode**: Clean and professional interface
  <img src="docs/images/light-mode.png" alt="Light Mode UI" width="800" height="500" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

- **Dark Mode**: Easy on the eyes with dark theme support
  <img src="docs/images/dark-mode.png" alt="Dark Mode UI" width="800" height="500" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

### 3. Content Management
- **Add Content**: Easily add new content cards with rich text support
  <img src="docs/images/add-new-conent.png" alt="Add Content Feature" width="700" height="450" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

- **Content Timeline**: Automatic date and time tracking for all content
  <!-- Timeline screenshot will be added later -->

### 4. Smart Filtering
- **Sidebar Filters**: Filter content by type (Twitter, YouTube, etc.)
  <img src="docs/images/sidebar-filter.png" alt="Filter Feature" width="600" height="400" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

### 5. Content Sharing
- **Share Content**: Generate shareable links for your content
  <img src="docs/images/share-link.png" alt="Share Feature" width="600" height="400" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

- **Shared View**: How shared content appears to others
  <img src="docs/images/shared-view.png" alt="Shared View" width="800" height="500" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

### 6. User Profile
- **Profile Card**: View and manage your profile information
  <img src="docs/images/edit-profile.png" alt="User Profile" width="600" height="400" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Context for state management

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- JWT for authentication

## 🔒 Security Features
- JWT-based authentication
- Password hashing
- Protected routes
- Secure content sharing

## 🌐 API Documentation
The API documentation is available at `/api-docs` when running the backend server.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors
- Danish Shariff - Initial work

## 🙏 Acknowledgments
- Thanks to all contributors who have helped shape this project
- Inspired by the concept of a "Second Brain" for knowledge management 

## 📋 Complete Features List

### Authentication & User Management
- User registration with email and password
- Secure login system
- JWT-based authentication
- User profile management
- Profile customization options

### Content Management
- Create and store content cards
- Rich text support for content
- Content categorization
- Content editing and deletion
- Content organization system
- Automatic date and time tracking
- Content creation history
- Last modified timestamps
- Content sharing timestamps
- Chronological content view

### Search & Filtering
- Real-time search functionality
- Filter content by type (Twitter, YouTube, etc.)
- Advanced search capabilities
- Quick access to recent content
- Smart content categorization

### UI/UX Features
- Modern, responsive design
- Dark/Light mode toggle
- Intuitive navigation
- Sidebar for quick access
- Mobile-friendly interface

### Sharing Capabilities
- Generate shareable links
- Public/Private content options
- Custom sharing settings
- View shared content
- Link preview functionality

### Security Features
- Password hashing
- Protected routes
- Secure content sharing
- JWT token management
- Session management

### Additional Features
- Real-time updates
- Content analytics
- User activity tracking
- Cross-platform compatibility
- Performance optimization 