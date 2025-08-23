# Transformer Manager — Backend (Spring Boot)

Spring Boot REST API for managing transformer records and their thermal images.  
Auth is JWT‑based; data is stored in PostgreSQL; files are stored on disk.

> **Note:** The folder name is intentionally `transformer-manager-backkend` (has a double “kk”). Keep paths consistent unless you plan to rename the module.

---

## 🚀 Quick Start

### 1) Prerequisites
- **Java 17+** ([Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java17) | [Download Eclipse Temurin JDK](https://adoptium.net/temurin/releases/?version=17))
- **Maven 3.9+** ([Download Apache Maven](https://maven.apache.org/download.cgi))
- **PostgreSQL 14+** (or newer) ([Download PostgreSQL](https://www.postgresql.org/download/))

### 2) Database (PostgreSQL)

Create a dedicated user and database (recommended):

```sql
-- Run as postgres superuser (e.g., via psql or pgAdmin)
CREATE USER transformer_user WITH PASSWORD 'ChangeMe_Strong!123';
CREATE DATABASE transformer_db1 OWNER transformer_user;

-- (Optional) If schema already exists and you need grants:
-- \c transformer_db1
-- GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO transformer_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO transformer_user;
````

### 3) Configuration

Default configuration lives in `src/main/resources/application.properties`:

```properties
spring.application.name=transformer-manager-backkend

spring.datasource.url=jdbc:postgresql://localhost:5432/transformer_db1
spring.datasource.username=transformer_user
spring.datasource.password=ChangeMe_Strong!123
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

**Prefer env vars** (no secrets in git):

```bash
# PowerShell
$env:DB_URL="jdbc:postgresql://localhost:5432/transformer_db1"
$env:DB_USER="transformer_user"
$env:DB_PASSWORD="ChangeMe_Strong!123"
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.url=$env:DB_URL --spring.datasource.username=$env:DB_USER --spring.datasource.password=$env:DB_PASSWORD"
```

### 4) Run

```bash
# From transformer-manager-backkend/
mvn spring-boot:run
# Default: http://localhost:8080
```

Change port if 8080 is busy:

```properties
# application.properties
server.port=8081
```

Or:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### 5) Build a JAR

```bash
mvn clean package
java -jar target/*-SNAPSHOT.jar
```

---

## ✅ Implemented Features

* **Authentication & Authorization**

  * JWT login, Spring Security configuration
  * Startup seeding of admin users (configurable via `admin.init.*`)

* **Transformer Records**

  * CRUD for transformer metadata (ID, location, capacity, etc.)
  * Service + Repository layers using Spring Data JPA

* **Image Uploads**

  * Upload thermal images for a transformer
  * Files saved under `./uploads` (configurable via `upload.directory`)
  * 5 MB default file size limit

* **Developer‑friendly Defaults**

  * `ddl-auto=update` for schema evolution in dev
  * SQL logging enabled in dev
  * HikariCP connection pool

---

## 🔌 API (high‑level)

> Exact paths may vary slightly with your controllers; typical pattern:

* `POST /api/auth/login` → returns JWT
* `GET /api/transformers` → list records
* `POST /api/transformers` → create record
* `GET /api/transformers/{id}` → get details
* `PUT /api/transformers/{id}` → update
* `DELETE /api/transformers/{id}` → delete
* `POST /api/transformers/{id}/images` → upload image

Add `Authorization: Bearer <token>` header for protected routes.

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
  ├─ pom.xml
  ├─ src/
  │  ├─ main/
  │  │  ├─ java/com/example/transformer_manager_backkend/
  │  │  │  ├─ TransformerManagerBackkendApplication.java
  │  │  │  ├─ config/           # Security, JWT, WebMvc config
  │  │  │  ├─ controller/       # REST controllers
  │  │  │  ├─ entity/           # JPA entities
  │  │  │  ├─ repository/       # Spring Data repositories
  │  │  │  └─ service/          # Business logic
  │  │  └─ resources/
  │  │     └─ application.properties
  │  └─ test/
  └─ uploads/                    # runtime: uploaded images
```

---

## 🧪 Troubleshooting

* **`FATAL: password authentication failed for user`**
  Verify DB creds/role and connectivity; try logging in with `psql -U <user> -h localhost`.

* **`Web server failed to start. Port 8080 was already in use.`**
  Kill the process using 8080 or change `server.port`.

* **Hibernate dialect warning**
  With Hibernate 6, PostgreSQL dialect is auto‑detected; you can remove the explicit setting.

---

## 📄 License

Internal/educational use. Add your preferred license here.

```

Want me to drop this file into your ZIP and give you back a ready‑to‑download archive?
```
