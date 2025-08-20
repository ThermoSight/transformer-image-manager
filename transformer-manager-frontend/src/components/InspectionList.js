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
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faEdit,
  faPlus,
  faImages,
  faSearch,
  faFilter,
  faSort,
  faCalendarAlt,
  faUser,
  faList,
  faThLarge,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const InspectionList = () => {
  const [transformerRecords, setTransformerRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [sortConfig, setSortConfig] = useState({
    key: "updatedAt",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchTransformerRecords();
  }, [token]);

  const fetchTransformerRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/transformer-records"
      );
      setTransformerRecords(response.data);
      setFilteredRecords(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch inspection records");
      setTransformerRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the most recent upload time from images
  const getMostRecentUpdate = (record) => {
    if (!record.images || record.images.length === 0) {
      return record.createdAt; // Fallback to creation date if no images
    }

    // Sort images by uploadTime in descending order and get the first one
    const sortedImages = [...record.images].sort(
      (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime)
    );

    return sortedImages[0].uploadTime;
  };

  useEffect(() => {
    let result = [...transformerRecords];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((record) => {
        if (searchField === "name") {
          return record.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === "admin") {
          return record.uploadedBy?.displayName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "updatedAt") {
          aValue = getMostRecentUpdate(a);
          bValue = getMostRecentUpdate(b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRecords(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transformerRecords, searchTerm, searchField, sortConfig]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/transformer-records/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTransformerRecords();
    } catch (err) {
      setError("Failed to delete inspection record");
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
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading inspection records...</p>
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
        <h2>Inspections</h2>
        <div className="d-flex align-items-center">
          <ButtonGroup className="me-3">
            <Button
              variant={viewMode === "cards" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("cards")}
              size="sm"
            >
              <FontAwesomeIcon icon={faThLarge} />
            </Button>
            <Button
              variant={viewMode === "table" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("table")}
              size="sm"
            >
              <FontAwesomeIcon icon={faList} />
            </Button>
          </ButtonGroup>
        </div>
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
                    {searchField === "admin" && "Admin"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSearchField("name")}>
                      Name
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
            <Col md={6}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  <FontAwesomeIcon icon={faSort} className="me-2" />
                  Sort: {sortConfig.key === "name" && "Name"}
                  {sortConfig.key === "updatedAt" && "Last Update"}
                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => requestSort("name")}>
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => requestSort("updatedAt")}>
                    Last Update{" "}
                    {sortConfig.key === "updatedAt" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-4">
          <FontAwesomeIcon
            icon={faImages}
            size="3x"
            className="text-muted mb-3"
          />
          <p>No inspection records found</p>
          {searchTerm && (
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Table striped hover responsive className="moodle-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Admin</th>
                    <th>Last Update</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.uploadedBy?.displayName || "-"}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faClock}
                          className="me-2 text-muted"
                        />
                        {new Date(
                          getMostRecentUpdate(record)
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg="secondary">
                          {record.images?.length || 0}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/records/${record.id}`)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {isAuthenticated && (
                          <>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                navigate(`/upload?edit=${record.id}`)
                              }
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setRecordToDelete(record.id);
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
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {currentItems.map((record) => (
              <Col key={record.id}>
                <Card className="h-100 bg-light">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      {record.name}
                    </Card.Title>

                    <div className="d-flex justify-content-between text-muted mb-3">
                      <div>
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        <small>
                          {record.uploadedBy?.displayName || "Unknown"}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between text-muted mb-3">
                      <div>
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        <small>
                          Last update:{" "}
                          {new Date(
                            getMostRecentUpdate(record)
                          ).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between text-muted mb-3">
                      <small>
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-2"
                        />
                        Created:{" "}
                        {new Date(record.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="secondary">
                        {record.images?.length || 0} images
                      </Badge>

                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/records/${record.id}`)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {isAuthenticated && (
                          <>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                navigate(`/upload?edit=${record.id}`)
                              }
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setRecordToDelete(record.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

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
                (page === currentPage + 2 && currentPage < totalPages - 2)
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this inspection record? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(recordToDelete)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InspectionList;
