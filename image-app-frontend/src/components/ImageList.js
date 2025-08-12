import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Modal,
  Alert,
  Spinner,
  Row,
  Col,
  Image as BootstrapImage,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Normalize file paths to use forward slashes
  const normalizePath = (path) => {
    return path.replace(/\\/g, "/");
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/images");
      // Normalize all paths in response
      const normalizedImages = response.data.map((img) => ({
        ...img,
        filePath: normalizePath(img.filePath),
      }));
      setImages(normalizedImages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch images: " + err.message);
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setCurrentImage(image);
    setEditName(image.name);
    setEditFile(null);
    setPreviewImage(normalizePath(image.filePath));
    setShowEditModal(true);
  };

  const handlePreview = (image) => {
    setCurrentImage(image);
    setShowPreviewModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      if (editName !== currentImage.name) {
        formData.append("name", editName);
      }
      if (editFile) {
        formData.append("file", editFile);
      }

      const response = await axios.put(
        `http://localhost:8080/api/images/${currentImage.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Normalize the updated image path and add cache buster
      const updatedImage = {
        ...response.data,
        filePath: `${normalizePath(response.data.filePath)}?t=${Date.now()}`,
      };

      setImages(
        images.map((img) => (img.id === currentImage.id ? updatedImage : img))
      );
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update image: " + err.message);
    }
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="image-gallery">
      <h2 className="mb-4">Uploaded Images</h2>

      {images.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p className="text-muted">No images uploaded yet.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {images.map((image) => (
            <Col key={image.id}>
              <Card className="h-100 shadow-sm">
                <div
                  className="img-container position-relative"
                  onClick={() => handlePreview(image)}
                >
                  {loadedImages[image.id] ? null : (
                    <div className="img-placeholder d-flex justify-content-center align-items-center">
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  )}
                  <BootstrapImage
                    src={`http://localhost:8080${image.filePath}`}
                    alt={image.name}
                    fluid
                    thumbnail
                    onLoad={() =>
                      setLoadedImages((prev) => ({ ...prev, [image.id]: true }))
                    }
                    style={{
                      opacity: loadedImages[image.id] ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      cursor: "pointer",
                      objectFit: "cover",
                      height: "200px",
                      width: "100%",
                    }}
                    key={image.filePath} // Force re-render when path changes
                  />
                  <div className="img-overlay">
                    <FontAwesomeIcon icon={faExpand} className="zoom-icon" />
                  </div>
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title className="mb-1">{image.name}</Card.Title>
                      <Card.Text className="text-muted small">
                        {formatDate(image.uploadTime)}
                      </Card.Text>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(image);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Image Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Change Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
            {previewImage && (
              <div className="text-center mt-3">
                <BootstrapImage
                  src={
                    previewImage.startsWith("data:")
                      ? previewImage
                      : `http://localhost:8080${normalizePath(previewImage)}`
                  }
                  alt="Preview"
                  fluid
                  style={{ maxHeight: "400px" }}
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentImage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {currentImage && (
            <BootstrapImage
              src={`http://localhost:8080${normalizePath(
                currentImage.filePath
              )}`}
              alt={currentImage.name}
              fluid
              style={{ maxHeight: "70vh" }}
            />
          )}
          <div className="mt-3 text-muted">
            Uploaded: {currentImage && formatDate(currentImage.uploadTime)}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImageList;
