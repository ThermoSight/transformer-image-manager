Here is the clean, copy-paste ready code for your GitHub README section:

```markdown
# Transformer Manager Backend

Spring Boot REST API backend for managing transformer records and thermal images. Built for the EN3350 Software Design Competition.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- PostgreSQL 14+

### 1. Database Setup
```sql
CREATE DATABASE transformer_db;
CREATE USER transformer_user WITH PASSWORD 'securepassword123';
GRANT ALL PRIVILEGES ON DATABASE transformer_db TO transformer_user;
```

### 2. Configuration
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db
spring.datasource.username=transformer_user
spring.datasource.password=securepassword123
```

### 3. Run the Application
```bash
mvn spring-boot:run
```
Server starts at `http://localhost:8080`

## 📁 Project Structure
```
backend/
├── src/
│   └── main/
│       ├── java/com/example/
│       │   ├── controller/     # REST APIs
│       │   ├── entity/         # JPA Entities
│       │   ├── repository/     # Data access layer
│       │   └── service/        # Business logic
│       └── resources/
│           └── application.properties
└── pom.xml
```

## 🔌 API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/transformers` - List all transformers
- `POST /api/transformers` - Create new transformer
- `POST /api/transformers/{id}/images` - Upload thermal image

## ⚙️ Features
- JWT Authentication
- PostgreSQL database
- Image file upload
- RESTful APIs
- Spring Security

## 📝 Notes
- Default admin users are created on first run
- Images are stored in `./uploads` directory
- Configure database credentials in `application.properties`

---

**University of Moratuwa** - EN3350 Software Design Competition
```
