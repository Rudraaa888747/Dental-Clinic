# 🏥 Azure OS & Azure Smiles Dental Clinic

<div align="center">
  <img src="app/public/logo.jpg" alt="Azure Smiles Logo" width="150"/>
  <br/>
  <h3>Premium, Enterprise-Grade Dental Clinic Management System</h3>
</div>

---

## 🌟 Overview

**Azure Smiles** is not just a clinic website—it's a luxury digital experience built with modern web technologies, sophisticated animations, and seamless responsive design. 

**Azure OS** is the underlying clinic management system that powers the frontend. It enables administrators to handle everything from live telemetry and appointments to billing, EMIs, and clinical insights, all wrapped in a sleek, dark-mode native-like interface.

---

## 🏗️ Architecture & Tech Stack

The project is structured as a unified monorepo containing both a high-performance React frontend and a secure Node.js backend.

### Frontend (`app/src`)
- **React 18**: Component-driven UI.
- **Tailwind CSS**: Strict, atomic design system adherence for luxury UI.
- **Framer Motion**: Cinematic page transitions and micro-animations.
- **Vite**: Ultra-fast HMR and build tool.

### Backend (`app/server`)
- **Node.js & Express**: Robust API architecture.
- **MongoDB**: NoSQL database for flexible health record schemas.
- **JWT & RBAC**: Secure Role-Based Access Control and session management.

### 📱 Mobile-First UX
The platform features a completely bespoke mobile architecture. It isn't just responsive—it behaves like a native iOS/Android application with sticky action footers, bottom-sheet slideovers, body scroll locking, safe-area paddings (`pb-safe`), and touch-optimized navigation.

---

## ✨ Key Features

### 🧑‍⚕️ Patient Experience (Azure Smiles)
- **Cinematic UI**: Glassmorphism, deep layered lighting, and sophisticated typography.
- **Responsive Booking Pipeline**: A frictionless appointment booking flow that works perfectly on all devices.
- **Dynamic Content**: Live fetching of treatments, reviews, and gallery assets directly from the clinic's database.

### 🛡️ Administrator Experience (Azure OS)
- **Live Dashboard Telemetry**: Real-time updates on active patients, appointments, and revenue metrics.
- **Advanced Billing & EMI**: Create invoices, manage partial payments, and auto-generate EMI installment plans.
- **Patient Management Pipeline**: Full CRUD capabilities for patient profiles, medical histories, and consultation logs.
- **Demo Mode Protection**: Built-in safeguards to prevent write-operations in restricted public demonstration environments.
- **Secure Authentication**: Encrypted sessions with a secure, mobile-optimized logout flow.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ADMIN_EMAIL=admin@azure.com
   ADMIN_PASSWORD=securepassword
   PORT=5000
   ```

4. **Run Development Server**
   To run both the backend server and the frontend environment concurrently:
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ Recent Optimizations

- **Mobile UI Hardening**: Perfected bottom-bar navigation spacing (`pb-24`), zero horizontal overflow, and strict z-index layering for dropdowns.
- **Robust Error Handling**: Step-by-step validation added to the New Booking Pipeline to prevent incomplete submissions.
- **State Management**: Ensured the UI updates reactively and gracefully gracefully handles session expirations and demo restrictions.
- **Navigation Flow**: Added seamless bridging between the public-facing site and the Admin Dashboard.

---
*Built for the future of luxury healthcare.*
