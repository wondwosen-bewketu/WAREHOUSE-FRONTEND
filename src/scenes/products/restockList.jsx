import React, { useState, useEffect } from "react";
import { getRestockTransactionsByWarehouse } from "../../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material"; // Importing components from @mui/material

import { makeStyles } from "@mui/styles"; // Import makeStyles from @mui/styles for Material-UI v5

// Custom styles using makeStyles from Material-UI
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 12,
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.15)",
    padding: theme.spacing(2),
    backgroundColor: "#f7f7f7", // Light gray background
    marginBottom: theme.spacing(3),
  },
  tableHead: {
    backgroundColor: "#e0e0e0", // Gray background for table head
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main, // Use secondary color for avatar background
    color: theme.palette.secondary.contrastText, // White text color
  },
}));

const RestockTransactions = () => {
  const classes = useStyles(); // Custom styles hook
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state

  const user = JSON.parse(localStorage.getItem("user")); // Get user details from localStorage
  const warehouseId = user ? user.warehouse : null;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getRestockTransactionsByWarehouse(
          warehouseId
        );
        setTransactions(fetchedTransactions);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching restock transactions:", error);
        setLoading(false); // Ensure loading state is updated on error
      }
    };

    if (warehouseId) {
      fetchTransactions();
    }
  }, [warehouseId]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Restock Transactions
      </Typography>
      {loading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Sales User</TableCell>
                <TableCell>Stock Transfer Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.productId.name}</TableCell>
                  <TableCell>{transaction.productId.category}</TableCell>
                  <TableCell>{transaction.productId.unit}</TableCell>
                  <TableCell>${transaction.productId.unitPrice}</TableCell>
                  <TableCell>
                    <Avatar className={classes.avatar}>
                      {transaction.salesUserId.fullName.charAt(0)}
                    </Avatar>
                    {transaction.salesUserId.fullName}
                  </TableCell>
                  <TableCell>
                    <img
                      src={transaction.stockTransferImage.url}
                      alt="Stock Transfer"
                      style={{ maxWidth: "100px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RestockTransactions;
