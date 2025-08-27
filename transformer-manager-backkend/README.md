# Transformer Manager — Backend (Spring Boot)

Spring Boot REST API for managing transformer records and their thermal images.  
Auth is JWT‑based; data is stored in PostgreSQL; files are stored on disk.


---

## Backend Setup (Spring Boot)

### 1. Prerequisites
- Java 17+  ([Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java17)
- Maven 3.9+ ([Download Apache Maven](https://maven.apache.org/download.cgi))    
- PostgreSQL 14+ ([Download PostgreSQL](https://www.postgresql.org/download/))   

### 2. Create Database in postgres (PostgreSQL)
```sql
CREATE USER postgres
PASSWORD 'add_your_pw';
CREATE DATABASE transformer_db
OWNER postgres;
```
### 3. Configuration
- In that file, change the following codes according to the database, username and password you created in Postgres:
-- Edit src/main/resources/application.properties:
```bash
  spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db
  spring.datasource.username=postgres
  spring.datasource.password=add_your_pw
```
### 4.Run Application

Run TransformerManagerBackkendApplication.java in:
```sq1
transformer_manager_backkend/TransformerManagerBackkendApplication.java
```

> **Note:** If port **8080** is already in use, free it before running the backend.  
> ```bash
> netstat -ano | findstr :8080
> taskkill /PID <pid> /F
> ```

---
## Implemented Backend Features
### 1. Core Application Setup

    - Spring Boot Application (TransformerManagerBackkendApplication.java) - Main entry point

    - Maven Project Structure with proper packaging and dependencies

    - Maven Wrapper (mvnw, mvnw.cmd) for consistent builds

### 2. Layered Architecture Implementation

The backend follows a clean, modular architecture with these packages:

    config/ - Configuration classes for application setup

        SecurityConfig.java - Configures JWT authentication and API security

        WebConfig.java - Sets up CORS, MVC configuration, and other web settings

        JwtFilter.java - Custom filter for JWT token validation

    controller/ - REST API endpoints (HTTP layer)

        AuthController.java - Handles user login and JWT token generation

        TransformerController.java - Manages CRUD operations for transformers (GET, POST, PUT, DELETE)

        ImageController.java - Handles thermal image upload and retrieval

    entity/ - JPA entities (database model)

        User.java - Represents admin users with username, password, and roles

        Transformer.java - Model for transformer data (ID, location, capacity, timestamps)

        ThermalImage.java - Model for image metadata (filename, path, type, environmental condition)

    repository/ - Data access layer (Spring Data JPA)

        UserRepository.java - CRUD operations for User entities

        TransformerRepository.java - Custom queries and operations for Transformer entities

        ThermalImageRepository.java - Image-related database operations

    service/ - Business logic layer

        UserService.java - Handles user authentication and management

        TransformerService.java - Contains business logic for transformer operations

        ImageService.java - Manages image processing and file storage logic

### 3. Database Connection & Configuration

PostgreSQL Connection is established through:

- JDBC URL Configuration in application.properties
- JPA/Hibernate Integration for object-relational mapping:
- Connection Pooling via HikariCP (default in Spring Boot 3)
- Automatic Schema Management - Hibernate automatically creates/updates tables based on Entity classes


### 4. Security & Authentication

   - JWT-based Authentication with token validation
   - Password Encryption using BCrypt encoding
   - Role-based Authorization for protected endpoints

### 5. Application Configuration

   - Externalized Configuration via application.properties
   - Environment-specific settings support
   - Custom Configuration classes in config/ package

### 6. Build & Deployment Ready

   - Maven Build System with pom.xml configuration
   - Executable JAR packaging for easy deployment
   - Test Infrastructure setup (test/ directory)

---
## Known Limitations / Issues

* **Port conflicts**
  If `8080` is in use, set `server.port` or free the port:

  ```powershell
  netstat -ano | findstr :8080
  taskkill /PID <pid> /F
  ```

* **Secrets in config**
  The sample `application.properties` includes example credentials for convenience.
  Use **environment variables** or a secrets manager in real deployments.

* **Open‑in‑view**
  Spring’s `open-in-view` is enabled by default; consider disabling for production to avoid lazy‑load during view rendering.

* **Local file storage**
  Images are stored on local disk; for production, prefer S3/GCS/Azure Blob with signed URLs and a CDN.


