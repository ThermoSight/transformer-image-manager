# Transformer Manager — Backend (Spring Boot)

Spring Boot REST API for managing transformer records and their thermal images.  
Auth is JWT‑based; data is stored in PostgreSQL; files are stored on disk.

> **Note:** The folder name is intentionally `transformer-manager-backkend` . Keep paths consistent unless you plan to rename the module.

---

##  Setup

### 1) Prerequisites
- **Java 17+** ([Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java17) | [Download Eclipse Temurin JDK](https://adoptium.net/temurin/releases/?version=17))
- **Maven 3.9+** ([Download Apache Maven](https://maven.apache.org/download.cgi))
- **PostgreSQL 14+** (or newer) ([Download PostgreSQL](https://www.postgresql.org/download/))

> **Note:** Add Java and Maven into environment user variables and set the paths correctly.

### 2) Database (PostgreSQL)

Create a dedicated user and database (recommended):

```sql
-- Run as postgres superuser (e.g., via pgAdmin)
CREATE USER postgres WITH PASSWORD 'add_your_pw';
CREATE DATABASE transformer_db OWNER postgres;
````

### 3) Configuration

Default configuration lives in `src/main/resources/application.properties`:
Here, all the admins and there passwords are available.

```properties
spring.application.name=transformer-manager-backkend

spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db1
spring.datasource.username=postgres
spring.datasource.password=add_your_pw
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
# Dialect is auto-selected by Hibernate 6; no need to set it explicitly.

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
upload.directory=./uploads

# Initialize admin users on startup
admin.init.enabled=true
admin.init.users[0].username=admin1
admin.init.users[0].password=admin1pass
admin.init.users[0].displayName=Admin One
admin.init.users[1].username=admin2
admin.init.users[1].password=admin2pass
admin.init.users[1].displayName=Admin Two
admin.init.users[2].username=admin3
admin.init.users[2].password=admin3pass
admin.init.users[2].displayName=Admin Three
admin.init.users[3].username=admin4
admin.init.users[3].password=admin4pass
admin.init.users[3].displayName=Admin Four
```


### 4) Run

```bash
# From transformer-manager-backkend/
mvn spring-boot:run
# Default: http://localhost:8080
```

Change port if 8080 is busy:


### 5) Run TransformerManagerBackkendApplication.java file 

In the path
>  C:\Users\admin\Desktop\Web-Basic\phase_1_test4\transformer-image-manager\transformer-manager-backkend\src\main\java\com\example\transformer_manager_backkend\TransformerManagerBackkendApplication.java)


## Implemented Backend Features
1. Core Application Setup

    - Spring Boot Application (TransformerManagerBackkendApplication.java) - Main entry point

    - Maven Project Structure with proper packaging and dependencies

    - Maven Wrapper (mvnw, mvnw.cmd) for consistent builds

2. Layered Architecture Implementation

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

3. Database Connection & Configuration

PostgreSQL Connection is established through:

- JDBC URL Configuration in application.properties
- JPA/Hibernate Integration for object-relational mapping:
- Connection Pooling via HikariCP (default in Spring Boot 3)
- Automatic Schema Management - Hibernate automatically creates/updates tables based on Entity classes

4. REST API Endpoints

   - CRUD Operations for managing transformer records

   - JWT-protected Routes with proper authentication

   - JSON Request/Response handling with Spring MVC

5. Security & Authentication

   - JWT-based Authentication with token validation

   - Password Encryption using BCrypt encoding

   - Role-based Authorization for protected endpoints

6. Application Configuration

   - Externalized Configuration via application.properties

   - Environment-specific settings support

   - Custom Configuration classes in config/ package

7. Build & Deployment Ready

   - Maven Build System with pom.xml configuration

   - Executable JAR packaging for easy deployment

   - Test Infrastructure setup (test/ directory)

Technical Stack Implemented:

    Java 17+ with Spring Boot 3.x framework

    Spring Data JPA with Hibernate ORM

    PostgreSQL Database with JDBC connectivity

    JWT Authentication with Spring Security

    Maven for dependency management

    RESTful Web Services with JSON serialization

---
## ⚠️ Known Limitations / Issues

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

---

## 🗂️ Project Structure

```
transformer-manager-backkend/
├── .mvn/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── transformer_manager_backkend/
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── entity/
│   │   │               ├── repository/
│   │   │               ├── service/
│   │   │               └── TransformerManagerBackkendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── target/
├── .gitattributes
├── .gitignore
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---



