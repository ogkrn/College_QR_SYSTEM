# 📌 Project Description – College QR Code Management System

The **College QR Code Management System** is a full-stack application designed to modernize student identification, attendance, and campus access management. The system consists of two main interfaces:

* A **Student Mobile App** (Expo + React Native) where students can log in, view their **dynamic QR code** (rotating every few minutes for security), scan QR codes for gate entry, and check their attendance records.
* An **Admin Web Portal** (Next.js + Tailwind + ShadCN UI) where administrators can manage student records, approve/reset passwords, and monitor QR activity logs in real time.

The **backend** (NestJS/Express + Prisma + PostgreSQL) provides secure REST APIs, handling authentication with **JWT (access + refresh tokens)**, QR code rotation, and role-based access for students and admins. Security is strengthened with **bcrypt password hashing, input validation, Helmet.js, CORS, and rate limiting**.

The system is designed with **industry standards** in mind:

* **TypeScript** for type safety across web, mobile, and backend.
* **Dockerized deployment** for portability.
* **CI/CD pipelines with GitHub Actions** for automated testing and deployment.
* Hosting via **Vercel (web), Render/Heroku/AWS (backend), and Expo (mobile)**.

This project demonstrates skills in **full-stack development, mobile-first design, security best practices, and DevOps**, making it both a practical campus solution and a portfolio-ready industry-grade system.

