import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import { fetchSalesRecordsByUserId } from "../../api/api";

const SalesRecordDisplay = () => {
  const [salesRecords, setSalesRecords] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))._id
      : null;

    if (userId) {
      fetchSalesRecordsByUserId(userId)
        .then((data) => {
          if (data && data.saleRecords) {
            setSalesRecords(data.saleRecords);
          } else {
            setSalesRecords([]); // Ensure salesRecords is an array
          }
        })
        .catch((error) => {
          console.error("Error fetching sales records:", error);
          setSalesRecords([]); // Set an empty array on error
        });
    }
  }, []);

  const cellStyles = {
    fontWeight: "bold",
    backgroundColor: "#1976d2",
    color: "white",
  };

  const rowStyles = {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f5f5f5",
    },
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sold Records
      </Typography>
      <Typography variant="subtitle1">
        View detailed records of all sold products.
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={cellStyles}>Product Name</TableCell>
              <TableCell style={cellStyles}>Category</TableCell>
              <TableCell style={{ ...cellStyles, textAlign: "center" }}>
                Unit
              </TableCell>
              <TableCell style={{ ...cellStyles, textAlign: "right" }}>
                Unit Price
              </TableCell>
              <TableCell style={{ ...cellStyles, textAlign: "right" }}>
                Quantity
              </TableCell>
              <TableCell style={{ ...cellStyles, textAlign: "right" }}>
                SIV Number
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesRecords.length > 0 ? (
              salesRecords.map((record, index) => (
                <TableRow key={index} style={rowStyles}>
                  <TableCell>{record.product.name}</TableCell>
                  <TableCell>{record.product.category}</TableCell>
                  <TableCell align="center">{record.product.unit}</TableCell>
                  <TableCell align="right">
                    ${record.product.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{record.quantity}</TableCell>
                  <TableCell align="right">{record.sivNumber}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body1" align="center">
                    No sales records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SalesRecordDisplay;
