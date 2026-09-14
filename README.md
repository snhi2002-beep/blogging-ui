# Blogging Platform

A fullstack blogging platform built with **Next.js 14**, **MongoDB (Mongoose)**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- ⚡ **Next.js 14 App Router** with TypeScript
- 🍃 **MongoDB & Mongoose**: Database connection pooling with cached connection in `lib/mongodb.ts`
- 🔐 **Production-Level Authentication**:
  - Secure password hashing using `bcryptjs` (salt rounds: 12)
  - HTTP-only, secure, same-site JWT cookies via `jose`
  - Route protection and auth state redirection with Edge `middleware.ts`
  - Auth REST API endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`)
  - Client-side `useAuth()` hook and `AuthProvider`
- 🎨 **shadcn/ui**: Modern component primitives (`Button`, `Card`, `Badge`, `Input`, `Label`, `Avatar`, `Separator`)
- 📱 **Responsive UI**: Hero section, article feeds, responsive login/register cards, and full author profile page

## Environment Setup

Create a `.env.local` file in the root directory (see `.env.example`):

```env
# MongoDB Connection URI (required)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogging_db?retryWrites=true&w=majority

# JWT Secret Key (required)
JWT_SECRET=your_production_grade_random_secret_string_here_32_chars_min
```

## Getting Started

1. Clone and install dependencies:
```bash
git clone https://github.com/snhi2002-beep/blogging-ui.git
cd blogging-ui
npm install
```

2. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
