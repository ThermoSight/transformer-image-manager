# transformer-image-manager

---

## To Do

- [ ] Allow uploading **multiple baseline images** (currently limited to only one).
- [ ] Implement image editing by **replacing existing images** and adding **new image upload** functionality.
- [ ] Add Admin ID capability to manage access or permissions (e.g., restrict certain features to admin users).

---

# Project Setup Guide

## After Cloning the Repository

---

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:

```bash
cd demo
```

2. Open `src/main/resources/application.properties`.

3. Update the PostgreSQL password property:

```properties
spring.datasource.password=your_real_password_here
```

4. Run the backend application:

- Using your IDE, run the `DemoApplication.java` file located at:

```
demo/src/main/java/com/example/imageapp/DemoApplication.java
```

---

### Frontend Setup (React)

1. Open a new terminal window/tab.

2. Navigate to the frontend directory:

```bash
cd image-app-frontend
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

| Component | Location             | Start Command                  |
| --------- | -------------------- | ------------------------------ |
| Backend   | `demo`               | Run `DemoApplication.java` or  |
| Frontend  | `image-app-frontend` | `npm install` then `npm start` |

---
