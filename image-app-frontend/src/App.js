import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageUpload from "./components/ImageUpload";
import ImageList from "./components/ImageList";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">
        <span className="text-primary">Image</span> Gallery App
      </h1>
      <ImageUpload onUpload={handleUpload} />
      <ImageList key={refresh} />
    </Container>
  );
}

export default App;
