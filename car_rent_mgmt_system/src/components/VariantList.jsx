// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table, Button, Image, Container, Pagination, Collapse, Modal,
//   Alert, Spinner, Badge
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import VariantDetails from "./VariantDetails";

// const VariantList = () => {
//   const [variants, setVariants] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedVariantId, setSelectedVariantId] = useState(null);
//   const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
//   const [variantToDelete, setVariantToDelete] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const pageSize = 3;

//   useEffect(() => {
//     fetchVariants(currentPage);
//   }, [currentPage]);

//   const fetchVariants = async (page) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`http://localhost:4041/api/variant/all?page=${page}&size=${pageSize}`);
//       setVariants(response.data.content);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching variants:", error);
//       setError("Failed to fetch variants. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClick = (variantId) => {
//     setVariantToDelete(variantId);
//     setShowConfirmDeleteModal(true);
//   };

//   const deleteVariant = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(`http://localhost:4041/api/variant/delete/${variantToDelete}`);
//       fetchVariants(currentPage);
//       setSuccess("Variant deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting variant:", error);
//       setError("Failed to delete variant. Please try again.");
//     } finally {
//       setLoading(false);
//       setShowConfirmDeleteModal(false);
//     }
//   };

//   const renderPagination = () => (
//     <Pagination className="justify-content-center mt-4">
//       <Pagination.First
//         onClick={() => setCurrentPage(0)}
//         disabled={currentPage === 0 || loading}
//       />
//       <Pagination.Prev
//         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
//         disabled={currentPage === 0 || loading}
//       />
//       {[...Array(totalPages)].map((_, index) => (
//         <Pagination.Item
//           key={index}
//           active={index === currentPage}
//           onClick={() => !loading && setCurrentPage(index)}
//           disabled={loading}
//         >
//           {index + 1}
//         </Pagination.Item>
//       ))}
//       <Pagination.Next
//         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
//         disabled={currentPage === totalPages - 1 || loading}
//       />
//       <Pagination.Last
//         onClick={() => setCurrentPage(totalPages - 1)}
//         disabled={currentPage === totalPages - 1 || loading}
//       />
//     </Pagination>
//   );

//   const getFuelTypeBadge = (fuelType) => {
//     switch (fuelType.toLowerCase()) {
//       case 'petrol': return 'primary';
//       case 'diesel': return 'warning';
//       case 'electric': return 'success';
//       case 'hybrid': return 'info';
//       default: return 'secondary';
//     }
//   };

//   return (
//     <Container className="mt-5 mb-5">
//       {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

//       <h2 className="text-center mb-4 text-primary fw-bold">
//         <i className="bi bi-car-front me-2"></i>All Car Variants
//       </h2>

//       {loading && variants.length === 0 ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading variants...</p>
//         </div>
//       ) : variants.length === 0 ? (
//         <Alert variant="info" className="text-center">
//           No variants found. Please add some variants to display.
//         </Alert>
//       ) : (
//         <div className="table-responsive">
//           <Table striped bordered hover responsive className="text-center align-middle shadow-sm">
//             <thead style={{ backgroundColor: "#003049", color: "#fff" }}>
//               <tr>
//                 <th>Image</th>
//                 <th>Variant Name</th>
//                 <th>Description</th>
//                 <th>Model</th>
//                 <th>Year</th>
//                 <th>Fuel</th>
//                 <th>AC</th>
//                 <th>Seats</th>
//                 <th>Rent/Day</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {variants.map((variant) => (
//                 <React.Fragment key={variant.variantId}>
//                   <tr>
//                     <td>
//                       <Image
//                         src={`http://localhost:4041/imgs/${variant.imageUrl}`}
//                         alt={variant.variantName}
//                         thumbnail
//                         className="img-fluid rounded shadow-sm"
//                         style={{
//                           maxWidth: "150px",
//                           height: "auto",
//                           border: "2px solid #dee2e6"
//                         }}
//                       />
//                     </td>
//                     <td>
//                       <span className="fw-semibold text-dark">
//                         {variant.variantName
//                           .toLowerCase()
//                           .split(' ')
//                           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                           .join(' ')
//                         }
//                       </span>

//                     </td>
//                     <td>
//                       <small className="text-muted">{variant.variantDesc}</small>
//                     </td>
//                     <td>
//                       <Badge bg="secondary" className="px-2 py-1">
//                         {variant.modelNumber}
//                       </Badge>
//                     </td>
//                     <td>
//                       <span className="fw-semibold">{variant.year}</span>
//                     </td>
//                     <td>
//                       <Badge bg={getFuelTypeBadge(variant.fuelType)} className="px-2 py-1 text-capitalize">
//                         {variant.fuelType}
//                       </Badge>
//                     </td>
//                     <td>
//                       {variant.isAc ? (
//                         <Badge bg="success" className="px-2 py-1">Yes</Badge>
//                       ) : (
//                         <Badge bg="secondary" className="px-2 py-1">No</Badge>
//                       )}
//                     </td>
//                     <td>
//                       <Badge bg="info" className="px-2 py-1">
//                         {variant.seatCapacity} Seats
//                       </Badge>
//                     </td>
//                     <td className="fw-bold text-success">
//                       ₹{variant.rentPerDay}
//                     </td>
//                     <td>
//                       <div className="d-flex flex-column align-items-center gap-2">
//                         <div className="d-flex justify-content-center gap-2 w-100">
//                           <Link to={`/variantList/update/${variant.variantId}`} className="w-100">
//                             <Button
//                               variant="outline-warning"
//                               size="sm"
//                               className="w-100 d-flex align-items-center justify-content-center"
//                               disabled={loading}
//                             >
//                               <i className="bi bi-pencil-square me-1"></i>Update
//                             </Button>
//                           </Link>

//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             className="w-100 d-flex align-items-center justify-content-center"
//                             onClick={() => handleDeleteClick(variant.variantId)}
//                             disabled={loading}
//                           >
//                             <i className="bi bi-trash me-1"></i>Delete
//                           </Button>
//                         </div>

//                         <Button
//                           variant={selectedVariantId === variant.variantId ? "outline-secondary" : "outline-primary"}
//                           size="sm"
//                           className="w-100 d-flex align-items-center justify-content-center"
//                           onClick={() =>
//                             setSelectedVariantId(
//                               selectedVariantId === variant.variantId ? null : variant.variantId
//                             )
//                           }
//                           disabled={loading}
//                         >
//                           <i className="bi bi-car-front me-1"></i>
//                           {selectedVariantId === variant.variantId ? "Hide" : "Add Registraction Number"}
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>

//                   {selectedVariantId === variant.variantId && (
//                     <tr>
//                       <td colSpan="10">
//                         <Collapse in={true}>
//                           <div className="p-3 border rounded bg-light shadow-sm">
//                             <VariantDetails variant={variant} />
//                           </div>
//                         </Collapse>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </Table>

//           {renderPagination()}
//         </div>
//       )}

//       <Modal
//         show={showConfirmDeleteModal}
//         onHide={() => !loading && setShowConfirmDeleteModal(false)}
//         centered
//       >
//         <Modal.Header closeButton className="bg-danger text-white">
//           <Modal.Title>
//             <i className="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="lead">Are you sure you want to delete this variant?</p>
//           <p className="text-muted">This action cannot be undone.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmDeleteModal(false)}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={deleteVariant}
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner as="span" animation="border" size="sm" role="status" />
//             ) : (
//               'Yes, Delete'
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default VariantList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, Button, Image, Container, Pagination, Collapse, Modal,
  Alert, Spinner, Badge
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
      />
      <Pagination.Prev
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
        disabled={currentPage === 0 || loading}
      />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index}
          active={index === currentPage}
          onClick={() => !loading && setCurrentPage(index)}
          disabled={loading}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1 || loading}
      />
      <Pagination.Last
        onClick={() => setCurrentPage(totalPages - 1)}
        disabled={currentPage === totalPages - 1 || loading}
      />
    </Pagination>
  );

  const getFuelTypeBadge = (fuelType) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return 'primary';
      case 'diesel': return 'warning';
      case 'electric': return 'success';
      case 'hybrid': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Container className="mt-3 mb-5 px-0 px-md-3">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <h2 className="text-center mb-4 text-primary fw-bold">
        <i className="bi bi-car-front me-2"></i>All Car Variants
      </h2>

      {loading && variants.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading variants...</p>
        </div>
      ) : variants.length === 0 ? (
        <Alert variant="info" className="text-center">
          No variants found. Please add some variants to display.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive="sm" className="text-center align-middle shadow-sm">
            <thead style={{ backgroundColor: "#003049", color: "#fff" }}>
              <tr>
                <th className="d-none d-md-table-cell">Image</th>
                <th>Variant</th>
                <th className="d-none d-lg-table-cell">Details</th>
                <th className="d-none d-sm-table-cell">Rent/Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <React.Fragment key={variant.variantId}>
                  <tr>
                    <td className="d-none d-md-table-cell">
                      <Image
                        src={`http://localhost:4041/imgs/${variant.imageUrl}`}
                        alt={variant.variantName}
                        thumbnail
                        className="img-fluid rounded shadow-sm"
                        style={{
                          maxWidth: "150px",
                          height: "auto",
                          border: "2px solid #dee2e6"
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">
                          {variant.variantName
                            .toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                          }
                        </span>
                        <small className="text-muted d-md-none">{variant.modelNumber}</small>
                        <div className="d-flex gap-2 justify-content-center d-md-none mt-1">
                          <Badge bg={getFuelTypeBadge(variant.fuelType)} className="px-2 py-1 text-capitalize">
                            {variant.fuelType}
                          </Badge>
                          <Badge bg="info" className="px-2 py-1">
                            {variant.seatCapacity} Seats
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <div className="text-start">
                        <div><strong>Model:</strong> {variant.modelNumber}</div>
                        <div><strong>Year:</strong> {variant.year}</div>
                        <div><strong>Fuel:</strong> <Badge bg={getFuelTypeBadge(variant.fuelType)}>{variant.fuelType}</Badge></div>
                        <div><strong>AC:</strong> {variant.isAc ? 'Yes' : 'No'}</div>
                        <div><strong>Seats:</strong> {variant.seatCapacity}</div>
                      </div>
                    </td>
                    <td className="d-none d-sm-table-cell fw-bold text-success">
                      ₹{variant.rentPerDay}
                    </td>
                    <td>
                      <div className="d-flex flex-column align-items-center gap-2">
                        <div className="d-flex justify-content-center gap-2 w-100">
                          <Link to={`/variantList/update/${variant.variantId}`} className="w-100">
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="w-100 d-flex align-items-center justify-content-center"
                              disabled={loading}
                            >
                              <i className="bi bi-pencil-square me-1 d-none d-md-inline"></i>
                              <span>Update</span>
                            </Button>
                          </Link>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="w-100 d-flex align-items-center justify-content-center"
                            onClick={() => handleDeleteClick(variant.variantId)}
                            disabled={loading}
                          >
                            <i className="bi bi-trash me-1 d-none d-md-inline"></i>
                            <span>Delete</span>
                          </Button>
                        </div>

                        <Button
                          variant={selectedVariantId === variant.variantId ? "outline-secondary" : "outline-primary"}
                          size="sm"
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={() =>
                            setSelectedVariantId(
                              selectedVariantId === variant.variantId ? null : variant.variantId
                            )
                          }
                          disabled={loading}
                        >
                          <i className="bi bi-car-front me-1 d-none d-md-inline"></i>
                          <span>{selectedVariantId === variant.variantId ? "Hide" : "Details"}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {selectedVariantId === variant.variantId && (
                    <tr>
                      <td colSpan="5" className="p-0">
                        <Collapse in={true}>
                          <div className="p-3 border rounded bg-light shadow-sm">
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
      )}

      <Modal
        show={showConfirmDeleteModal}
        onHide={() => !loading && setShowConfirmDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">Are you sure you want to delete this variant?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteVariant}
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              'Yes, Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VariantList;