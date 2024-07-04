import React, { useEffect, useState } from "react";
import { getTransfersToSale } from "../../api/api";
import "../../Styles/TransferToSale.css";

const TransfersToSale = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchTransfers = async (page = 1) => {
    setLoading(true);
    try {
      const { transfersToSale, totalPages } = await getTransfersToSale(
        page,
        searchTerm,
        filterType
      );
      setTransfers(transfersToSale);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching transfers to sale:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers(currentPage);
  }, [currentPage, searchTerm, filterType]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Transfers to Sale</h2>
      <div className="filters" style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by Product Name or Remark..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            marginRight: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            width: "300px",
          }}
        />
        <select
          value={filterType}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            width: "200px",
          }}
        >
          <option value="">Filter by Transfer Type</option>
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </select>
      </div>
      <div className="responsive-table">
        <div className="table-header">
          <div>Product Name</div>
          <div>Quantity to Transfer</div>
          <div>Transfer Type</div>
          <div>Quantity on Sale</div>
          <div>Total Sold Price</div>
          <div>Stock Transfer Number</div>
          <div>Transferred By</div>
          <div>Remark</div>
        </div>
        {transfers.map((transfer) => (
          <div className="table-row" key={transfer._id}>
            <div>{transfer.productId.name}</div>
            <div>{transfer.quantityToTransfer}</div>
            <div>{transfer.transferType}</div>
            <div>{transfer.quantityOnSale}</div>
            <div>{transfer.totalSoldPrice}</div>
            <div>{transfer.stockTransferNumber}</div>
            <div>
              {transfer.transferredBy ? transfer.transferredBy.name : "N/A"}
            </div>
            <div>{transfer.remark}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
            style={{
              padding: "8px",
              margin: "4px",
              cursor: "pointer",
              backgroundColor: currentPage === number + 1 ? "#1591ea" : "#fff",
              color: currentPage === number + 1 ? "#fff" : "#1591ea",
              border: "1px solid #1591ea",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransfersToSale;
