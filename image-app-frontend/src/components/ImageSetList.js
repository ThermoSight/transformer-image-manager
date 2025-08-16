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
  Form,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faEdit,
  faPlus,
  faMapMarkerAlt,
  faImages,
  faSearch,
  faFilter,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ImageSetList = () => {
  const [sets, setSets] = useState([]);
  const [filteredSets, setFilteredSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Changed to 6 per requirement
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [capacityFilter, setCapacityFilter] = useState("all");

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
      setFilteredSets(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch image sets");
      setSets([]);
      setFilteredSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...sets];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((set) => {
        if (searchField === "name") {
          return set.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === "location") {
          return set.locationName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else if (searchField === "admin") {
          return set.uploadedBy?.displayName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    // Apply capacity filter
    if (capacityFilter !== "all") {
      result = result.filter((set) => {
        if (capacityFilter === "small") {
          return set.capacity && set.capacity < 50;
        } else if (capacityFilter === "medium") {
          return set.capacity && set.capacity >= 50 && set.capacity < 200;
        } else if (capacityFilter === "large") {
          return set.capacity && set.capacity >= 200;
        }
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredSets(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [sets, searchTerm, searchField, capacityFilter, sortConfig]);

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

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);

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

      {/* Search and Filter Bar */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    {searchField === "name" && "Name"}
                    {searchField === "location" && "Location"}
                    {searchField === "admin" && "Admin"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSearchField("name")}>
                      Name
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSearchField("location")}>
                      Location
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSearchField("admin")}>
                      Admin
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  type="text"
                  placeholder={`Search by ${searchField}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Capacity: {capacityFilter === "all" && "All"}
                  {capacityFilter === "small" && "Small (<50)"}
                  {capacityFilter === "medium" && "Medium (50-200)"}
                  {capacityFilter === "large" && "Large (200+)"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setCapacityFilter("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCapacityFilter("small")}>
                    Small (&lt;50)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCapacityFilter("medium")}>
                    Medium (50-200)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCapacityFilter("large")}>
                    Large (200+)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  <FontAwesomeIcon icon={faSort} className="me-2" />
                  Sort: {sortConfig.key === "name" && "Name"}
                  {sortConfig.key === "createdAt" && "Date"}
                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => requestSort("name")}>
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => requestSort("createdAt")}>
                    Date{" "}
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          {filteredSets.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon
                icon={faImages}
                size="3x"
                className="text-muted mb-3"
              />
              <p>No image sets found</p>
              {searchTerm && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setCapacityFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table striped hover responsive className="moodle-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Images</th>
                    <th>Admin</th>
                    <th>Date</th>
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
                        {set.capacity ? (
                          <Badge
                            bg={
                              set.capacity < 50
                                ? "info"
                                : set.capacity < 200
                                ? "primary"
                                : "success"
                            }
                          >
                            {set.capacity}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <Badge bg="secondary">{set.images?.length || 0}</Badge>
                      </td>
                      <td>{set.uploadedBy?.displayName || "-"}</td>
                      <td>{new Date(set.createdAt).toLocaleDateString()}</td>
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
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((number) => {
                      const page = number + 1;
                      // Show only first, last, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Pagination.Item>
                        );
                      } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2)
                      ) {
                        return <Pagination.Ellipsis key={page} />;
                      }
                      return null;
                    })}
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
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
