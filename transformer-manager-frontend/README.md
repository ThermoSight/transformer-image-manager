
# Transformer Manager — Frontend (React)

React frontend for the Transformer Thermal Inspection System. Provides a user interface for managing transformer records and thermal images, connecting to the Spring Boot backend.

---

## Setup

### Prerequisites
- **Node.js 18+** ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
Update the API base URL in `src/axiosConfig.js` if needed:
```javascript
baseURL: 'http://localhost:8080/api' // Default Spring Boot port
```

### 3. Run Development Server
```bash
npm start
```
Application opens at `http://localhost:3000`

---

##  Project Structure

```
transformer-manager-frontend/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable React components
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   ├── AuthContext.js     # Authentication context provider
│   ├── axiosConfig.js     # HTTP client configuration
│   ├── index.js           # Application entry point
│   ├── Login.js           # Login component
│   ├── ProtectedRoute.js  # Route protection component
│   └── useDocumentTitle.js # Custom hook
├── package.json
└── README.md
```

---

##  Implemented Features

### **Authentication & Security**
- **JWT-based Login** (`Login.js`) - User authentication
- **Auth Context** (`AuthContext.js`) - Global state management
- **Protected Routes** (`ProtectedRoute.js`) - Route guarding

### **HTTP Client Configuration**
- **Axios Configuration** (`axiosConfig.js`) - API setup
- **Automatic Token Attachment** - Adds JWT to requests
- **Error Handling** - API error management

### **Component Architecture**
- **Modular Components** (`components/` folder) - Reusable UI
- **Custom Hooks** (`useDocumentTitle.js`) - Functionality reuse
- **CSS Styling** (`App.css`) - Component styling

---

## API Integration

Connects to backend endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/transformers` - Fetch transformers
- `POST /api/transformers` - Create transformer
- `PUT /api/transformers/{id}` - Update transformer
- `DELETE /api/transformers/{id}` - Delete transformer
- `POST /api/transformers/{id}/images` - Upload images

---

## Technical Stack

- **React 18** - Frontend framework
- **React Context API** - State management
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design
- **Create React App** - Build toolchain



---

## ⚠️ Known Limitations

- **CORS Configuration** - Ensure backend allows `http://localhost:3000`
- **Environment Variables** - API URLs need configuration for production
- **Error Handling** - Comprehensive error handling to be implemented
- **Loading States** - Loading indicators needed for better UX

---

##  Next Steps

- Implement transformer list and detail views
- Create forms for adding/editing transformers
- Build image upload interface
- Add responsive navigation menu
- Implement logout functionality

---
