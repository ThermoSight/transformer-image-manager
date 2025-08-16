import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Modal,
  Badge,
  Pagination,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faEdit,
  faPlus,
  faMapMarkerAlt,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ImageSetList = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSets();
  }, [token]);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/image-sets");
      setSets(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch image sets");
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/image-sets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSets();
    } catch (err) {
      setError("Failed to delete set");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sets.length / itemsPerPage);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading image sets...</p>
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

  return (
    <div className="moodle-container">
      <div className="page-header">
        <h2>Image Sets</h2>
        {isAuthenticated && (
          <Button variant="primary" onClick={() => navigate("/upload")}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Set
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <Card.Body>
          {sets.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon
                icon={faImages}
                size="3x"
                className="text-muted mb-3"
              />
              <p>No image sets found</p>
            </div>
          ) : (
            <>
              <Table striped hover responsive className="moodle-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((set) => (
                    <tr key={set.id}>
                      <td>{set.name}</td>
                      <td>
                        {set.locationName && (
                          <>
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="me-2 text-muted"
                            />
                            {set.locationName
                              .split(",")
                              .slice(0, 3)
                              .map((part) => part.trim())
                              .join(", ")}
                          </>
                        )}
                      </td>
                      <td>
                        <Badge bg="info">{set.images?.length || 0}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/sets/${set.id}`)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {isAuthenticated && (
                          <>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => navigate(`/upload?edit=${set.id}`)}
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSetToDelete(set.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(totalPages).keys()].map((number) => (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => setCurrentPage(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image set? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(setToDelete)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageSetList;
