# Document Management Frontend App

This is a full-featured document management application frontend built with **Next.js**, **React**, **TypeScript**, **Material-UI**, **Prisma**, and **MongoDB (Replica Set Mode)**. It includes mock APIs for frontend developers to simulate backend responses.

---

## Features

- User Authentication (Sign Up, Login, Logout)
- Role-based User Management (Admin, User)
- Document Upload and Management
- Ingestion Trigger and Monitoring UI
- Q&A Interface with document context (mocked)
- Fully responsive UI with Material-UI

---

## Tech Stack

- **Frontend**: Next.js, React, Material-UI (MUI), TypeScript
- **Database ORM**: Prisma
- **Database**: MongoDB (Replica Set)
- **Mock Backend**: Local API routes simulating real API responses

---

## Pre-requisites

- Node.js >= 18.x
- Yarn or npm
- MongoDB (replica set enabled)
- Docker (optional for containerization)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/upendratomar01/document-management.git
cd document-management
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up MongoDB Replica Set

Make sure MongoDB is running in replica set mode.
configure replica mode on your local MongoDB instance

### 4. Set Up Environment Variables

Create a .env.local file in the root directory:

```bash
DATABASE_URL="mongodb://localhost:27017/document-management-db"
NEXTAUTH_SECRET=your_next_auth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## Running the App

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Apply Migrations

```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev

```

visit http://localhost:3000

## Sign up for admin account (Demo only)

Create email with "admin" keyward. (eg. admin@demo.com)
