# CRM Pro — Full-Stack Customer Relationship Management System

A production-quality CRM application for sales teams built with **Spring Boot** (backend) and **Next.js** (frontend).

---

## 🏗️ Architecture

```
┌─────────────┐     HTTP/JSON      ┌──────────────┐     JPA      ┌────────────┐
│   Next.js   │ ◄───────────────► │  Spring Boot  │ ◄──────────► │ PostgreSQL │
│  Frontend   │    JWT Bearer      │   Backend     │              │  Database  │
│  (port 3000)│                    │  (port 8080)  │              │            │
└─────────────┘                    └──────────────┘              └────────────┘
```

**Backend Layers:** Controller → Service → Repository → Database

---

## 📋 Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** & npm
- **PostgreSQL 14+**
- **Maven** (or use the included wrapper `mvnw`)

---

## 🚀 Quick Start

### 1. Database Setup

```sql
-- Connect to PostgreSQL and create the database
CREATE DATABASE crm_db;
```

Or run the full schema:
```bash
psql -U postgres -f crm-backend/schema.sql
```

> **Note:** JPA `ddl-auto=update` will auto-create tables on first startup, so the schema file is optional.

### 2. Backend

```bash
cd crm-backend

# Set environment variables (optional, defaults to postgres/postgres)
set DB_USERNAME=postgres
set DB_PASSWORD=postgres

# Run with Maven wrapper
mvnw.cmd spring-boot:run
```

Backend starts at **http://localhost:8080**

- Swagger UI: **http://localhost:8080/swagger-ui.html**
- API Docs: **http://localhost:8080/v3/api-docs**

### 3. Frontend

```bash
cd crm-frontend

# Install dependencies (already done if cloned)
npm install

# Start dev server
npm run dev
```

Frontend starts at **http://localhost:3000**

---

## 🔐 Environment Variables

### Backend (`crm-backend/application.properties`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/crm_db` | Database URL |
| `app.jwt.secret` | *(base64-encoded key)* | JWT signing secret |
| `app.jwt.expiration-ms` | `86400000` (24h) | Token expiration |

### Frontend (`crm-frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API URL |

---

## 📡 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT |

### Customers (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers?page=0&size=10` | List with pagination |
| GET | `/customers/{id}` | Get by ID |
| GET | `/customers/search?name=John` | Search by name |
| POST | `/customers` | Create |
| PUT | `/customers/{id}` | Update |
| DELETE | `/customers/{id}` | Delete |

### Leads (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads?status=NEW` | List, optional filter |
| POST | `/leads` | Create |
| PUT | `/leads/{id}` | Update |
| DELETE | `/leads/{id}` | Delete |
| POST | `/leads/{id}/convert` | Convert to customer |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all |
| POST | `/tasks` | Create |
| PUT | `/tasks/{id}` | Update |
| DELETE | `/tasks/{id}` | Delete |

### Activities (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/activities` | Log activity |
| GET | `/activities/customer/{id}` | By customer |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard stats |

---

## 📨 Example API Requests

### Register
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin User", "email": "admin@crm.com", "password": "password123", "role": "ADMIN"}'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@crm.com", "password": "password123"}'
```

### Create Customer (with JWT)
```bash
curl -X POST http://localhost:8080/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Acme Corp", "email": "contact@acme.com", "phone": "+1234567890", "company": "Acme", "status": "ACTIVE"}'
```

### Create Lead
```bash
curl -X POST http://localhost:8080/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "John Doe", "email": "john@example.com", "source": "Website", "status": "NEW"}'
```

### Log Activity
```bash
curl -X POST http://localhost:8080/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type": "CALL", "notes": "Discussed pricing", "customerId": 1}'
```

---

## 🗃️ Project Structure

```
Java/
├── crm-backend/                   # Spring Boot Backend
│   ├── pom.xml
│   ├── schema.sql                 # PostgreSQL DDL
│   └── src/main/java/com/crm/
│       ├── CrmApplication.java
│       ├── controller/            # REST Controllers
│       ├── service/               # Business Logic
│       ├── repository/            # JPA Repositories
│       ├── entity/                # JPA Entities
│       ├── dto/                   # Data Transfer Objects
│       ├── security/              # JWT + Spring Security
│       ├── config/                # Swagger Config
│       └── exception/             # Global Error Handling
│
└── crm-frontend/                  # Next.js Frontend
    └── src/
        ├── app/                   # Pages (App Router)
        │   ├── login/
        │   ├── register/
        │   ├── dashboard/
        │   ├── customers/
        │   ├── leads/
        │   ├── tasks/
        │   └── activities/
        ├── components/            # Shared Components
        ├── context/               # Auth Context
        └── services/              # API Service
```

---

## 👤 Roles

| Role | Capabilities |
|------|-------------|
| **ADMIN** | Manage users, view all data |
| **SALES** | Manage assigned leads/customers, create tasks & activities |
