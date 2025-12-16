# 🎓 College QR Code Management System

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**🚀 A modern, secure, and scalable campus management solution**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Test Accounts](#-test-accounts)

</div>

---

## 📌 About The Project

The **College QR Code Management System** is a cutting-edge full-stack application that revolutionizes how educational institutions handle student identification, attendance tracking, and campus access control. Say goodbye to outdated ID cards and manual attendance sheets – embrace the future of smart campus management! 🌟

### 🎯 What Makes This Special?

This isn't just another QR code scanner. It's a **complete ecosystem** designed with security, scalability, and user experience at its core:

- 🔐 **Dynamic QR Codes** – Rotating every few minutes to prevent screenshot-based fraud
- 📱 **Mobile-First Design** – Students carry their ID right in their pocket
- 🖥️ **Powerful Admin Dashboard** – Real-time monitoring and complete control
- 👑 **Super Admin System** – Hidden super admin for managing admin approvals
- 🛡️ **Enterprise-Grade Security** – JWT authentication, bcrypt hashing, OTP verification & more
- 🐳 **Docker Ready** – Deploy anywhere with containerized infrastructure

### 🏗️ System Architecture

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Student App** | Expo + React Native | Mobile app for QR display & student features |
| **Frontend** | Next.js + Tailwind CSS | Web portal with role-based dashboards |
| **Backend API** | Express + Prisma + PostgreSQL | RESTful API with secure authentication |

---

## ✨ Features

### 👑 Super Admin
- Hidden super admin account (seeded automatically)
- Approve/reject admin registration requests
- View all registered students
- Full system control and settings

### 🛡️ Admin Portal
- Admin registration requires Super Admin approval
- View student list with names and roll numbers
- Manage outings and leave approvals
- System settings and monitoring

### 📱 Student Mobile App (Expo)
- Secure login with roll number + email + password
- Student registration with OTP email verification
- Dashboard with quick actions, stats, and activity feed
- Attendance history & records
- Outing request management

### 🖥️ Web Frontend
- Role-based login (Admin, Student, Guard)
- Role-scoped dashboards with tailored quick actions
- Student list page for admins/guards/super admin
- Admin approval workflow for Super Admin
- Pending approval page for new admin registrations

### 🚪 Guard Features
- QR code scanning
- View student list
- Outing request management
- Extended time handling
- Leave scanner

### 🔧 Backend API
- RESTful API architecture
- JWT access token authentication
- OTP email verification (console log for dev, ready for Supabase/SMTP)
- Role-scoped unique constraints (student roll ≠ guard ID conflict)
- Prisma ORM with PostgreSQL
- Input validation with Zod
- Security: Helmet.js, CORS, bcrypt password hashing

---

## 🔐 Authentication System

### Registration Flow
| Role | Flow |
|------|------|
| **Student/Guard** | Register → OTP sent to email → Verify OTP → Login |
| **Admin** | Register → Pending approval page → Super Admin approves → Login |
| **Super Admin** | Pre-seeded account (cannot register) |

### Login Identifiers
| Role | Required Fields |
|------|-----------------|
| **Student** | Email + Password + Roll Number |
| **Guard** | Email + Password + ID Number + Name |
| **Admin** | Email + Password + Username |
| **Super Admin** | Same as Admin (uses Admin login) |

### Role-Scoped Uniqueness
- Student roll numbers are unique among students only
- Guard IDs are unique among guards only
- Admin usernames are unique among admins only
- This allows a student and guard to have the same numeric ID (e.g., "000")

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Languages** | TypeScript, JavaScript |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Frontend** | Next.js 16, React, Tailwind CSS |
| **Mobile** | React Native, Expo Go |
| **Security** | JWT, bcrypt, Zod validation |
| **DevOps** | Docker, GitHub Actions |

---

## 🧪 Test Accounts

After running `npm run seed`, these accounts are available:

| Role | Email | Password | Identifier |
|------|-------|----------|------------|
| **Super Admin** | `admin@gmail.com` | `Admin@123` | Username: `Admin@1` |
| **Student** | `student@gmail.com` | `Student@123` | Roll: `000` |
| **Guard** | `guard@gmail.com` | `Guard@123` | ID: `000` |

> **Note:** Student and Guard can have the same ID (`000`) because uniqueness is scoped per role.

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running on your machine.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** or **yarn** | Latest | Comes with Node.js |
| **PostgreSQL** | v14.x or higher | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Docker** (Optional) | Latest | [docker.com](https://www.docker.com/) |

---

### 🐧 Installation on Linux

```bash
# 1️⃣ Clone the repository
git clone https://github.com/ogkrn/College_QR_SYSTEM.git

# 2️⃣ Navigate to the project directory
cd College_QR_SYSTEM/college-qr-system

# 3️⃣ Install backend dependencies
cd apps/backend
npm install

# 4️⃣ Set up environment variables
# Create a .env file in the backend directory
cp .env.example .env
# Or create manually:
cat > .env << EOF
DATABASE_URL="postgresql://username:password@localhost:5432/college_qr_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=3000
EOF

# 5️⃣ Set up PostgreSQL database
sudo -u postgres psql -c "CREATE DATABASE college_qr_db;"
sudo -u postgres psql -c "CREATE USER your_username WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE college_qr_db TO your_username;"

# 6️⃣ Run Prisma migrations
npx prisma migrate dev

# 7️⃣ Generate Prisma client
npx prisma generate

# 8️⃣ Start the development server
npm run dev
```

---

### 🪟 Installation on Windows

```powershell
# 1️⃣ Clone the repository
git clone https://github.com/ogkrn/College_QR_SYSTEM.git

# 2️⃣ Navigate to the project directory
cd College_QR_SYSTEM\college-qr-system

# 3️⃣ Install backend dependencies
cd apps\backend
npm install

# 4️⃣ Set up environment variables
# Create a .env file in the backend directory with the following content:
# You can use Notepad or any text editor

# Create .env file using PowerShell:
@"
DATABASE_URL="postgresql://username:password@localhost:5432/college_qr_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8

# 5️⃣ Set up PostgreSQL database (using pgAdmin or psql)
# Open pgAdmin or psql and run:
# CREATE DATABASE college_qr_db;

# 6️⃣ Run Prisma migrations
npx prisma migrate dev

# 7️⃣ Generate Prisma client
npx prisma generate

# 8️⃣ Start the development server
npm run dev
```

---

### 🪄 Frontend Portal (Next.js)

```bash
# 1️⃣ Navigate to the frontend folder
cd College_QR_SYSTEM/college-qr-system/apps/frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the Next.js dev server
npm run dev
```

The web portal exposes landing, login, and register routes. The forms let users pick a role (admin, student, guard) before authenticating.

You can also run `npm run build` and `npm run start` inside `apps/frontend` for production-ready builds.

---

### 📱 Mobile App Setup (React Native Expo)

```bash
# 1️⃣ Navigate to the student-app folder
cd College_QR_SYSTEM/college-qr-system/apps/student-app

# 2️⃣ Install dependencies
npm install

# 3️⃣ Update API URL (src/config/api.ts)
# Replace the IP with your machine's local IP address:
# export const API_BASE_URL = 'http://YOUR_LOCAL_IP:4000/api';

# 4️⃣ Start Expo development server
npx expo start

# 5️⃣ Scan QR code with Expo Go app on your phone
# - iOS: Camera app → scan QR
# - Android: Expo Go app → scan QR
```

> **Note:** Make sure your phone and computer are on the same network.

---

### 🐳 Docker Installation (Recommended for Production)

```bash
# Clone the repository
git clone https://github.com/ogkrn/College_QR_SYSTEM.git
cd College_QR_SYSTEM

# Build and run with Docker Compose
docker-compose up --build

# The application will be available at http://localhost:3000
```

---

## 🌐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your-refresh-secret` |
| `PORT` | Server port number | `4000` |

---

## 📚 API Documentation

The backend exposes the following API endpoints (base URL: `http://localhost:4000/api`):

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user (Admin/Student/Guard) | No |
| `POST` | `/login` | Login with role-based credentials | No |
| `POST` | `/verify-otp` | Verify OTP for students/guards | No |
| `POST` | `/resend-otp` | Resend OTP code | No |
| `POST` | `/refresh` | Refresh access token | No |

### Admin Routes (`/admins`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Get all approved admins | Yes (Admin) |
| `GET` | `/pending` | Get pending admin requests | Yes (Super Admin) |
| `POST` | `/:id/approve` | Approve admin registration | Yes (Super Admin) |
| `POST` | `/:id/reject` | Reject admin registration | Yes (Super Admin) |

### Student Routes (`/students`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Get all verified students | Yes (Admin) |

### Outing Routes (`/outing`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/request` | Request an outing | Yes (Student) |
| `GET` | `/status` | Check outing status | Yes (Student) |

### Guard Routes (`/guard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/scan` | Scan QR code at gate | Yes (Guard) |
| `GET` | `/logs` | View scan logs | Yes (Guard) |

---

## 🔐 Authentication Flow

### Registration Flow by Role

```
┌─────────────────────────────────────────────────────────────────┐
│                        REGISTRATION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ADMIN:                                                         │
│  1. Register with username + email + password                   │
│  2. Account created (isVerified=true, isApproved=false)         │
│  3. Redirect to /pending-approval page                          │
│  4. Wait for Super Admin approval                               │
│  5. Once approved → can login and access dashboard              │
│                                                                 │
│  STUDENT:                                                       │
│  1. Register with rollNumber + email + password                 │
│  2. OTP sent (logged to console in dev mode)                    │
│  3. Verify OTP within 3 minutes                                 │
│  4. Account verified → can login                                │
│                                                                 │
│  GUARD:                                                         │
│  1. Register with idNumber + email + password                   │
│  2. OTP sent (logged to console in dev mode)                    │
│  3. Verify OTP within 3 minutes                                 │
│  4. Account verified → can login                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Login Credentials by Role

| Role | Login Field | Example |
|------|-------------|---------|
| Admin | Username | `Admin@1` |
| Super Admin | Username | `Admin@1` |
| Student | Roll Number | `000` |
| Guard | ID Number | `000` |

---

## 🛠️ Development Notes

### OTP Email Delivery
Currently, OTP codes are **logged to console** in development mode. To enable real email delivery:
- Integrate Supabase Auth, SendGrid, or Mailgun
- Replace console.log stubs in `auth.controller.ts` with actual email sending

### Database Schema
The schema uses **role-scoped unique constraints**:
```prisma
@@unique([role, rollNumber])
@@unique([role, username])
```
This allows the same identifier (e.g., `000`) to be used by different roles.

### Super Admin
- The Super Admin is pre-seeded and **hidden from public registration**
- Only Super Admin can approve/reject admin registrations
- Username: `Admin@1`, Password: `Admin@123`

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Project Link:** [https://github.com/ogkrn/College_QR_SYSTEM](https://github.com/ogkrn/College_QR_SYSTEM)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ for campus security

</div>