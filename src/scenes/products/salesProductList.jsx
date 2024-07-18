import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { fetchSalesByUser } from "../../api/api"; // Import the API function

const SalesByUser = () => {
  const [sales, setSales] = useState(null); // Initialize sales as null
  const history = useNavigate(); // For navigation

  useEffect(() => {
    // Retrieve user ID from localStorage
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))._id
      : null;

    if (userId) {
      fetchSalesData(userId);
    } else {
      console.error("User ID not found in localStorage");
      // Handle the case where user ID is not found (e.g., redirect to login)
    }
  }, []);

  const fetchSalesData = async (userId) => {
    try {
      const salesData = await fetchSalesByUser(userId);
      // Check if salesData is an array
      if (Array.isArray(salesData)) {
        setSales(salesData);
      } else {
        console.error("Sales data is not an array:", salesData);
        // Handle case where salesData is not an array (e.g., show error message)
        setSales([]); // Set sales to an empty array or handle differently based on your app's logic
      }
    } catch (error) {
      // Handle error if needed (e.g., show error message to user)
      console.error("Error fetching sales:", error);
    }
  };

  const handleBackClick = () => {
    history("/dashboard");
  };

  // While waiting for data to load, display a loading spinner
  if (sales === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Handle case where sales is an empty array
  if (sales.length === 0) {
    return <Typography>No sales data found.</Typography>;
  }

  // Combine all products into a single array
  const allProducts = sales.flatMap((sale) => sale.products);

  return (
    <Container maxWidth="xl" style={{ marginTop: "20px", padding: "20px" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>
      <Paper
        style={{
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#1591ea" }}>
                <TableCell style={{ color: "#ffffff" }}>Product Name</TableCell>
                <TableCell style={{ color: "#ffffff" }}>Category</TableCell>
                <TableCell style={{ color: "#ffffff" }}>Quantity</TableCell>
                <TableCell style={{ color: "#ffffff" }}>Unit</TableCell>
                <TableCell style={{ color: "#ffffff" }}>Unit Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.product.name}</TableCell>
                  <TableCell>{product.product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.product.unit}</TableCell>
                  <TableCell>
                    {product.product.unitPrice
                      ? `${product.product.unitPrice.toFixed(2)}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default SalesByUser;
