// src/components/ProductRequestsByWarehouse.js
import React, { useEffect, useState } from "react";
import { getProductRequestsByWarehouseId } from "../../api/api";

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
    borderBottom: "2px solid #1591ea",
    paddingBottom: "10px",
  },
  noRequests: {
    color: "#888",
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "15px",
    textAlign: "left",
    backgroundColor: "#1591ea",
    color: "#fff",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ddd",
    padding: "15px",
    textAlign: "left",
  },
  status: {
    fontWeight: "bold",
    padding: "5px",
    borderRadius: "4px",
    textAlign: "center",
    display: "inline-block",
    minWidth: "80px",
  },
  statusPending: {
    backgroundColor: "#ffa500",
    color: "#fff",
  },
  statusApproved: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  statusRejected: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  bankSlipLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  bankSlipLinkHover: {
    textDecoration: "underline",
  },
  errorMessage: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  totalPriceContainer: {
    marginTop: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
};

const ProductRequestsByWarehouse = () => {
  const [productRequests, setProductRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductRequests = async () => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError("User data not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userString);
        const warehouseId = user.warehouse;

        if (!warehouseId) {
          setError("Warehouse ID not found in user data.");
          setLoading(false);
          return;
        }

        // Fetch product requests by warehouse ID
        const requests = await getProductRequestsByWarehouseId(warehouseId);
        setProductRequests(requests);
      } catch (error) {
        setError(`Error fetching product requests: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductRequests();
  }, []);

  if (loading) return <p style={styles.container}>Loading...</p>;
  if (error) return <p style={styles.errorMessage}>Error: {error}</p>;

  // Calculate total price
  const totalPrice = productRequests
    .reduce((total, request) => {
      return total + request.quantity * request.product.unitPrice;
    }, 0)
    .toFixed(2);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Product Requests for Warehouse</h2>
      {productRequests.length === 0 ? (
        <p style={styles.noRequests}>No product requests found.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit Price</th>
                <th style={styles.th}>Total Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Bank Slip</th>
              </tr>
            </thead>
            <tbody>
              {productRequests.map((request) => {
                const totalPriceForRequest = (
                  request.quantity * request.product.unitPrice
                ).toFixed(2);
                return (
                  <tr key={request._id}>
                    <td style={styles.td}>{request.product.name}</td>
                    <td style={styles.td}>{request.quantity}</td>
                    <td style={styles.td}>
                      ${request.product.unitPrice.toFixed(2)}
                    </td>
                    <td style={styles.td}>${totalPriceForRequest}</td>
                    <td
                      style={{
                        ...styles.td,
                        ...styles.status,
                        ...styles[
                          `status${
                            request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)
                          }`
                        ],
                      }}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </td>
                    <td style={styles.td}>
                      {request.bankSlip.url ? (
                        <a
                          href={request.bankSlip.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.bankSlipLink}
                          onMouseOver={(e) =>
                            (e.target.style.textDecoration =
                              styles.bankSlipLinkHover.textDecoration)
                          }
                          onMouseOut={(e) =>
                            (e.target.style.textDecoration =
                              styles.bankSlipLink.textDecoration)
                          }
                        >
                          View Bank Slip
                        </a>
                      ) : (
                        "No Bank Slip"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <div style={styles.totalPriceContainer}>
            <strong>Total Price: ${totalPrice}</strong>
          </div> */}
        </>
      )}
    </div>
  );
};

export default ProductRequestsByWarehouse;
