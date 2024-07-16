// src/components/RestockForm.js
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
import { makeStyles } from "@mui/styles";
import {
  fetchSalesByUser,
  restockProduct,
  fetchWarehouses,
} from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
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

const RestockForm = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stockTransferImage, setStockTransferImage] = useState(null);
  const [stockTransferNumber, setStockTransferNumber] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [loading, setLoading] = useState(false);

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

    fetchWarehouseData();
  }, []);

  const fetchSalesData = async (userId) => {
    try {
      const salesData = await fetchSalesByUser(userId);
      setProducts(salesData.flatMap((sale) => sale.products));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchWarehouseData = async () => {
    try {
      const warehouseData = await fetchWarehouses();
      setWarehouses(warehouseData);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleRestock = async () => {
    if (
      !selectedProduct ||
      !quantity ||
      !stockTransferImage ||
      !stockTransferNumber ||
      !selectedWarehouse
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("productId", selectedProduct);
    formData.append("quantity", quantity);
    formData.append("stockTransferImage", stockTransferImage);
    formData.append("stockTransferNumber", stockTransferNumber);
    formData.append(
      "salesUserId",
      JSON.parse(localStorage.getItem("user"))._id
    );
    formData.append("warehouseId", selectedWarehouse);

    try {
      const response = await restockProduct(formData);
      toast.success("Product restocked successfully!");
      // Optionally, clear form fields or update state after successful restock
      setSelectedProduct("");
      setQuantity(1);
      setStockTransferImage(null);
      setStockTransferNumber("");
      setSelectedWarehouse("");
    } catch (error) {
      toast.error("Failed to restock product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setStockTransferImage(file);
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Restock Product
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
          label="Stock Transfer Number"
          value={stockTransferNumber}
          onChange={(e) => setStockTransferNumber(e.target.value)}
          className={classes.formControl}
        />
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>Select Warehouse</InputLabel>
          <Select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse._id} value={warehouse._id}>
                {warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <input
            accept="image/*"
            className={classes.input}
            id="stockTransferImage"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="stockTransferImage" className={classes.fileLabel}>
            {stockTransferImage
              ? stockTransferImage.name
              : "Upload Stock Transfer Image"}
          </label>
        </FormControl>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleRestock}
            disabled={loading}
          >
            {loading ? "Restocking..." : "Restock Product"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RestockForm;
