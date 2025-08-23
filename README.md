# transformer-image-manager

---

## To Do

- Phase 1 completed.

---

# Project Setup Guide

## After Cloning the Repository

---
# Transformer Thermal Inspection System

A full-stack web application for automating thermal inspection workflows of distribution transformers. Built for the EN3350 Software Design Competition.

## 🚀 Quick Start

### Prerequisites
- **Java 17+** ([Download](https://adoptium.net/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))

---

##  Backend Setup (Spring Boot)

### 1. Database Setup
```sql
CREATE DATABASE transformer_db;
CREATE USER transformer_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE transformer_db TO transformer_user;
```
2. Configuration

Edit transformer-manager-backkend/src/main/resources/application.properties:
properties
```sql
spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db
spring.datasource.username=transformer_user
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
upload.directory=./uploads
```
3. Run Backend
bash
```sql
cd transformer-manager-backkend
mvn spring-boot:run
```
Backend starts at: http://localhost:8080

## Frontend Setup (React)
1. Install Dependencies

```sql
cd transformer-manager-frontend
npm install
```

2. Configure API URL
```sql
Edit src/axiosConfig.js:
javascript
```
baseURL: 'http://localhost:8080/api'

3. Run Frontend
```sql
npm start
```
Frontend starts at: http://localhost:3000

## Project Structure


transformer-image-manager/
├── transformer-manager-backkend/    # Spring Boot API
│   ├── config/          # Security & JWT configuration
│   ├── controller/      # REST API endpoints
│   ├── entity/          # Database models
│   ├── repository/      # Data access layer
│   └── service/         # Business logic
└── transformer-manager-frontend/    # React app
    ├── components/      # UI components
    ├── AuthContext.js   # Authentication management
    └── axiosConfig.js   # API configuration

## Implemented Features
(Backend)

    JWT authentication with Spring Security

    PostgreSQL database integration

    RESTful APIs for transformer management

    Image upload functionality

    Automatic admin user creation

(Frontend)

    Login system with JWT tokens

    Protected routes and authentication

    API integration with Axios

    Responsive user interface

 API Endpoints

    POST /api/auth/login - User login

    GET /api/transformers - List transformers

    POST /api/transformers - Create transformer

    POST /api/transformers/{id}/images - Upload images

⚠ Important Notes

    Backend runs on port 8080, frontend on port 3000

    Ensure PostgreSQL is running before starting backend

    Default admin users are created automatically

    Check CORS configuration if connection issues occur



----
### Backend Setup (Spring Boot)

1. Navigate to the backend directory:

```bash
cd transformer-manager-backkend
```

2. Open `src/main/resources/application.properties`.

3. Update the PostgreSQL password property:

```properties
spring.datasource.password=your_real_password_here
```

4. Run the backend application:

- Using your IDE, run the `TransformerManagerBackkendApplication.java` file located at:

```
transformer-manager-backkend/src/main/java/com/example/transformer_manager_backkend/TransformerManagerBackkendApplication.java
```

---

### Frontend Setup (React)

1. Open a new terminal window/tab.

2. Navigate to the frontend directory:

```bash
cd transformer-manager-frontend
```

3. Install frontend dependencies:

```bash
npm install
```

4. Start the frontend server:

```bash
npm start
```

---

## Summary

| Component | Location                       | Start Command                                    |
| --------- | ------------------------------ | ------------------------------------------------ |
| Backend   | `transformer-manager-backend`  | Run `TransformerManagerBackkendApplication.java` |
| Frontend  | `transformer-manager-frontend` | `npm install` then `npm start`                   |

---
