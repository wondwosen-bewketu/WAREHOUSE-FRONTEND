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
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    backgroundColor: "#1591ea", // Blue background for table head
  },
  tableHeadCell: {
    color: "#ffffff", // White text color
    fontWeight: "bold",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main, // Use secondary color for avatar background
    color: theme.palette.secondary.contrastText, // White text color
    marginRight: theme.spacing(1),
  },
  image: {
    maxWidth: "100px",
    borderRadius: "8px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
  backButton: {
    marginBottom: theme.spacing(2),
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
    <Box sx={{ p: 3 }}>
      <IconButton
        className={classes.backButton}
        onClick={() => window.history.back()}
      >
        <ArrowBackIcon fontSize="large" />
        Back
      </IconButton>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "#1591ea" }}
      >
        Restock Transactions
      </Typography>
      {loading ? (
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>Date</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Quantity
                </TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Product Name
                </TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Category
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Unit</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Unit Price
                </TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Sales User
                </TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Stock Transfer Image
                </TableCell>
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar className={classes.avatar}>
                        {transaction.salesUserId.fullName.charAt(0)}
                      </Avatar>
                      {transaction.salesUserId.fullName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <img
                      src={transaction.stockTransferImage.url}
                      alt="Stock Transfer"
                      className={classes.image}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RestockTransactions;
