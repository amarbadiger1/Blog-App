# **Project**

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)  
A modern full-stack web application built with **Next.js**, **PostgreSQL**, **Prisma**, and **Tailwind CSS**.

---

## **Table of Contents**

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## **About**

[Project Name] is a [brief description of the project]. This project was built to [purpose or problem it solves].

---

## **Tech Stack**

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: [e.g., Vercel, Docker]

---

## **Features**

- User authentication (login/signup)
  - Clerk based Auth using Custom pages
- Responsive design
  - Tailwind Css
- CRUD operations for [data entity]
- Secure API integration with Prisma and PostgreSQL

---

## **Getting Started**

### **Prerequisites**

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)

---

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
   ```
2. **install dependencies**
   ```bash
   npm install
   ```

---

### **Running the Application**

1. **Clone the repository**
   ```bash
    npm run dev
   ```

---

### **Environment Variables**

1. **Clone the repository**
   ```bash
    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
   ```

---

### **Database Setup**

1. **Clone the repository**
   ```bash
   npx prisma init
   ```
2. **Migrate the database**
   ```bash
   npx prisma migrate dev
   ```
3. **Generate the Prisma client**
   ```bash
   npx prisma generate
   ```
4. **PrismaClient Singleton**
   _This is used for specifically to nextjs_

   ```bash
   import { PrismaClient } from "@prisma/client/extension";
    const prismaClientSinglton = () => {
    return new PrismaClient();
    };

    const globalForprisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    };

    const prisma = globalForprisma.prisma ?? prismaClientSinglton();
    if (process.env.NOTDE_ENV !== "production") globalForprisma.prisma = prisma;

    export default prisma;
   ```
