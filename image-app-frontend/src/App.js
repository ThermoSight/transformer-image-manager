import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import ImageSetUpload from "./components/ImageSetUpload";
import ImageSetList from "./components/ImageSetList";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container className="py-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <h1 className="mb-4 text-center">
                      <span className="text-primary">Image</span> Gallery App
                    </h1>
                    <ImageSetUpload onUpload={handleUpload} />
                    <ImageSetList key={refresh} />
                  </>
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
