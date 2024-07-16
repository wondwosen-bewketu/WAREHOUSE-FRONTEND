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
} from "@mui/material";
import { fetchSalesByUser } from "../../api/api"; // Import the API function

const SalesByUser = () => {
  const [sales, setSales] = useState(null); // Initialize sales as null

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
        // For example:
        setSales([]); // Set sales to an empty array or handle differently based on your app's logic
      }
    } catch (error) {
      // Handle error if needed (e.g., show error message to user)
      console.error("Error fetching sales:", error);
    }
  };

  // While waiting for data to load, display a loading message
  if (sales === null) {
    return <Typography>Loading...</Typography>;
  }

  // Handle case where sales is an empty array
  if (sales.length === 0) {
    return <Typography>No sales data found.</Typography>;
  }

  return (
    <Container maxWidth="xl" style={{ marginTop: "20px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>
      {sales.map((sale) => (
        <Paper key={sale._id} style={{ marginBottom: "20px", padding: "20px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Unit Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.product.name}</TableCell>
                    <TableCell>{product.product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.product.unit}</TableCell>
                    <TableCell>
                      {product.product.unitPrice
                        ? `$${product.product.unitPrice.toFixed(2)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Container>
  );
};

export default SalesByUser;
