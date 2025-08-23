import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Spinner, Alert, Row, Col, Image } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const InspectionDetail = () => {
  const { id } = useParams(); // inspectionId
  const { token } = useAuth();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/inspections/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInspection(res.data);
      } catch (err) {
        console.error("Error fetching inspection:", err);
        setError("Failed to fetch inspection details");
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id, token]);

const handleUpload = async () => {
  if (!file) return alert("Please select an image");
  
  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post(`http://localhost:8080/api/inspections/${id}/upload-image`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data" 
      }
    });
    alert("Image uploaded successfully!");
    setFile(null);
    
    // Refresh inspection details
    const res = await axios.get(`http://localhost:8080/api/inspections/detail/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInspection(res.data);
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Failed to upload image");
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
        Back to Transformer
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2>Inspection Details</h2>
              <div className="text-muted mb-3">
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Inspection Date: {inspection.inspectionDate ? new Date(inspection.inspectionDate).toLocaleDateString() : "Not specified"}
              </div>
              <div className="text-muted">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                Created: {new Date(inspection.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <h4>Transformer: {inspection.transformerRecord?.name || "Unknown"}</h4>
            </div>
          </div>

          <Card className="mb-4">
            <Card.Header>
              <h4>Description</h4>
            </Card.Header>
            <Card.Body>
              <p>{inspection.description || "No description provided"}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h4>Upload Inspection Image</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  accept="image/*"
                  className="form-control"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={handleUpload} 
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4>Inspection Images ({inspection.images?.length || 0})</h4>
            </Card.Header>
            <Card.Body>
              {inspection.images && inspection.images.length > 0 ? (
                <Row>
                  {inspection.images.map((image) => (
                    <Col key={image.id} md={6} lg={4} className="mb-3">
                      <Card>
                        <Image
                          src={`http://localhost:8080${image.imageUrl}`}
                          alt="Inspection"
                          fluid
                          style={{
                            height: "200px",
                            width: "100%",
                            objectFit: "cover"
                          }}
                        />
                        <Card.Body>
                          <small className="text-muted">
                            Uploaded: {new Date().toLocaleDateString()}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info">
                  No inspection images uploaded yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InspectionDetail;