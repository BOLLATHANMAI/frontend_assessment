# Task Manager - Full-Stack Web Application

A scalable web application with user authentication and protected task management dashboard built with **React**, **Node.js**, **Express**, and **MongoDB**.

![Task Manager](https://img.shields.io/badge/Status-Production%20Ready-green)

## 🚀 Features

- **User Authentication**
  - Secure registration with password hashing (bcrypt)
  - JWT-based login with token expiry
  - Protected routes on both frontend and backend

- **Task Management (CRUD)**
  - Create, read, update, and delete tasks
  - Mark tasks as pending/completed
  - Each user only sees their own tasks

- **Search & Filter**
  - Search tasks by title
  - Filter by status (pending/completed)

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Smooth animations and transitions
  - Glass morphism effects

---

## 📁 Project Structure

```
forntend_task/
├── backend/
│   ├── models/
│   │   ├── User.js        # User schema with password hashing
│   │   └── Task.js        # Task schema with user reference
│   ├── routes/
│   │   ├── auth.js        # Register & Login endpoints
│   │   ├── user.js        # User profile endpoint
│   │   └── tasks.js       # Task CRUD endpoints
│   ├── middleware/
│   │   └── auth.js        # JWT verification
│   ├── server.js          # Express server setup
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js   # Axios configuration
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx        # Router setup
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md
└── postman_collection.json
```

---

## 🛠️ Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React 18, Vite    |
| Styling   | Tailwind CSS 3    |
| Backend   | Node.js, Express  |
| Database  | MongoDB, Mongoose |
| Auth      | JWT, bcryptjs     |
| HTTP      | Axios             |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd forntend_task
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint         | Description       | Auth |
|--------|------------------|-------------------|------|
| POST   | /auth/register   | Register new user | ❌    |
| POST   | /auth/login      | Login user        | ❌    |

### User
| Method | Endpoint       | Description    | Auth |
|--------|----------------|----------------|------|
| GET    | /user/profile  | Get user data  | ✅    |

### Tasks
| Method | Endpoint     | Description           | Auth |
|--------|--------------|----------------------|------|
| GET    | /tasks       | Get all user tasks   | ✅    |
| POST   | /tasks       | Create new task      | ✅    |
| PUT    | /tasks/:id   | Update task          | ✅    |
| DELETE | /tasks/:id   | Delete task          | ✅    |

**Query Parameters for GET /tasks:**
- `search` - Filter by title (case-insensitive)
- `status` - Filter by status (`pending` or `completed`)

---

## 🔐 Security Features

1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Authentication** - Stateless token-based auth
3. **Protected Routes** - Frontend + Backend validation
4. **CORS Configuration** - Restricted origins
5. **Error Handling** - Proper status codes and messages

---

## 📈 Scalability Considerations

- **Modular Code Structure** - Separated routes, models, middleware
- **Environment Variables** - Configuration externalized
- **Database Indexing** - Optimized queries
- **Pagination Ready** - Can be added to task list
- **Role-Based Access** - Architecture supports adding roles
- **Cloud Deployment** - Ready for Heroku, AWS, GCP, Vercel

---

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Login with credentials
3. Create, edit, and delete tasks
4. Test search and filter
5. Logout and verify redirect

### API Testing
Import `postman_collection.json` into Postman to test all endpoints.

---

## 📄 License

MIT License - Feel free to use this project for learning or production.

---

## 👨‍💻 Author

Built as a full-stack demonstration project.
