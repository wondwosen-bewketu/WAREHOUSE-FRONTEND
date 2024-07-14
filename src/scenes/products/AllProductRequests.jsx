import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
} from "@mui/material";
import { fetchProductRequests } from "../../api/api"; // Adjust the path based on your project structure

const ProductRequests = () => {
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchProductRequests();
        setProductRequests(data);
      } catch (error) {
        setError("Failed to fetch product requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        p: 3,
        backgroundColor: "#f0f0f0", // Optional: add background color
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Product Requests
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productRequests.map((request) => (
              <TableRow
                key={request._id}
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={request.product.image}
                      alt={request.product.name}
                      sx={{ mr: 2 }}
                    />
                    {request.product.name}
                  </Box>
                </TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{request.warehouse.name}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)
                    }
                    color={
                      request.status === "pending"
                        ? "warning"
                        : request.status === "approved"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductRequests;
