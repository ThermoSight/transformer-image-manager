# ThermoSight – Transformer Thermal Inspection

ThermoSight is a web platform for managing transformer thermal inspections. It helps utilities move beyond manual, error-prone image checks by providing:

- Transformer records (ID, location, capacity)
- Upload & management of baseline/maintenance thermal images
- Image tagging by environmental conditions (sunny, cloudy, rainy)

## Future Plans

- Automated anomaly detection with computer vision
- Manual validation & correction of results
- Digital maintenance record generation

---

## Overview

ThermoSight is a full-stack web application with a **React frontend** and **Spring Boot backend** using **PostgreSQL**.

- **Frontend:** React
- **Backend:** Spring Boot handles business logic and APIs
- **Database:** PostgreSQL stores system data

---

## Backend Setup (Spring Boot)

### 1. Prerequisites

- Java 17+ ([Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java17)
- Maven 3.9+ ([Download Apache Maven](https://maven.apache.org/download.cgi))
- PostgreSQL 14+ ([Download PostgreSQL](https://www.postgresql.org/download/))

### 2. Database Setup

- Import the provided `transformer_db.sql` file into PostgreSQL
- This will create the database schema and populate it with initial data including pre-uploaded images

### 3. Configuration

- Update the database connection settings in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db
spring.datasource.username=postgres
spring.datasource.password=your_password_here
```

### 4. Run Application

Run TransformerManagerBackkendApplication.java in:

```java
transformer-manager-backkend\src\main\java\com\example\transformer_manager_backkend\TransformerManagerBackkendApplication.java
```

> **Note:** If port **8080** is already in use, free it before running the backend.
>
> ```bash
> netstat -ano | findstr :8080
> taskkill /PID <pid> /F
> ```

---

## Frontend Setup (React)

### 1. Prerequisites

- Node.js 18+ ([Download Node.js](https://nodejs.org/en/download/))
- npm (comes with Node.js)

### 2. Install Dependencies

- First, navigate to the frontend project folder:

```bash
cd transformer-manager-frontend
```

- Then, run the following command to install the necessary dependencies:

```bash
npm install
```

### 3. Configuration

- Update the API base URL in src/axiosConfig.js if needed:

```javascript
baseURL: "http://localhost:8080/api";
```

### 4. Run Development Server

```bash
npm start
```

The application will open at: **http://localhost:3000**

---

## Implemented Features

- **Transformers and Images CRUD** (Spring Boot REST APIs with JPA)
- **Pre-populated data** including five transformers with baseline images and uploaded images in the uploads folder

### Webpages

- **Admin page**
- **Transformer page** (shows transformer records)
- **Image management page** (baseline and maintenance images linked to transformers)

### Creating

- **Transformers:** Through the Transformer page, _Add New Transformer_ (ID, location, capacity)
- **Inspections:** Through the Transformer or from the Inspection page _Add New Inspection_

### Updating

- Each transformer record can be updated (details and baseline images)
- Baseline/maintenance images can be added or removed for a transformer

### Deleting

- Deleting a transformer will delete all its associated images
- Deleting an image will remove it from the transformer's record

### Search / Filters

- **Transformers:** by ID / location / capacity
- **Images:** filter by transformer and environmental condition (sunny, cloudy, rainy)

### Validation

- Adding/Editing images requires the transformer to exist
- Baseline images must be categorized by environmental condition

## Additional Features

### Frontend

- **Authentication & Security:** JWT-based login with global Auth Context and protected routes
- **HTTP Client:** Axios setup with automatic token attachment and error handling
- **Component Architecture:** Modular components, custom hooks, and CSS styling for reusable UI

### Backend

- **Core Setup:** Spring Boot entry point, Maven structure, and Wrapper
- **Architecture:** Clean layered design — `config`, `controller`, `entity`, `repository`, `service`
- **Database:** PostgreSQL with JPA/Hibernate, HikariCP, auto schema generation
- **Security:** JWT authentication, BCrypt password hashing, role-based access control
- **Config & Deployment:** Properties, profiles, custom configs, Maven build, JAR packaging, tests

---

## Limitations

- **Local Development Environment:** The application is currently running entirely in a local development environment
- **Frontend Deployment:** The React frontend is not deployed to a production server
- **Backend Deployment:** The Spring Boot backend is running locally and not deployed to a server
- **Database Deployment:** The PostgreSQL database is running locally and not deployed to a cloud database service
- **File Storage:** Images are stored locally in the uploads folder rather than cloud storage

### Frontend

- **CORS Configuration:** Backend must allow `http://localhost:3000`
- **Environment Variables:** API URLs must be configured for production
- **Error Handling:** Comprehensive error handling not yet implemented
- **Loading States:** Loading indicators still needed for better UX

### Backend

- **Secrets in Config:** Example credentials in `application.properties`; should use environment variables or a secrets manager in production
- **Open-in-View:** Enabled by default; consider disabling for production to avoid lazy-load issues during view rendering
- **Local File Storage:** Images stored on local disk; for production use S3/GCS/Azure Blob with signed URLs + CDN
