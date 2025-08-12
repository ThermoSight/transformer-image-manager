import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Card, Alert, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";

const ImageUpload = ({ onUpload }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      setError("Please provide both name and image");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8080/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Image uploaded successfully!");
      setName("");
      setFile(null);
      setPreview(null);
      if (onUpload) onUpload();
    } catch (err) {
      setError(
        "Failed to upload image: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">
          <FontAwesomeIcon icon={faImage} className="me-2" />
          Upload New Image
        </Card.Title>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter image name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </Form.Group>

          {preview && (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}

          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Uploading...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Upload
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ImageUpload;
