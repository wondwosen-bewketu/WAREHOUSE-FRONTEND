import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchProducts, requestProducts } from "../../api/api"; // Adjust path based on your project structure

const ProductRequestForm = () => {
  const [warehouseId, setWarehouseId] = useState("");
  const [products, setProducts] = useState([{ productId: "", quantity: "" }]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    // Fetch warehouseId from localStorage on component mount
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const warehouseIdFromLocalStorage = parsedUser
      ? parsedUser.warehouse
      : null;

    if (warehouseIdFromLocalStorage) {
      setWarehouseId(warehouseIdFromLocalStorage);
    }

    // Fetch available products for dropdown
    setLoading(true); // Set loading to true when starting product fetch
    fetchProducts()
      .then((data) => {
        setLoading(false); // Set loading to false when fetch completes
        if (Array.isArray(data)) {
          const formattedProducts = data.map((product) => ({
            productId: product._id,
            productName: product.name, // Adjust based on your product schema
          }));
          setAvailableProducts(formattedProducts);
        } else {
          setAvailableProducts([]);
        }
      })
      .catch((error) => {
        setLoading(false); // Set loading to false on fetch error
        setAvailableProducts([]);
      });
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!warehouseId) {
      setMessage("Warehouse ID is missing. Please refresh and try again.");
      return;
    }

    try {
      const productData = {
        warehouseId,
        products,
      };

      setLoading(true); // Set loading to true when submitting request
      const response = await requestProducts(productData);
      setLoading(false); // Set loading to false when request completes
      setMessage(response.message);
    } catch (error) {
      setLoading(false); // Set loading to false on request error
      setMessage("Failed to request products. Please try again.");
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: "" }]);
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
  };

  const handleProductSelect = (index, productId) => {
    const updatedProducts = [...products];
    updatedProducts[index].productId = productId;
    setProducts(updatedProducts);
  };

  return (
    <>
      <IconButton sx={{ mb: 2 }} onClick={() => window.history.back()}>
        <ArrowBackIcon fontSize="large" />
        Back
      </IconButton>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", color: "#1591ea" }}
        >
          Product Request Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
          />
          <Typography variant="h5" sx={{ mb: 2, color: "#1591ea" }}>
            Products:
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : availableProducts.length > 0 ? (
            products.map((product, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                  <InputLabel>Select Product</InputLabel>
                  <Select
                    value={product.productId}
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    label="Select Product"
                  >
                    {availableProducts.map((product) => (
                      <MenuItem
                        key={product.productId}
                        value={product.productId}
                      >
                        {product.productName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Quantity"
                  fullWidth
                  type="number"
                  variant="outlined"
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                />
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="error">
              No products available. Please try again later.
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleAddProduct}
            sx={{
              mb: 2,
              backgroundColor: "#D19C22",
              "&:hover": { backgroundColor: "#B8841C" },
            }}
          >
            Add Product
          </Button>
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#1591ea",
              "&:hover": { backgroundColor: "#127cc1" },
            }}
          >
            Submit Request
          </Button>
        </form>
        {message && (
          <Typography
            variant="body1"
            sx={{ mt: 2, color: message.includes("success") ? "green" : "red" }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ProductRequestForm;
