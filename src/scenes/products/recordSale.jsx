import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { recordSale } from "../../api/api"; // Adjust the import path as needed

const SalesForm = () => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    salesUserId: "",
    sivNumber: "",
    transactionType: "",
    sivImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await recordSale(formData);
      setSuccess(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 3, width: "90%", maxWidth: "600px" }}>
        <Typography variant="h4" gutterBottom>
          Record a Sale
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="productId"
            label="Product ID"
            fullWidth
            margin="normal"
            value={formData.productId}
            onChange={handleChange}
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantity}
            onChange={handleChange}
          />
          <TextField
            name="salesUserId"
            label="Sales User ID"
            fullWidth
            margin="normal"
            value={formData.salesUserId}
            onChange={handleChange}
          />
          <TextField
            name="sivNumber"
            label="SIV Number"
            fullWidth
            margin="normal"
            value={formData.sivNumber}
            onChange={handleChange}
          />
          <TextField
            name="transactionType"
            label="Transaction Type"
            fullWidth
            margin="normal"
            value={formData.transactionType}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload SIV Image
            <input type="file" name="sivImage" hidden onChange={handleChange} />
          </Button>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {success && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">{success}</Alert>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Record Sale
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SalesForm;
