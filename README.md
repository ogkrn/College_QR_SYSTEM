# 🎓 College QR Code Management System

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**🚀 A modern, secure, and scalable campus management solution**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

---

## 📌 About The Project

The **College QR Code Management System** is a cutting-edge full-stack application that revolutionizes how educational institutions handle student identification, attendance tracking, and campus access control. Say goodbye to outdated ID cards and manual attendance sheets – embrace the future of smart campus management! 🌟

### 🎯 What Makes This Special?

This isn't just another QR code scanner. It's a **complete ecosystem** designed with security, scalability, and user experience at its core:

- 🔐 **Dynamic QR Codes** – Rotating every few minutes to prevent screenshot-based fraud
- 📱 **Mobile-First Design** – Students carry their ID right in their pocket
- 🖥️ **Powerful Admin Dashboard** – Real-time monitoring and complete control
- 🛡️ **Enterprise-Grade Security** – JWT authentication, bcrypt hashing, rate limiting & more
- 🐳 **Docker Ready** – Deploy anywhere with containerized infrastructure

### 🏗️ System Architecture

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Student App** | Expo + React Native | Mobile app for QR display & scanning |
| **Frontend** | Next.js + Tailwind + ShadCN | Web app with Admin Portal integrated |
| **Backend API** | Express + Prisma + PostgreSQL | RESTful API with secure authentication |

---

## ✨ Features

### 📱 Student Mobile App
- Secure login with JWT authentication
- Dynamic QR code generation (auto-rotating)
- Gate entry/exit scanning
- Attendance history & records
- Outing request management

### 🖥️ Frontend
- Student record management
- Password reset approvals
- Real-time QR activity logs
- Attendance monitoring dashboard
- Role-based access control (Admin & User views)
- Register & login flows with explicit role choice (admin, student, guard)
- Login & register now collect roll numbers as the primary identifier so every role can be uniquely tracked
- Each dashboard exposes tailored quick actions (Admin: view student list, all outings, approve leave, system settings; Student: scan QR code, attendance, leave requests, settings; Guard: QR code, outing requests, extended time, leave scanner, support)

### 🔧 Backend API
- RESTful API architecture
- JWT access & refresh token authentication
- Prisma ORM with PostgreSQL
- Input validation with Zod
- Security: Helmet.js, CORS, Rate Limiting

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Languages** | TypeScript, JavaScript |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Frontend** | Next.js, React, Tailwind CSS, ShadCN UI |
| **Mobile** | React Native, Expo |
| **Security** | JWT, bcrypt, Helmet.js, Zod |
| **DevOps** | Docker, GitHub Actions |

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

The web portal exposes landing, login, and register routes. The forms let humans pick a role (admin, student, guard) before authenticating so that the backend knows whether to show dashboards, gates, or guard access.

You can also run `npm run build` and `npm run start` inside `apps/frontend` for production-ready builds.

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

## 📁 Project Structure

```
College_QR_SYSTEM/
├── README.md
├── requirements.txt              # Python dependencies (if any scripts)
└── college-qr-system/
    ├── tsconfig.json
    ├── apps/
    │   ├── frontend/             # Next.js Web App (includes Admin Portal)
    │   │   ├── package.json
    │   │   ├── package-lock.json
    │   │   ├── next.config.ts
    │   │   ├── src/
    │   │   │   └── app/          # Next.js App Router
    │   │   │       ├── globals.css
    │   │   │       ├── layout.tsx
    │   │   │       ├── page.tsx
    │   │   │       ├── login/     # Login page with role selector
    │   │   │       └── register/  # Register page with role selector
    │   ├── backend/              # Express.js API Server
    │   │   ├── package.json      # Node.js dependencies
    │   │   ├── tsconfig.json
    │   │   └── src/
    │   │       ├── controllers/  # Route controllers
    │   │       ├── middlewares/  # Auth & error handling
    │   │       ├── prisma/       # Database schema & migrations
    │   │       ├── routes/       # API routes
    │   │       ├── types/        # TypeScript type definitions
    │   │       └── utils/        # Utility functions (JWT, QR)
    │   └── student-app/          # React Native Mobile App
    └── docker/                   # Docker configuration files
```

---

## 🔧 Available Scripts

Navigate to `college-qr-system/apps/backend` and run:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run migrate` | Run Prisma database migrations |
| `npm run seed` | Seed the database with initial data |

---

Frontend scripts (run inside `college-qr-system/apps/frontend`):
- `npm run dev` – Run the Next.js app in development mode
- `npm run build` – Compile the production build
- `npm run lint` – Run ESLint checks across the frontend


## 🌐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your-refresh-secret` |
| `PORT` | Server port number | `3000` |

---

## 📚 API Documentation

The backend exposes the following API endpoints:

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token

### Outing Routes (`/api/outing`)
- `POST /request` - Request an outing
- `GET /status` - Check outing status

### Guard Routes (`/api/guard`)
- `POST /scan` - Scan QR code at gate
- `GET /logs` - View scan logs

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

</div>

