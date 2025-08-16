import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import ImageSetUpload from "./components/ImageSetUpload";
import ImageSetList from "./components/ImageSetList";
import ImageSetDetail from "./components/ImageSetDetail";
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
                  <ImageSetList key={refresh} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <ImageSetUpload onUpload={handleUpload} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sets/:id"
              element={
                <ProtectedRoute>
                  <ImageSetDetail />
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
