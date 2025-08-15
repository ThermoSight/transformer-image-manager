import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const { admin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">Image Gallery</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && <Nav.Link href="/">Home</Nav.Link>}
          </Nav>
          {isAuthenticated && (
            <div className="d-flex align-items-center">
              <span className="me-3">Welcome, {admin.displayName}</span>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
