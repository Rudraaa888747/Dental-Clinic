# Azure OS & Azure Smiles Dental Clinic

A premium, enterprise-grade Dental Clinic Management System (Azure OS) and a Cinematic Patient-Facing Web Experience (Azure Smiles).

## Overview

Azure Smiles is not just a clinic website—it's a luxury digital experience built with modern web technologies, sophisticated animations, and seamless responsive design. 
Azure OS is the underlying clinic management system that powers the frontend, enabling administrators to manage everything from appointments and patient records to billing, EMIs, and AI-driven clinical insights.

## Architecture

The project is structured as a unified monorepo containing both the React frontend and the Express backend.

- **Frontend (`app/src`)**: A high-performance React application utilizing `framer-motion` for premium cinematic animations, Tailwind CSS for strict design system adherence, and Lenis for smooth scrolling.
- **Backend (`app/server`)**: A robust Node.js/Express backend with MongoDB, featuring Role-Based Access Control (RBAC), secure JWT authentication, and comprehensive clinic management modules (Appointments, Invoices, EMI Plans, Patients, Reviews, AI Insights).
- **Mobile UX**: The platform features a completely bespoke mobile architecture. It isn't just responsive—it behaves like a native iOS/Android application with sticky action footers, bottom-sheet slideovers, body scroll locking, and touch-optimized navigation.

## Features

### Patient Experience (Azure Smiles)
- **Cinematic UI**: Glassmorphism, deep layered lighting, and sophisticated typography (Beverly Hills standard).
- **Responsive Booking Pipeline**: A frictionless appointment booking flow that works perfectly on all devices.
- **Dynamic Content**: Live fetching of treatments, reviews, and gallery assets.

### Administrator Experience (Azure OS)
- **Live Dashboard telemetry**: Real-time updates on active patients, appointments, and revenue.
- **Advanced Billing & EMI**: Create invoices, manage partial payments, and auto-generate EMI installment plans.
- **AI Clinical Assistant**: Provides automated insights and triage recommendations based on patient data.
- **Patient Management**: Full CRUD capabilities for patient profiles, medical histories, and consultation logs.
- **Secure Authentication**: Encrypted sessions with a secure mobile-optimized logout flow.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB URI

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ADMIN_EMAIL=admin@azure.com
   ADMIN_PASSWORD=securepassword
   PORT=5000
   ```

### Running the Application

To run both the backend server and the frontend development environment concurrently:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To serve the production build:
```bash
npm start
```

## Recent Optimizations

- **Mobile UX Hardening**: Zero horizontal overflow, strict z-index layering, and body scroll locking for modals to prevent nested scrolling.
- **Sticky Action Footers**: Mobile forms dynamically adapt with sticky submission buttons to prevent excessive scrolling.
- **CTA Hierarchy**: Standardized Call-To-Action buttons across the platform to reduce cognitive load and duplication.
- **Keyboard Safety**: Adaptive modal heights (`dvh`) ensure forms are never occluded by the mobile virtual keyboard.

---
*Built for the future of luxury healthcare.*
