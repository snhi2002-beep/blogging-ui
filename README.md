# Blogging Platform

A fullstack blogging platform built with **Next.js 14**, **MongoDB (Mongoose)**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- ⚡ **Next.js 14 App Router** with TypeScript
- 🍃 **MongoDB & Mongoose**:
  - Pooled database connection cached in `lib/mongodb.ts`
  - `User` schema for authors, authentication, and roles
  - `Post` schema with automated slug generation, reading time calculation, categories, tags, and like counters
- ✍️ **Full Blogging Engine**:
  - **Create Post (`/write`)**: Rich composition form with tag presets, custom excerpts, cover images, word counting, and reading time estimation.
  - **Article Reading View (`/posts/[slug]`)**: Full typography layout, author card, like toggle counter, and deletion controls for the author.
  - **Dynamic Feed (`/`)**: Real-time keyword search and category filtering directly hitting MongoDB queries.
  - **Author Dashboard (`/profile`)**: Live list of authored articles, dynamic like count aggregations, and quick deletion.
- 🔐 **Production-Level Authentication**:
  - Password hashing via `bcryptjs` (12 salt rounds)
  - HTTP-only JWT session cookies with `jose`
  - Edge middleware protecting routes like `/write`
  - Auth REST API (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`)
- 🎨 **shadcn/ui**: Button, Card, Badge, Input, Label, Textarea, Avatar, Separator primitives

## Environment Variables

Configure `.env.local` (see `.env.example`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogging_db?retryWrites=true&w=majority
JWT_SECRET=your_32_character_minimum_random_secret_string
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
