import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const StockTransfersTable = () => {
  const [stockTransfers, setStockTransfers] = useState([]);

  //   useEffect(() => {
  //     const fetchStockTransfers = async () => {
  //       try {
  //         const response = await axios.get("/api/stockTransfers");
  //         setStockTransfers(response.data);
  //       } catch (error) {
  //         console.error("Error fetching stock transfers:", error);
  //         console.log("Response:", error.response); // Log the response for debugging
  //       }
  //     };

  //     fetchStockTransfers();
  //   }, []);

  return (
    <TableContainer component={Paper}>
      {stockTransfers.length === 0 ? (
        <Typography variant="h6" align="center" style={{ padding: "1rem" }}>
          No stock transfers found.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transfer Type</TableCell>
              <TableCell>Quantity on Sale</TableCell>
              <TableCell>Total Sold Price</TableCell>
              <TableCell>Stock Transfer Number</TableCell>
              <TableCell>Transferred By</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockTransfers.map((stockTransfer) => (
              <TableRow key={stockTransfer._id}>
                <TableCell>{stockTransfer.transferType}</TableCell>
                <TableCell>{stockTransfer.quantityOnSale}</TableCell>
                <TableCell>{stockTransfer.totalSoldPrice}</TableCell>
                <TableCell>{stockTransfer.stockTransferNumber}</TableCell>
                <TableCell>{stockTransfer.transferredBy}</TableCell>
                <TableCell>{stockTransfer.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default StockTransfersTable;
