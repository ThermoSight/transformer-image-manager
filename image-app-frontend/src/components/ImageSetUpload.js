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
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import LocationPicker from "./LocationPicker";
import { useAuth } from "../AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const ImageSetUpload = ({ onUpload }) => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    location: null,
    capacity: "",
    images: [],
    existingImages: [], // New state for existing images
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Fetch existing data when in edit mode
  useEffect(() => {
    if (editId) {
      const fetchSet = async () => {
        try {
          setFetching(true);
          const response = await axios.get(
            `http://localhost:8080/api/image-sets/${editId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const set = response.data;

          setFormData({
            name: set.name,
            location: {
              name: set.locationName || "",
              lat: set.locationLat || null,
              lng: set.locationLng || null,
            },
            capacity: set.capacity || "",
            images: [],
            existingImages: set.images || [],
          });
          setError("");
        } catch (err) {
          setError(
            "Failed to fetch set data: " +
              (err.response?.data?.message || err.message)
          );
        } finally {
          setFetching(false);
        }
      };
      fetchSet();
    }
  }, [editId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleFileChange = (index, e) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      file: e.target.files[0],
      type: newImages[index]?.type || "Maintenance",
      weatherCondition: newImages[index]?.weatherCondition || "",
    };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleTypeChange = (index, type) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      type,
      weatherCondition: type === "Baseline" ? "Sunny" : "",
    };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleWeatherChange = (index, weather) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      weatherCondition: weather,
    };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { file: null, type: "Maintenance", weatherCondition: "" },
      ],
    }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleDeleteExistingImage = async () => {
    if (!imageToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/image-sets/images/${imageToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter(
          (img) => img.id !== imageToDelete
        ),
      }));
      setSuccess("Image deleted successfully");
    } catch (err) {
      setError(
        "Failed to delete image: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setShowDeleteImageModal(false);
      setImageToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.capacity) {
      setError("Please provide name, location, and capacity");
      return;
    }

    // Only validate new images, existing ones don't need validation
    if (formData.images.some((img) => !img.file)) {
      setError("Please select files for all new images");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("locationName", formData.location?.name || "");
      data.append("locationLat", formData.location?.lat || "");
      data.append("locationLng", formData.location?.lng || "");
      data.append("capacity", formData.capacity);

      // Add new images
      formData.images.forEach((img) => {
        data.append("images", img.file);
        data.append("types", img.type);
        data.append("weatherConditions", img.weatherCondition || "");
      });

      if (editId) {
        await axios.put(
          `http://localhost:8080/api/image-sets/${editId}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess("Image set updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/image-sets", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess("Image set uploaded successfully!");
      }

      if (onUpload) onUpload();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.location || formData.images.length > 0) {
      setShowCancelModal(true);
    } else {
      navigate("/");
    }
  };

  if (fetching) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading image set data...</p>
      </div>
    );
  }

  return (
    <div className="moodle-container">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={editId ? faEdit : faUpload} className="me-2" />
          {editId ? "Edit Image Set" : "Upload New Image Set"}
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
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Set Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Capacity *</Form.Label>
                  <Form.Control
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Location *</Form.Label>
              <LocationPicker
                value={formData.location}
                onChange={handleLocationChange}
              />
            </Form.Group>

            {/* Existing Images Section */}
            {editId && formData.existingImages.length > 0 && (
              <>
                <h4 className="mb-3">Existing Images</h4>
                <Row className="g-3 mb-4">
                  {formData.existingImages.map((image) => (
                    <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
                      <Card>
                        <div style={{ position: "relative" }}>
                          <img
                            src={`http://localhost:8080${image.filePath}`}
                            alt={image.type}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
                            onClick={() => {
                              setImageToDelete(image.id);
                              setShowDeleteImageModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                        <Card.Body>
                          <p>
                            <strong>Type:</strong> {image.type}
                          </p>
                          {image.type === "Baseline" && (
                            <p>
                              <strong>Weather:</strong>{" "}
                              {image.weatherCondition || "N/A"}
                            </p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* New Images Section */}
            <h4 className="mb-3">New Images</h4>
            {formData.images.length === 0 && (
              <Alert variant="info">
                No new images added yet. Click "Add Image" below to upload
                additional images.
              </Alert>
            )}

            {formData.images.map((img, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Image File *</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e)}
                          required={img.file === null}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Type *</Form.Label>
                        <Form.Select
                          value={img.type}
                          onChange={(e) =>
                            handleTypeChange(index, e.target.value)
                          }
                        >
                          <option value="Maintenance">Maintenance</option>
                          <option value="Baseline">Baseline</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {img.type === "Baseline" && (
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Weather Condition *</Form.Label>
                          <Form.Select
                            value={img.weatherCondition}
                            onChange={(e) =>
                              handleWeatherChange(index, e.target.value)
                            }
                          >
                            <option value="Sunny">Sunny</option>
                            <option value="Cloudy">Cloudy</option>
                            <option value="Rainy">Rainy</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    )}
                    <Col md={1} className="d-flex align-items-end">
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
                ) : editId ? (
                  "Update Set"
                ) : (
                  "Upload Set"
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
          <Button variant="danger" onClick={() => navigate("/")}>
            Discard Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Image Confirmation Modal */}
      <Modal
        show={showDeleteImageModal}
        onHide={() => setShowDeleteImageModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteImageModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteExistingImage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageSetUpload;
