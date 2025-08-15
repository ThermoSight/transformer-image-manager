import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  ListGroup,
  Spinner,
  Alert,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faExpand } from "@fortawesome/free-solid-svg-icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "../AuthContext";
import LocationPicker from "./LocationPicker"; // <-- Import the new LocationPicker

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ImageSetList = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState(null);
  const [editCapacity, setEditCapacity] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newImageTypes, setNewImageTypes] = useState([]);
  const [newWeatherConditions, setNewWeatherConditions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line
  }, []);

  const fetchSets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/image-sets");
      setSets(response.data);
      setError("");
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch image sets: " + err.message);
      setSets([]);
      setLoading(false);
    }
  };

  const handleEdit = (set) => {
    setCurrentSet(set);
    setEditName(set.name);
    setEditLocation({
      name: set.locationName || "",
      lat: set.locationLat || null,
      lng: set.locationLng || null,
    });
    setEditCapacity(set.capacity);
    setShowEditModal(true);
  };

  const handlePreview = (image) => {
    setPreviewImage(image);
    setShowPreviewModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewImageTypes(files.map(() => "Maintenance"));
    setNewWeatherConditions(files.map(() => ""));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("locationName", editLocation?.name || "");
      formData.append("locationLat", editLocation?.lat);
      formData.append("locationLng", editLocation?.lng);
      formData.append("capacity", editCapacity);

      if (newImages.length > 0) {
        newImages.forEach((file) => formData.append("images", file));
        newImageTypes.forEach((type) => formData.append("types", type));
        if (newImageTypes.some((type) => type === "Baseline")) {
          newWeatherConditions.forEach((condition) =>
            formData.append("weatherConditions", condition)
          );
        }
      }

      const response = await axios.put(
        `http://localhost:8080/api/image-sets/${currentSet.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSets(
        sets.map((set) => (set.id === currentSet.id ? response.data : set))
      );
      setShowEditModal(false);
      setNewImages([]);
      setNewImageTypes([]);
      setNewWeatherConditions([]);
    } catch (err) {
      setError("Failed to update set: " + err.message);
    }
  };

  const handleDeleteSet = async (id) => {
    if (!window.confirm("Delete this image set and all images?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/image-sets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSets(sets.filter((set) => set.id !== id));
    } catch (err) {
      setError("Failed to delete set: " + err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/image-sets/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSets();
    } catch (err) {
      setError("Failed to delete image: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" dismissible onClose={() => setError("")}>
        {error}
      </Alert>
    );

  return (
    <div>
      <h2 className="mb-4">Image Sets</h2>
      {sets.length === 0 ? (
        <Card>
          <Card.Body>No image sets.</Card.Body>
        </Card>
      ) : (
        sets.map((set) => (
          <Card key={set.id} className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={9}>
                  <Card.Title>{set.name}</Card.Title>
                  <Card.Text>
                    <strong>Uploaded by:</strong>{" "}
                    {set.uploadedBy?.displayName || "Unknown"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {set.locationName || "N/A"}
                    {set.locationLat && set.locationLng && (
                      <div className="osm-map-preview mt-2">
                        <MapContainer
                          center={[
                            parseFloat(set.locationLat),
                            parseFloat(set.locationLng),
                          ]}
                          zoom={13}
                          scrollWheelZoom={false}
                          style={{
                            height: "150px",
                            width: "100%",
                            borderRadius: "4px",
                          }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker
                            position={[
                              parseFloat(set.locationLat),
                              parseFloat(set.locationLng),
                            ]}
                          >
                            <Popup>
                              {set.locationName || "Image Set Location"}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacity:</strong> {set.capacity}
                  </Card.Text>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-start justify-content-end gap-2"
                >
                  {isAuthenticated && (
                    <>
                      <Button variant="primary" onClick={() => handleEdit(set)}>
                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteSet(set.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
              <ListGroup className="mt-3">
                {set.images && set.images.length > 0 ? (
                  set.images.map((img) => (
                    <ListGroup.Item
                      key={img.id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            cursor: "pointer",
                            marginRight: 15,
                            position: "relative",
                          }}
                          onClick={() => handlePreview(img)}
                        >
                          <img
                            src={`http://localhost:8080${img.filePath}`}
                            alt=""
                            style={{
                              height: 80,
                              width: "auto",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #eee",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              transition: "opacity 0.3s",
                              color: "white",
                            }}
                            className="hover-show"
                          >
                            <FontAwesomeIcon icon={faExpand} />
                          </div>
                        </div>
                        <div>
                          <strong>Type:</strong> {img.type}
                          {img.type === "Baseline" && (
                            <span>
                              {" "}
                              <strong>Weather:</strong>{" "}
                              {img.weatherCondition || (
                                <span className="text-muted">N/A</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-muted">
                    No images in this set.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Image Set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <LocationPicker
                value={editLocation}
                onChange={(newLocation) => setEditLocation(newLocation)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                value={editCapacity}
                onChange={(e) => setEditCapacity(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Add New Images (Optional)</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
            {newImages.length > 0 && (
              <div className="mb-3">
                <h6>New Image Types:</h6>
                {newImages.map((img, index) => (
                  <div key={index} className="mb-2">
                    <p>{img.name}</p>
                    <Form.Select
                      value={newImageTypes[index]}
                      onChange={(e) => {
                        const updatedTypes = [...newImageTypes];
                        updatedTypes[index] = e.target.value;
                        setNewImageTypes(updatedTypes);
                      }}
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Baseline">Baseline</option>
                    </Form.Select>
                    {newImageTypes[index] === "Baseline" && (
                      <Form.Control
                        type="text"
                        placeholder="Weather condition"
                        value={newWeatherConditions[index]}
                        onChange={(e) => {
                          const updatedConditions = [...newWeatherConditions];
                          updatedConditions[index] = e.target.value;
                          setNewWeatherConditions(updatedConditions);
                        }}
                        className="mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewImage && (
            <img
              src={`http://localhost:8080${previewImage.filePath}`}
              alt="Preview"
              style={{
                width: "90%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImageSetList;
