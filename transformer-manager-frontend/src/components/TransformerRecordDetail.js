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
  Form
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faUser,
  faCalendar,
  faTrash,
  faClock,
  faBolt,
  faHashtag,
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

const [inspections, setInspections] = useState([]);
const [showAddInspection, setShowAddInspection] = useState(false);
const [inspectionDescription, setInspectionDescription] = useState("");


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

  }, [id, token, isAuthenticated]);



  // Fetch inspections for this transformer

  useEffect(() => {

    const fetchInspections = async () => {

      try {

        const response = await axios.get(

          `http://localhost:8080/api/inspections/${id}`,

          {

            headers: { Authorization: `Bearer ${token}` },

          }

        );

        setInspections(response.data);

      } catch (err) {

        console.error("Failed to fetch inspections", err);

      }

    };



    fetchInspections();

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


  const handleAddInspection = async () => {

    if (!inspectionDescription.trim()) {

      alert("Please enter an inspection description");

      return;

    }



    try {

      const response = await axios.post(

        "http://localhost:8080/api/inspections",

        null,

        {

          params: {

            transformerId: id,

            description: inspectionDescription,

          },

          headers: { Authorization: `Bearer ${token}` },

        }

      );



      setInspections([...inspections, response.data]);

      setInspectionDescription("");

      setShowAddInspection(false);

    } catch (err) {

      console.error("Failed to add inspection", err);

    }

  };


  // Separate images by type
  const baselineImages =
    transformerRecord?.images?.filter((image) => image.type === "Baseline") ||
    [];

  const maintenanceImages =
    transformerRecord?.images?.filter(
      (image) => image.type === "Maintenance"
    ) || [];

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
                    <strong>Transformer Type:</strong>{" "}
                    {transformerRecord.transformerType || "Not specified"}
                  </p>
                  <p>
                    <strong>Pole No:</strong>{" "}
                    {transformerRecord.poleNo || "Not specified"}
                  </p>
                  <p>
                    <strong>Capacity:</strong>{" "}
                    {transformerRecord.capacity
                      ? `${transformerRecord.capacity}kVA`
                      : "Not specified"}
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
                <Row className="mt-4">
                  {/* Baseline Images - Left Side */}
                  <Col md={6}>
                    <h4 className="mb-3 text-center">Baseline Images</h4>
                    {baselineImages.length > 0 ? (
                      <Row className="g-3">
                        {baselineImages.map((image) => (
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
                    <h4 className="mb-3 text-center">Maintenance Images</h4>
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
                        No Maintenance images available
                      </Alert>
                    )}
                  </Col>
                </Row>
              ) : (
                <Alert variant="info" className="mt-3">
                  No images in this transformer record
                </Alert>
              )}
            </Tab>

            <Tab eventKey="inspections" title="Inspections">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Inspections</h4>
                <Button variant="primary" onClick={() => setShowAddInspection(true)}>
                  + Add Inspection
                </Button>
              </div>

              {inspections.length > 0 ? (
                inspections.map((inspection) => (
                  <Card key={inspection.id} className="mb-3">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        {/* <strong>Date:</strong> {new Date(inspection.date).toLocaleDateString()} */}
                        <strong>Description:</strong> {inspection.description}
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/inspections/${inspection.id}`)}
                      >
                        View & Upload Image
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">No inspections yet.</Alert>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Add Inspection Modal */}

      <Modal show={showAddInspection} onHide={() => setShowAddInspection(false)}>

        <Modal.Header closeButton>

          <Modal.Title>Add New Inspection</Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group>

              <Form.Label>Description</Form.Label>

              <Form.Control

                type="text"

                placeholder="Enter inspection description"

                value={inspectionDescription}

                onChange={(e) => setInspectionDescription(e.target.value)}

              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowAddInspection(false)}>

            Cancel

          </Button>

          <Button variant="primary" onClick={handleAddInspection}>

            Add Inspection

          </Button>

        </Modal.Footer>

      </Modal>

      
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
