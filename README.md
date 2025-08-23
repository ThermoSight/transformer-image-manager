# transformer-image-manager

---

## To Do

- Phase 1 completed.

---

# Project Setup Guide

## After Cloning the Repository

---

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
