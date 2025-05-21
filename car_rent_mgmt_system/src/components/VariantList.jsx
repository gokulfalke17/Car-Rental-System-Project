import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, Button, Image, Container, Pagination, Collapse, Modal,
  Alert, Spinner, Badge, Card, Row, Col
} from "react-bootstrap";
import { Link } from "react-router-dom";
import VariantDetails from "./VariantDetails";
import { FaCar, FaEdit, FaTrash, FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const VariantList = () => {
  const [variants, setVariants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const pageSize = 3;

  useEffect(() => {
    fetchVariants(currentPage);
  }, [currentPage]);

  const fetchVariants = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:4041/api/variant/all?page=${page}&size=${pageSize}`);
      setVariants(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching variants:", error);
      setError("Failed to fetch variants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (variantId) => {
    setVariantToDelete(variantId);
    setShowConfirmDeleteModal(true);
  };

  const deleteVariant = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4041/api/variant/delete/${variantToDelete}`);
      fetchVariants(currentPage);
      setSuccess("Variant deleted successfully!");
    } catch (error) {
      console.error("Error deleting variant:", error);
      setError("Failed to delete variant. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmDeleteModal(false);
    }
  };

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-4">
      <Pagination.First
        onClick={() => setCurrentPage(0)}
        disabled={currentPage === 0 || loading}
        className="border-0 shadow-sm"
      />
      <Pagination.Prev
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
        disabled={currentPage === 0 || loading}
        className="border-0 shadow-sm"
      />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index}
          active={index === currentPage}
          onClick={() => !loading && setCurrentPage(index)}
          disabled={loading}
          className={index === currentPage ? "bg-primary border-0 shadow-sm" : "border-0 shadow-sm"}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1 || loading}
        className="border-0 shadow-sm"
      />
      <Pagination.Last
        onClick={() => setCurrentPage(totalPages - 1)}
        disabled={currentPage === totalPages - 1 || loading}
        className="border-0 shadow-sm"
      />
    </Pagination>
  );

  const getFuelTypeBadge = (fuelType) => {
    const fuelTypes = {
      'petrol': { bg: 'danger', text: 'white' },
      'diesel': { bg: 'warning', text: 'dark' },
      'electric': { bg: 'success', text: 'white' },
      'hybrid': { bg: 'info', text: 'white' },
      'default': { bg: 'secondary', text: 'white' }
    };
    
    const type = fuelType.toLowerCase();
    return fuelTypes[type] || fuelTypes['default'];
  };

  const renderImage = (imageUrl, altText) => {
  if (!imageUrl) return null;


  let cleanedPath = imageUrl.replace(/\/uploads\/imgs\/.*\/uploads\/imgs\//, "/uploads/imgs/");


  if (!cleanedPath.startsWith("http")) {
    cleanedPath = `http://localhost:4041${cleanedPath.startsWith("/") ? "" : "/"}${cleanedPath}`;
  }

  console.log("Image URL:", cleanedPath); 
  
  return (
    <div className="position-relative" style={{ width: '100px', height: '80px' }}>
      <Image
        src={cleanedPath}
        alt={altText}
        fluid
        className="rounded shadow-sm h-100 w-100 object-fit-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80' viewBox='0 0 100 80'%3E%3Crect width='100' height='80' fill='%23f8f9fa'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>
  );
};

  return (
    <Container className="mt-3 mb-5 px-0 px-md-3">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="shadow-sm">
          <strong>Error!</strong> {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible className="shadow-sm">
          <strong>Success!</strong> {success}
        </Alert>
      )}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-gradient-primary text-white">
          <h2 className="mb-0 text-center">
            <FaCar className="me-2" /> All Car Variants
          </h2>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && variants.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading variants...</p>
            </div>
          ) : variants.length === 0 ? (
            <Alert variant="info" className="text-center m-3 shadow-sm">
              No variants found. Please add some variants to display.
            </Alert>
          ) : (
            <>
              <div className="d-none d-md-block">
                <Table hover responsive className="mb-0">
                  <thead style={{ backgroundColor: "#003049", color: "#fff" }}>
                    <tr>
                      <th className="text-center">Image</th>
                      <th>Variant</th>
                      <th className="d-none d-lg-table-cell">Details</th>
                      <th className="text-center">Rent/Day</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <React.Fragment key={variant.variantId}>
                        <tr className={selectedVariantId === variant.variantId ? "bg-light" : ""}>
                          <td className="align-middle text-center">
                            {renderImage(`${variant.imageUrl}`, variant.variantName)}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark">
                                {variant.variantName
                                  .toLowerCase()
                                  .split(' ')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')}
                              </span>
                              <small className="text-muted">{variant.modelNumber}</small>
                            </div>
                          </td>
                          <td className="d-none d-lg-table-cell align-middle">
                            <div className="text-start">
                              <div><strong>Year:</strong> {variant.year}</div>
                              <div>
                                <strong>Fuel:</strong> {' '}
                                <Badge 
                                  bg={getFuelTypeBadge(variant.fuelType).bg} 
                                  text={getFuelTypeBadge(variant.fuelType).text}
                                  className="text-capitalize"
                                >
                                  {variant.fuelType}
                                </Badge>
                              </div>
                              <div><strong>AC:</strong> {variant.isAc ? 'Yes' : 'No'}</div>
                              <div><strong>Seats:</strong> {variant.seatCapacity}</div>
                            </div>
                          </td>
                          <td className="align-middle text-center fw-bold text-success">
                            ₹{variant.rentPerDay}
                          </td>
                          <td className="align-middle text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Link to={`/variantList/update/${variant.variantId}`}>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  className="d-flex align-items-center"
                                  disabled={loading}
                                >
                                  <FaEdit className="me-1" />
                                  <span className="d-none d-lg-inline">Update</span>
                                </Button>
                              </Link>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center"
                                onClick={() => handleDeleteClick(variant.variantId)}
                                disabled={loading}
                              >
                                <FaTrash className="me-1" />
                                <span className="d-none d-lg-inline">Delete</span>
                              </Button>

                              <Button
                                variant={selectedVariantId === variant.variantId ? "outline-secondary" : "outline-primary"}
                                size="sm"
                                className="d-flex align-items-center"
                                onClick={() =>
                                  setSelectedVariantId(
                                    selectedVariantId === variant.variantId ? null : variant.variantId
                                  )
                                }
                                disabled={loading}
                              >
                                {selectedVariantId === variant.variantId ? (
                                  <>
                                    <FaChevronUp className="me-1" />
                                    <span className="d-none d-lg-inline">Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <FaInfoCircle className="me-1" />
                                    <span className="d-none d-lg-inline">Register Vehicle</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="p-0">
                            <Collapse in={selectedVariantId === variant.variantId}>
                              <div className="p-3">
                                <VariantDetails variant={variant} />
                              </div>
                            </Collapse>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-block d-md-none">
                {variants.map((variant) => (
                  <Card key={variant.variantId} className="mb-3 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{variant.variantName}</strong>
                          <div className="text-muted">{variant.modelNumber}</div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="fw-bold text-success">₹{variant.rentPerDay}</span>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => setSelectedVariantId(selectedVariantId === variant.variantId ? null : variant.variantId)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                      <Collapse in={selectedVariantId === variant.variantId}>
                        <div className="mt-2">
                          <VariantDetails variant={variant} />
                        </div>
                      </Collapse>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      {renderPagination()}
    </Container>
  );
};

export default VariantList;
