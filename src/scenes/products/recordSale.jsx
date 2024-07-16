import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { fetchSalesByUser, recordSale } from "../../api/api";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    padding: "20px",
  },
  paper: {
    padding: "30px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  formControl: {
    marginBottom: "20px",
    "& label": {
      color: "#1591ea",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#1591ea",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#1591ea",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#1591ea",
    },
  },
  button: {
    background: "#1591ea",
    color: "#fff",
    "&:hover": {
      background: "#0d6fb8",
    },
  },
  input: {
    display: "none",
  },
  fileLabel: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#fff",
    color: "#1591ea",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      background: "#0d6fb8",
    },
  },
}));

const SalesForm = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sivImage, setSivImage] = useState(null);
  const [sivNumber, setSivNumber] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
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
      setProducts(salesData.flatMap((sale) => sale.products));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSaleRecord = async () => {
    if (!selectedProduct || !quantity || !sivImage || !sivNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("productId", selectedProduct);
    formData.append("quantity", quantity);
    formData.append("sivImage", sivImage);
    formData.append("sivNumber", sivNumber);
    formData.append(
      "salesUserId",
      JSON.parse(localStorage.getItem("user"))._id
    ); // Ensure salesUserId is sent

    try {
      console.log("Sale Data:", formData); // Log formData before sending

      const response = await recordSale(formData); // Use recordSale with formData
      console.log("Sale recorded successfully:", response);

      toast.success("Sale recorded successfully!");
      // Optionally, clear form fields or update state after successful sale recording
      setSelectedProduct("");
      setQuantity(1);
      setSivImage(null);
      setSivNumber("");
    } catch (error) {
      console.error("Error recording sale:", error);
      toast.error("Failed to record sale. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSivImage(file);
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Record Sale
      </Typography>
      <Paper className={classes.paper}>
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>Select Product</InputLabel>
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map((product) => (
              <MenuItem key={product.product._id} value={product.product._id}>
                {product.product.name} - Available: {product.quantity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          className={classes.formControl}
        />
        <TextField
          fullWidth
          label="SIV Number"
          value={sivNumber}
          onChange={(e) => setSivNumber(e.target.value)}
          className={classes.formControl}
        />
        <FormControl fullWidth className={classes.formControl}>
          <input
            accept="image/*"
            className={classes.input}
            id="sivImage"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="sivImage" className={classes.fileLabel}>
            {sivImage ? sivImage.name : "Upload SIV Image"}
          </label>
        </FormControl>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleSaleRecord}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Recording Sale..." : "Record Sale"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SalesForm;
