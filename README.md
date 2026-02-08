# Notes & Bookmarks Manager

A full-stack web application for managing personal notes and bookmarks with authentication, built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Core Features
- **User Authentication** - Sign up, login, and JWT-based session management
- **Notes Management** - Create, read, update, delete, and search notes with tags
- **Bookmarks Management** - Save URLs with auto-fetching metadata, organize with tags
- **Search & Filter** - Full-text search and tag-based filtering
- **Favorites** - Mark notes/bookmarks as favorites for quick access
- **Responsive Design** - Mobile-friendly UI built with Tailwind CSS

### Bonus Features Implemented
✅ User authentication with JWT

✅ Show data only for logged-in users

✅ Mark notes/bookmarks as favorites

✅ Auto-fetch metadata from bookmark URLs

## 📁 Project Structure

### Backend
```
SERVER/
├── config/
│   └── db.config.js
├── controller/
│   ├── Bookmarks.controller.js
│   ├── Notes.controller.js
│   └── User.controller.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Bookmarks.model.js
│   ├── Notes.model.js
│   └── User.model.js
├── routes/
│   ├── Bookmarks.routes.js
│   ├── Notes.routes.js
│   └── User.routes.js
├── utils/
│   ├── errorHandler.js
│   ├── fetchMetadata.js
│   ├── jwtUtils.js
│   └── validation.js
├── .env
├── package.json
└── server.js
```

### Frontend
```
CLIENT/
├── src/
│   ├── components/
│   │   ├── BookmarkCard.jsx
│   │   ├── BookmarkForm.jsx
│   │   ├── Layout.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NoteForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Bookmarks.jsx
│   │   ├── Login.jsx
│   │   ├── Notes.jsx
│   │   └── Signup.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── .env
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
└── index.html
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Context API** - State management

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd SERVER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd CLIENT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173` (Vite default)

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/users/signup` | Register new user | No |
| POST | `/api/users/login` | Login user | No |
| POST | `/api/users/logout` | Logout user | Yes |
| GET | `/api/users/profile` | Get user profile | Yes |
| DELETE | `/api/users/delete` | Delete user account | Yes |

### Notes Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/notes` | Get all notes (with optional query params: `?q=search&tags=tag1,tag2`) | Yes |
| GET | `/api/notes/:id` | Get single note | Yes |
| POST | `/api/notes` | Create new note | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |

### Bookmarks Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/bookmarks` | Get all bookmarks (with optional query params: `?q=search&tags=tag1,tag2`) | Yes |
| GET | `/api/bookmarks/:id` | Get single bookmark | Yes |
| POST | `/api/bookmarks` | Create new bookmark (auto-fetches title if empty) | Yes |
| PUT | `/api/bookmarks/:id` | Update bookmark | Yes |
| DELETE | `/api/bookmarks/:id` | Delete bookmark | Yes |

### Query Parameters
- **q** - Search term for full-text search
- **tags** - Comma-separated list of tags to filter by

## 📱 Frontend Pages

### `/login`
- Email and password authentication
- Redirects to `/notes` on successful login

### `/signup`
- User registration form
- Name, email, and password required

### `/notes`
- List of all user's notes
- Search and filter functionality
- Create, edit, delete notes
- Mark notes as favorites
- Tag management

### `/bookmarks`
- List of all user's bookmarks
- Search and filter functionality
- Create, edit, delete bookmarks
- Auto-fetch URL metadata when title is empty
- Mark bookmarks as favorites
- Tag management

## 🔐 Authentication Flow
1. User registers or logs in
2. Backend generates JWT token
3. Token stored in HTTP-only cookie
4. Protected routes verify token via middleware
5. All user data filtered by userId

## 📦 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Note
```javascript
{
  title: String,
  content: String,
  tags: [String],
  favorite: Boolean,
  userId: ObjectId (ref: User),
  createdAt: Date
}
```

### Bookmark
```javascript
{
  url: String,
  title: String,
  description: String,
  tags: [String],
  favorite: Boolean,
  userId: ObjectId (ref: User),
  metadataFetched: Boolean,
  createdAt: Date
}
```

## 🧪 Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create Note:**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Meeting Notes","content":"Discussed project timeline","tags":["work","meeting"]}'
```

**Create Bookmark (auto-fetch):**
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"url":"https://example.com","tags":["webdev","resources"]}'
```

## 🎯 Evaluation Criteria Met

✅ Working CRUD functionality - Full CRUD operations for notes and bookmarks

✅ Code structure and modularity - Clear separation of concerns, reusable components

✅ Error handling and validation - Input validation, proper HTTP status codes, user-friendly error messages

✅ UI/UX quality - Responsive design with Tailwind CSS, clean and intuitive interface

✅ Clarity in README - Comprehensive setup instructions and documentation

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB connection failed**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**CORS errors**
- Backend uses CORS middleware with credentials
- Frontend uses withCredentials: true in axios

**Authentication issues**
- Clear browser cookies
- Check JWT token in request headers

**Auto-fetch metadata not working**
- Some websites block scraping
- Try with different URLs
- Check backend console for errors

## 📝 Notes for Reviewers

- **Auto-fetch Feature:** When creating a bookmark without a title, the backend automatically fetches the page title using Cheerio
- **Security:** Passwords hashed with bcrypt, JWT tokens in HTTP-only cookies
- **Search:** Full-text search implemented with MongoDB text indexes
- **Responsive:** Mobile-first design using Tailwind CSS utility classes
- **Error Handling:** Consistent error responses with appropriate HTTP status codes

## 📄 License

This project is for assessment purposes only.
