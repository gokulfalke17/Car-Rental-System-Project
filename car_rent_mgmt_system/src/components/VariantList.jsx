import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, Button, Image, Container, Pagination, Collapse, Modal
} from "react-bootstrap";
import { Link } from "react-router-dom";
import VariantDetails from "./VariantDetails";

const VariantList = () => {
  const [variants, setVariants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  
  const pageSize = 3;

  useEffect(() => {
    fetchVariants(currentPage);
  }, [currentPage]);

  const fetchVariants = async (page) => {
    try {
      const response = await axios.get(`http://localhost:4041/api/variant/all?page=${page}&size=${pageSize}`);
      setVariants(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const handleDeleteClick = (variantId) => {
    setVariantToDelete(variantId); 
    setShowConfirmDeleteModal(true); 
  };

  const deleteVariant = async () => {
    try {
      await axios.delete(`http://localhost:4041/api/variant/delete/${variantToDelete}`);
      fetchVariants(currentPage);
      setShowConfirmDeleteModal(false); 
    } catch (error) {
      console.error("Error deleting variant:", error);
      setShowConfirmDeleteModal(false); 
    }
  };

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-4">
      <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
      <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0} />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item key={index} active={index === currentPage} onClick={() => setCurrentPage(index)}>
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} />
      <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
    </Pagination>
  );

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 text-primary fw-bold">All Car Variants</h2>

      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover responsive className="text-center align-middle shadow-sm">
          <thead style={{ backgroundColor: "#003049", color: "#fff" }}>
            <tr>
              <th>Image</th>
              <th>Variant Name</th>
              <th>Description</th>
              <th>Model Number</th>
              <th>Year</th>
              <th>Fuel Type</th>
              <th>AC</th>
              <th>Seats</th>
              <th>Rent/Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <React.Fragment key={variant.variantId}>
                <tr>
                  <td>
                    <Image
                      src={`http://localhost:4041/imgs/${variant.imageUrl}`}
                      alt="variant"
                      thumbnail
                      className="img-fluid rounded"
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                  </td>
                  <td><span className="fw-semibold text-dark">{variant.variantName}</span></td>
                  <td><span>{variant.variantDesc}</span></td>
                  <td>{variant.modelNumber}</td>
                  <td>{variant.year}</td>
                  <td>{variant.fuelType}</td>
                  <td>{variant.isAc ? "Yes" : "No"}</td>
                  <td>{variant.seatCapacity}</td>
                  <td className="fw-bold text-success">₹{variant.rentPerDay}</td>
                  <td>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div className="d-flex justify-content-center gap-2 w-100">
                        <Link to={`/variantList/update/${variant.variantId}`} className="w-100">
                          <Button variant="outline-warning" size="sm" className="w-100">
                            Update
                          </Button>
                        </Link>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="w-100"
                          onClick={() => handleDeleteClick(variant.variantId)} 
                        >
                          Delete
                        </Button>
                      </div>

                      <Button
                        variant="outline-info"
                        size="sm"
                        className="w-100"
                        onClick={() =>
                          setSelectedVariantId(
                            selectedVariantId === variant.variantId ? null : variant.variantId
                          )
                        }
                      >
                        {selectedVariantId === variant.variantId ? "Hide" : "Vehicle Registraction"}
                      </Button>
                    </div>
                  </td>
                </tr>

                {selectedVariantId === variant.variantId && (
                  <tr>
                    <td colSpan="10">
                      <Collapse in={true}>
                        <div className="p-3 border rounded bg-light">
                          <VariantDetails variant={variant} />
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>

      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this variant?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={deleteVariant}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VariantList;
