import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import LocationPicker from "./LocationPicker";
import { useAuth } from "../AuthContext";

const typeOptions = ["Baseline", "Maintenance"];
const weatherOptions = ["Sunny", "Cloudy", "Rainy"];

const ImageSetUpload = ({ onUpload }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [capacity, setCapacity] = useState("");
  const [imageFields, setImageFields] = useState([
    { file: null, type: "Baseline", weatherCondition: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageFieldChange = (idx, field, value) => {
    const newFields = [...imageFields];
    newFields[idx][field] = value;
    setImageFields(newFields);
  };

  const handleFileChange = (idx, e) => {
    handleImageFieldChange(idx, "file", e.target.files[0]);
  };

  const addImageField = () => {
    setImageFields([
      ...imageFields,
      { file: null, type: "Baseline", weatherCondition: "" },
    ]);
  };

  const removeImageField = (idx) => {
    if (imageFields.length === 1) return;
    setImageFields(imageFields.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !capacity) {
      setError("Please provide name, location, and capacity");
      return;
    }

    if (
      imageFields.some(
        (img) =>
          !img.file ||
          !img.type ||
          (img.type === "Baseline" && !img.weatherCondition)
      )
    ) {
      setError(
        "Please provide all image details (weather required for Baseline)"
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("locationName", location.name || "");
    formData.append("locationLat", location.lat);
    formData.append("locationLng", location.lng);
    formData.append("capacity", capacity);

    imageFields.forEach((img) => {
      formData.append("images", img.file);
      formData.append("types", img.type);
      formData.append(
        "weatherConditions",
        img.type === "Baseline" ? img.weatherCondition : ""
      );
    });

    try {
      await axios.post("http://localhost:8080/api/image-sets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Image set uploaded successfully!");
      setName("");
      setLocation(null);
      setCapacity("");
      setImageFields([{ file: null, type: "Baseline", weatherCondition: "" }]);
      if (onUpload) onUpload();
    } catch (err) {
      setError(
        "Failed to upload image set: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const { token } = useAuth();

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Upload Image Set</Card.Title>
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
            <Form.Label>Set Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <LocationPicker
              value={location}
              onChange={(newLocation) => {
                setLocation(newLocation);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </Form.Group>

          <h5>Images</h5>
          {imageFields.map((img, idx) => (
            <Card key={idx} className="mb-2">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Image File</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(idx, e)}
                        accept="image/*"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={img.type}
                        onChange={(e) =>
                          handleImageFieldChange(idx, "type", e.target.value)
                        }
                      >
                        {typeOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {img.type === "Baseline" && (
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Weather Condition</Form.Label>
                        <Form.Select
                          value={img.weatherCondition}
                          onChange={(e) =>
                            handleImageFieldChange(
                              idx,
                              "weatherCondition",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Select Weather</option>
                          {weatherOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeImageField(idx)}
                  className="mt-2"
                >
                  Remove
                </Button>
              </Card.Body>
            </Card>
          ))}

          <div className="image-upload-actions">
            <Button
              variant="secondary"
              className="me-2 mb-3"
              onClick={addImageField}
            >
              Add Another Image
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={uploading}
              className="mb-3"
            >
              {uploading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
              ) : null}
              Upload
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ImageSetUpload;
