import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../AuthContext";

const InspectionDetail = () => {
  const { id } = useParams(); // inspectionId
  const { token } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [baselineImage, setBaselineImage] = useState(null);
  const [inspectionImage, setInspectionImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/inspections/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInspection(res.data);
        setBaselineImage(res.data.baselineImage);
        setInspectionImage(res.data.inspectionImage);
      } catch (err) {
        console.error("Error fetching inspection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id, token]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`http://localhost:8080/api/inspections/${id}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Image uploaded!");
      setFile(null);
      // Refresh inspection details
      const res = await axios.get(`http://localhost:8080/api/inspections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInspection(res.data);
      setInspectionImage(res.data.inspectionImage);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;

  return (
    <div className="p-4">
      <h2>Inspection on {new Date(inspection.date).toLocaleDateString()}</h2>
      <div className="d-flex gap-4 mt-4">
        <div>
          <h4>Baseline Image</h4>
          {baselineImage ? <img src={`http://localhost:8080${baselineImage}`} alt="Baseline" style={{ width: "300px" }} /> : "No baseline image"}
        </div>
        <div>
          <h4>Inspection Image</h4>
          {inspectionImage ? <img src={`http://localhost:8080${inspectionImage}`} alt="Inspection" style={{ width: "300px" }} /> : "No inspection image"}
        </div>
      </div>

      <div className="mt-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button variant="primary" onClick={handleUpload} className="ms-2">Upload</Button>
      </div>
    </div>
  );
};

export default InspectionDetail;
