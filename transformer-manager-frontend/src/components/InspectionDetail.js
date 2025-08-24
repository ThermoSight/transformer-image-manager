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
  Image,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faUser,
  faCalendar,
  faTrash,
  faClock,
  faCalendarCheck,
  faUpload, // Add upload icon
  faPlus, // Add plus icon
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [transformerRecord, setTransformerRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchInspectionData();
  }, [id, token]);

  const fetchInspectionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/inspections/${id}`,
        isAuthenticated
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );
      setInspection(response.data);

      // Fetch transformer record separately to get all images
      if (response.data.transformerRecord?.id) {
        const transformerResponse = await axios.get(
          `http://localhost:8080/api/transformer-records/${response.data.transformerRecord.id}`,
          isAuthenticated
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}
        );
        setTransformerRecord(transformerResponse.data);
      }

      setError("");
    } catch (err) {
      setError("Failed to fetch inspection details");
    } finally {
      setLoading(false);
    }
  };

  // Get ALL images from transformer record
  const allImages = transformerRecord?.images || [];

  // Get maintenance images from this inspection
  const maintenanceImages = inspection?.images || [];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("images", selectedFile); // Use "images" instead of "file"

      await axios.post(
        `http://localhost:8080/api/inspections/${id}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Image uploaded successfully!");
      setSelectedFile(null);
      setShowUploadModal(false);
      
      fetchInspectionData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading inspection details...</p>
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

  if (!inspection) {
    return (
      <Alert variant="warning" className="mt-4">
        Inspection not found
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
        Back to Inspections
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2>Inspection #{inspection.id}</h2>
              <div className="text-muted mb-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                <strong>Inspection Date:</strong> {formatDate(inspection.inspectionDate)}
              </div>
              <div className="text-muted mb-3">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Conducted by: {inspection.conductedBy?.displayName || "Unknown"}
              </div>
              <div className="text-muted">
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Record created: {new Date(inspection.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <Badge bg="info" className="fs-6 me-2">
                {allImages.length} Baseline Images
              </Badge>
              <Badge bg="success" className="fs-6 me-2">
                {maintenanceImages.length} Maintenance Images
              </Badge>
              {isAuthenticated && (
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="mt-2"
                >
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Add Maintenance Image
                </Button>
              )}
            </div>
          </div>

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>Transformer Details</Card.Header>
                <Card.Body>
                  <p>
                    <strong>Name:</strong>{" "}
                    {inspection.transformerRecord?.name || "Not specified"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {inspection.transformerRecord?.locationName ||
                      "Not specified"}
                  </p>
                  <p>
                    <strong>Transformer Type:</strong>{" "}
                    {inspection.transformerRecord?.transformerType ||
                      "Not specified"}
                  </p>
                  <p>
                    <strong>Pole No:</strong>{" "}
                    {inspection.transformerRecord?.poleNo || "Not specified"}
                  </p>
                  <p>
                    <strong>Capacity:</strong>{" "}
                    {inspection.transformerRecord?.capacity
                      ? `${inspection.transformerRecord.capacity}kVA`
                      : "Not specified"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>Inspection Details</Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Inspection Date:</strong>
                    <br />
                    {formatDate(inspection.inspectionDate)}
                  </div>
                  <div>
                    <strong>Notes:</strong>
                    <br />
                    {inspection.notes ? (
                      <p className="mt-1">{inspection.notes}</p>
                    ) : (
                      <p className="text-muted mt-1">
                        No notes provided for this inspection.
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            {/* Baseline Images - Left Side */}
            <Col md={6}>
              <h4 className="mb-3 text-center">Baseline Images</h4>
              {allImages.length > 0 ? (
                <Row className="g-3">
                  {allImages.map((image) => (
                    <Col key={image.id} xs={12}>
                      <Card className="h-100">
                        <div style={{ position: "relative" }}>
                          <Image
                            src={`http://localhost:8080${image.filePath}`}
                            alt={image.type}
                            fluid
                            style={{
                              height: "250px",
                              width: "100%",
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
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>Type:</strong> {image.type}
                              {image.weatherCondition && (
                                <div>
                                  <strong>Weather:</strong>{" "}
                                  {image.weatherCondition}
                                </div>
                              )}
                            </div>
                            <div className="text-muted small text-end">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="me-1"
                              />
                              {new Date(
                                image.uploadTime || image.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info" className="text-center">
                  No Baseline images available
                </Alert>
              )}
            </Col>

            {/* Maintenance Images - Right Side */}
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Maintenance Images</h4>

              </div>
              
              {maintenanceImages.length > 0 ? (
                <Row className="g-3">
                  {maintenanceImages.map((image) => (
                    <Col key={image.id} xs={12}>
                      <Card className="h-100">
                        <div style={{ position: "relative" }}>
                          <Image
                            src={`http://localhost:8080${image.filePath}`}
                            alt={image.type}
                            fluid
                            style={{
                              height: "250px",
                              width: "100%",
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
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>Type:</strong> {image.type}
                            </div>
                            <div className="text-muted small text-end">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="me-1"
                              />
                              {new Date(
                                image.uploadTime || image.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info" className="text-center">
                  No Maintenance images available for this inspection
                </Alert>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Maintenance Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Select Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <Form.Text className="text-muted">
                Select a maintenance image to upload
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUploadModal(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Uploading...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Upload Image
              </>
            )}
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

export default InspectionDetail;