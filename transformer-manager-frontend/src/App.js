import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import TransformerRecordUpload from "./components/TransformerRecordUpload";
import TransformerRecordList from "./components/TransformerRecordList";
import TransformerRecordDetail from "./components/TransformerRecordDetail";
import ProtectedRoute from "./ProtectedRoute";
import MoodleNavbar from "./components/MoodleNavbar";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <AuthProvider>
      <Router>
        <MoodleNavbar />
        <Container fluid className="main-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TransformerRecordList key={refresh} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <TransformerRecordUpload onUpload={handleUpload} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/:id"
              element={
                <ProtectedRoute>
                  <TransformerRecordDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
