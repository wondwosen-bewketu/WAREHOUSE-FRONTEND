import React, { useEffect, useState } from "react";
import { getTransfersToSale } from "../../api/api";
import {
  Box,
  Button,
  InputBase,
  Paper,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
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
    <Paper className="container">
      <Typography variant="h2" className="title">
        Transfers to Sale
      </Typography>
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
          <div className="search-filter">
            <InputBase
              placeholder="Search by Product Name or Remark..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <Select
              value={filterType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <MenuItem value="">Filter by Transfer Type</MenuItem>
              <MenuItem value="Internal">Internal</MenuItem>
              <MenuItem value="External">External</MenuItem>
            </Select>
          </div>
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
          <Button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            variant="contained"
            className={currentPage === number + 1 ? "active" : ""}
          >
            {number + 1}
          </Button>
        ))}
      </div>
    </Paper>
  );
};

export default TransfersToSale;
