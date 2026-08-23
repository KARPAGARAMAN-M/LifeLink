k# 🩸 LifeLink – Smart Blood Donor & Emergency Blood Request Management System

A full-stack web application connecting blood donors with recipients during emergencies. Built with **Spring Boot 3** (Java 21) and **React 18** (Vite + Tailwind CSS).

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** – Secure login/register with BCrypt password encryption
- 👥 **Role-Based Access** – USER and ADMIN roles
- 🩸 **Donor Management** – Register, update profile, toggle availability
- 🔍 **Donor Search** – Filter by blood group, city, and state
- 📨 **Blood Requests** – Create, accept, reject, complete requests
- 📊 **Admin Dashboard** – Analytics, user management, charts
- 📧 **Email Notifications** – Automated emails for key events
- 🌙 **Dark Mode** – System-aware theme toggle

### Bonus Features
- 🧮 **Eligibility Calculator** – 56-day donation gap checker
- 🚨 **Emergency Highlighting** – Critical requests pulse with red border
- 📈 **Charts** – Blood group distribution (Bar & Pie charts)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router 6, Axios, Recharts |
| Backend | Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA |
| Database | MySQL 8 |
| Auth | JWT (jjwt 0.12.x) + BCrypt |
| Email | Spring Boot Starter Mail |
| Build | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
life link/
├── backend/                    # Spring Boot Backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/lifelink/
│       ├── config/             # Security, JWT, CORS configs
│       ├── controller/         # REST API controllers
│       ├── dto/                # Request/Response DTOs
│       ├── entity/             # JPA entities
│       ├── enums/              # Enum types
│       ├── exception/          # Custom exceptions + global handler
│       ├── repository/         # JPA repositories
│       └── service/            # Business logic services
├── frontend/                   # React Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── src/
│       ├── api/                # Axios instance
│       ├── components/         # Reusable components
│       ├── context/            # Auth & Theme context
│       ├── pages/              # Page components
│       └── utils/              # Constants & helpers
├── schema.sql                  # Database schema
├── render.yaml                 # Render deployment config
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Java 21** (JDK)
- **Maven 3.9+**
- **Node.js 18+** & npm
- **MySQL 8** (running locally)

### 1. Database Setup
```bash
mysql -u root -p
CREATE DATABASE lifelink_db;
```

### 2. Backend Setup
```bash
cd backend

# Update database credentials in src/main/resources/application-dev.properties if needed

# Run the application
mvn spring-boot:run
```
The backend starts at `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend starts at `http://localhost:5173`

### 4. Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lifelink.com | admin123 |
| User | rahul@example.com | password123 |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donors` | Register as donor |
| PUT | `/api/donors` | Update donor profile |
| GET | `/api/donors/search?bloodGroup=&city=&state=` | Search donors |
| GET | `/api/donors/{id}` | Get donor by ID |
| GET | `/api/donors/my-profile` | Get own donor profile |
| PATCH | `/api/donors/availability` | Toggle availability |
| GET | `/api/donors/check` | Check if user is donor |

### Blood Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Create blood request |
| PUT | `/api/requests/{id}/accept` | Accept request |
| PUT | `/api/requests/{id}/reject` | Reject request |
| PUT | `/api/requests/{id}/complete` | Complete request |
| GET | `/api/requests/my-requests` | Get sent requests |
| GET | `/api/requests/donor-requests` | Get received requests |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/donors` | List all donors |
| GET | `/api/admin/requests` | List all requests |
| PUT | `/api/admin/users/{id}/block` | Block user |
| PUT | `/api/admin/users/{id}/unblock` | Unblock user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |

---

## 🌐 Deployment Guide

### Frontend → Vercel

1. **Push your code** to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
6. Deploy!

### Backend → Render

1. **Push your code** to a GitHub repository
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name**: `lifelink-backend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Plan**: Free
5. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DATABASE_URL` | `jdbc:mysql://your-host:port/your-db?useSSL=true` |
   | `DATABASE_USERNAME` | Your DB username |
   | `DATABASE_PASSWORD` | Your DB password |
   | `JWT_SECRET` | A random 256-bit base64 string |
   | `CORS_ORIGINS` | `https://your-app.vercel.app` |
   | `MAIL_USERNAME` | Your email/Mailtrap username |
   | `MAIL_PASSWORD` | Your email app password |
6. Deploy!

### Database → Aiven (Free MySQL)

1. Go to [aiven.io](https://aiven.io) → Sign up
2. Create a **Free MySQL** service
3. Copy the connection details:
   - Host, Port, Database name, Username, Password
4. Format as JDBC URL: `jdbc:mysql://HOST:PORT/DB_NAME?useSSL=true&requireSSL=true`
5. Set these as environment variables in Render

> **Alternative**: Use [Railway](https://railway.app) (usage-based pricing) or [PlanetScale](https://planetscale.com) for MySQL hosting.

---

## 🔧 Environment Variables

### Backend (Render)
```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:mysql://host:port/dbname
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your_base64_encoded_256bit_secret
CORS_ORIGINS=https://your-frontend.vercel.app
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ for saving lives.

---

> **Note**: The free tier on Render has cold starts (30-60 seconds after 15 minutes of inactivity). Consider using [UptimeRobot](https://uptimerobot.com) to ping your backend periodically if you need it always available.
