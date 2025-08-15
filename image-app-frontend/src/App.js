import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageSetUpload from "./components/ImageSetUpload";
import ImageSetList from "./components/ImageSetList";
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
      <ImageSetUpload onUpload={handleUpload} />
      <ImageSetList key={refresh} />
    </Container>
  );
}

export default App;
