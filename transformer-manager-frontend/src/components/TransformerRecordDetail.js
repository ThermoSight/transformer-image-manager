import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Tab,
  Tabs,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faUser,
  faCalendar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const TransformerRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [transformerRecord, setTransformerRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchTransformerRecord = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/transformer-records/${id}`,
          isAuthenticated
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}
        );
        setTransformerRecord(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch transformer record details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransformerRecord();
  }, [id, token]);

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/transformer-records/images/${imageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh the transformer record data
      const response = await axios.get(
        `http://localhost:8080/api/transformer-records/${id}`
      );
      setTransformerRecord(response.data);
    } catch (err) {
      setError("Failed to delete image");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading transformer record details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  if (!transformerRecord) {
    return (
      <Alert variant="warning" className="mt-4">
        Transformer record not found
      </Alert>
    );
  }

  return (
    <div className="moodle-container">
      <Button
        variant="outline-secondary"
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to Dashboard
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2>{transformerRecord.name}</h2>
              <div className="text-muted mb-3">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Uploaded by:{" "}
                {transformerRecord.uploadedBy?.displayName || "Unknown"}
              </div>
              <div className="text-muted">
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Created:{" "}
                {new Date(transformerRecord.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <Badge bg="info" className="fs-6">
                {transformerRecord.images?.length || 0} Images
              </Badge>
            </div>
          </div>

          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>Details</Card.Header>
                <Card.Body>
                  <p>
                    <strong>Location:</strong>{" "}
                    {transformerRecord.locationName || "Not specified"}
                  </p>
                  <p>
                    <strong>Capacity:</strong>{" "}
                    {transformerRecord.capacity || "Not specified"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              {transformerRecord.locationLat &&
              transformerRecord.locationLng ? (
                <Card>
                  <Card.Header>Location Map</Card.Header>
                  <Card.Body style={{ height: "200px" }}>
                    <MapContainer
                      center={[
                        parseFloat(transformerRecord.locationLat),
                        parseFloat(transformerRecord.locationLng),
                      ]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[
                          parseFloat(transformerRecord.locationLat),
                          parseFloat(transformerRecord.locationLng),
                        ]}
                      >
                        <Popup>
                          {transformerRecord.locationName ||
                            "Transformer Record Location"}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Header>Location</Card.Header>
                  <Card.Body className="text-muted">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    No location specified
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <Tabs defaultActiveKey="images" className="mb-3">
            <Tab eventKey="images" title="Images">
              {transformerRecord.images &&
              transformerRecord.images.length > 0 ? (
                <Row className="g-3 mt-2">
                  {transformerRecord.images.map((image) => (
                    <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
                      <Card>
                        <div style={{ position: "relative" }}>
                          <Image
                            src={`http://localhost:8080${image.filePath}`}
                            alt={image.type}
                            fluid
                            style={{
                              height: "180px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setPreviewImage(
                                `http://localhost:8080${image.filePath}`
                              );
                              setShowPreview(true);
                            }}
                          />
                        </div>
                        <Card.Body>
                          <strong>Type:</strong> {image.type}
                          {image.type === "Baseline" &&
                            image.weatherCondition && (
                              <div>
                                <strong>Weather:</strong>{" "}
                                {image.weatherCondition}
                              </div>
                            )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info" className="mt-3">
                  No images in this transformer record
                </Alert>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Delete Image Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Image Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteImage(imageToDelete)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransformerRecordDetail;
