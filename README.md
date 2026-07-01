<div align="center">
  <img src="app/public/logo.jpg" alt="Azure Smiles Logo" width="120" style="border-radius: 12px; margin-bottom: 20px;" />
  <h1 style="margin-top: 0;">Azure OS & Azure Smiles Clinic</h1>
  <p><strong>Premium, Enterprise-Grade Dental Clinic Management System</strong></p>
  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-architecture--tech-stack">Tech Stack</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-recent-optimizations">Optimizations</a>
  </p>
</div>

---

## 🌟 Overview

**Azure Smiles** is not just a clinic website—it is a luxury digital experience engineered with modern web technologies, sophisticated micro-animations, and a seamless responsive design tailored for patient acquisition and conversion.

**Azure OS** is the robust, underlying clinic management system that powers the frontend. It empowers healthcare administrators to orchestrate live telemetry, appointment scheduling, automated billing, EMI tracking, and clinical insights—all wrapped in a sleek, native-like interface.

---

## 🏗️ Architecture & Tech Stack

This project is structured as a unified monorepo containing a high-performance React frontend and a highly secure Node.js REST API backend.

### Frontend
- **React 18**: Component-driven, highly reactive UI.
- **Tailwind CSS**: Strict, atomic design system adherence for luxury UI and fluid responsiveness.
- **Framer Motion**: Cinematic page transitions, scroll animations, and interactive micro-animations.
- **Vite**: Ultra-fast hot module replacement (HMR) and optimized build tooling.
- **Lenis**: Smooth scrolling engine for an elevated, weightless browsing experience.

### Backend
- **Node.js & Express**: Robust, scalable RESTful API architecture.
- **MongoDB**: NoSQL database for flexible health record schemas and rapid querying.
- **Mongoose**: Elegant MongoDB object modeling.
- **JWT & RBAC**: Secure JSON Web Token authentication with strict Role-Based Access Control.

---

## ✨ Key Features

### 🧑‍⚕️ Patient Experience (Azure Smiles Frontend)
- **Cinematic UI**: Implementation of glassmorphism, deep layered lighting, and sophisticated typography.
- **Responsive Booking Pipeline**: A frictionless, error-handled appointment booking flow optimized for all screen sizes.
- **Dynamic Content Engine**: Live fetching of treatments, patient testimonials, and gallery assets directly from the clinic's database.
- **Mobile-First UX**: Behaves like a native iOS/Android application featuring sticky action footers, bottom-sheet slideovers, body scroll locking, and touch-optimized safe-area paddings (`pb-safe`).

### 🛡️ Administrator Experience (Azure OS Dashboard)
- **Live Dashboard Telemetry**: Real-time analytical updates on active patients, appointments, and revenue metrics.
- **Advanced Billing & EMI**: Seamlessly create invoices, manage partial payments, and auto-generate complex EMI installment plans.
- **Patient Management Pipeline**: Comprehensive CRUD capabilities for patient profiles, medical histories, and consultation logs.
- **Command Palette Search**: Global shortcut-enabled search interface for rapid data retrieval.
- **Secure Authentication**: Encrypted sessions with a secure, mobile-optimized state management flow.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** cluster (Atlas or local instance)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rudraaa888747/Dental-Clinic.git
   cd Dental-Clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ADMIN_EMAIL=admin@azure.com
   ADMIN_PASSWORD=your_secure_password
   PORT=5000
   ```

4. **Run Development Environment**
   Start both the backend server and the frontend client concurrently:
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

- **Animation & Polish Engine**: Integrated Framer Motion springs and custom easing curves for a luxurious app-like feel.
- **Mobile UI Hardening**: Perfected bottom-bar navigation spacing (`pb-24`), zero horizontal overflow, and strict z-index layering for dropdowns and Modals.
- **Form Logic & Schema Validation**: Hardened backend Mongoose schemas (e.g. dynamic Notification structures) to prevent database validation errors on submission.
- **SEO & Security Hardening**: Deployed `noindex, nofollow` meta tags programmatically to sensitive dashboard routes.

---

<div align="center">
  <i>Engineered for the future of luxury healthcare.</i>
</div>
