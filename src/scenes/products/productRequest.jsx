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
} from "@mui/material";
import { fetchProducts, requestProducts } from "../../api/api"; // Adjust path based on your project structure

const ProductRequestForm = () => {
  const [warehouseId, setWarehouseId] = useState("");
  const [products, setProducts] = useState([{ productId: "", quantity: "" }]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch warehouseId from localStorage on component mount
    const user = localStorage.getItem("user");
    console.log("Raw user from localStorage:", user);
    const parsedUser = user ? JSON.parse(user) : null;
    const warehouseIdFromLocalStorage = parsedUser
      ? parsedUser.warehouse
      : null;

    console.log("Parsed user from localStorage:", parsedUser);
    console.log("Warehouse ID from localStorage:", warehouseIdFromLocalStorage);
    if (warehouseIdFromLocalStorage) {
      setWarehouseId(warehouseIdFromLocalStorage);
    }

    // Fetch available products for dropdown
    fetchProducts()
      .then((data) => {
        console.log("Fetched products data:", data);
        if (Array.isArray(data)) {
          const formattedProducts = data.map((product) => ({
            productId: product._id,
            productName: product.name, // Adjust based on your product schema
          }));
          setAvailableProducts(formattedProducts);
        } else {
          console.error("No products found in response:", data);
          setAvailableProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error.message);
        setAvailableProducts([]);
      });
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting request with warehouseId:", warehouseId);
    if (!warehouseId) {
      setMessage("Warehouse ID is missing. Please refresh and try again.");
      return;
    }

    try {
      const productData = {
        warehouseId,
        products,
      };

      console.log("Product data to be submitted:", JSON.stringify(productData));

      const response = await requestProducts(productData);
      console.log("Response from requestProducts:", response);
      setMessage(response.message);
    } catch (error) {
      console.error("Error requesting products:", error.message);
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
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Product Request Form
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Warehouse ID is not displayed to the user */}
        <input
          type="hidden"
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
        />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Products:
        </Typography>
        {availableProducts.length > 0 ? (
          products.map((product, index) => (
            <div key={index} style={{ marginBottom: 12 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={product.productId}
                  onChange={(e) => handleProductSelect(index, e.target.value)}
                  label="Select Product"
                >
                  {availableProducts.map((product) => (
                    <MenuItem key={product.productId} value={product.productId}>
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
                sx={{ mb: 2 }}
              />
            </div>
          ))
        ) : (
          <Typography variant="body1" color="error">
            No products available. Please try again later.
          </Typography>
        )}
        <Button variant="contained" onClick={handleAddProduct} sx={{ mb: 2 }}>
          Add Product
        </Button>
        <br />
        <Button type="submit" variant="contained" color="primary">
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
  );
};

export default ProductRequestForm;
