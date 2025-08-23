import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUpload,
  faPlus,
  faTimes,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const InspectionUpload = () => {
  const { transformerId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split('T')[0], // Default to today
    notes: "",
    images: [],
  });
  const [transformer, setTransformer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch transformer data
  useEffect(() => {
    const fetchTransformer = async () => {
      try {
        setFetching(true);
        const response = await axios.get(
          `http://localhost:8080/api/transformer-records/${transformerId}`
        );
        setTransformer(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch transformer data");
      } finally {
        setFetching(false);
      }
    };
    fetchTransformer();
  }, [transformerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index, e) => {
    const newImages = [...formData.images];
    newImages[index] = e.target.files[0];
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, null],
    }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    // Validate date
    if (!formData.inspectionDate) {
      setError("Please select an inspection date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("transformerRecordId", transformerId);
      data.append("inspectionDate", formData.inspectionDate);
      data.append("notes", formData.notes);

      // Add images that have files
      formData.images.forEach((image) => {
        if (image) {
          data.append("images", image);
        }
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const response = await axios.post(
        "http://localhost:8080/api/inspections",
        data,
        config
      );

      setSuccess("Inspection created successfully!");
      setTimeout(() => navigate(`/inspections/list/${transformerId}`), 1500);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Failed to create inspection");
        console.error("Upload error:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.notes || formData.images.some((img) => img !== null)) {
      setShowCancelModal(true);
    } else {
      navigate(`/inspections/list/${transformerId}`);
    }
  };

  if (fetching) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading transformer data...</p>
      </div>
    );
  }

  return (
    <div className="moodle-container">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Add New Inspection for {transformer?.name || "Transformer"}
          {transformer?.poleNo && ` (Pole #${transformer.poleNo})`}
        </h2>
        <Button variant="outline-secondary" onClick={handleCancel}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Cancel
        </Button>
      </div>

      <Card>
        <Card.Body>
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
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Inspection Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleInputChange}
                    required
                    // REMOVED: max={new Date().toISOString().split('T')[0]} 
                    // Now allows any date (past, present, or future)
                  />
                  <Form.Text className="text-muted">
                    Select the date when the inspection was conducted
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this inspection..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mb-3">Maintenance Images (Optional)</h4>
            {formData.images.length === 0 && (
              <Alert variant="info">
                No images added yet. Click "Add Image" below to upload
                maintenance images.
              </Alert>
            )}

            {formData.images.map((img, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>
                          Maintenance Image {img ? "(Selected)" : ""}
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        variant="danger"
                        onClick={() => removeImageField(index)}
                        className="w-100"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-primary" onClick={addImageField}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Image
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Processing...
                  </>
                ) : (
                  "Create Inspection"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Are you sure you want to cancel?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Continue Editing
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate(`/inspections/list/${transformerId}`)}
          >
            Discard Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InspectionUpload;