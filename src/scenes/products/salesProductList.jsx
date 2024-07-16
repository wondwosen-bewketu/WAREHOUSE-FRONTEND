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
  const [sales, setSales] = useState([]);

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
      setSales(salesData);
    } catch (error) {
      // Handle error if needed (e.g., show error message to user)
      console.error("Error fetching sales:", error);
    }
  };

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
