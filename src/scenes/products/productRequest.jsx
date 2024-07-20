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
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchProducts, requestProducts } from "../../api/api";

const ProductRequestForm = () => {
  const [warehouseId, setWarehouseId] = useState("");
  const [products, setProducts] = useState([
    { productId: "", quantity: "", unitPrice: 0 },
  ]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bankSlip, setBankSlip] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const warehouseIdFromLocalStorage = parsedUser
      ? parsedUser.warehouse
      : null;

    if (warehouseIdFromLocalStorage) {
      setWarehouseId(warehouseIdFromLocalStorage);
    }

    setLoading(true);
    fetchProducts()
      .then((data) => {
        setLoading(false);
        if (Array.isArray(data)) {
          const formattedProducts = data.map((product) => ({
            productId: product._id,
            productName: product.name,
            unitPrice: product.unitPrice,
          }));
          setAvailableProducts(formattedProducts);
        } else {
          setAvailableProducts([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAvailableProducts([]);
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!warehouseId) {
      setMessage("Warehouse ID is missing. Please refresh and try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("warehouseId", warehouseId);
      products.forEach((product, index) => {
        formData.append(`products[${index}][productId]`, product.productId);
        formData.append(`products[${index}][quantity]`, product.quantity);
      });

      // Append bank slip separately
      if (bankSlip) {
        formData.append("bankSlip", bankSlip);
      }

      setLoading(true);
      const response = await requestProducts(formData);
      setLoading(false);
      setMessage(response.message);
    } catch (error) {
      setLoading(false);
      setMessage("Failed to request products. Please try again.");
      console.error("Error requesting products:", error);
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: "", unitPrice: 0 }]);
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
    calculateTotalPrice(); // Update total price when product quantity changes
  };

  const handleProductSelect = (index, productId) => {
    const selectedProduct = availableProducts.find(
      (product) => product.productId === productId
    );
    const updatedProducts = [...products];
    updatedProducts[index].productId = productId;
    updatedProducts[index].unitPrice = selectedProduct
      ? selectedProduct.unitPrice
      : 0;
    setProducts(updatedProducts);
    calculateTotalPrice(); // Update total price when product is selected
  };

  const handleFileChange = (e) => {
    setBankSlip(e.target.files[0]);
  };

  const calculateTotalPrice = () => {
    const total = products.reduce(
      (sum, product) => sum + product.unitPrice * product.quantity,
      0
    );
    setTotalPrice(total);
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
              <Card
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                }}
              >
                <CardContent>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                    <InputLabel>Select Product</InputLabel>
                    <Select
                      value={product.productId}
                      onChange={(e) =>
                        handleProductSelect(index, e.target.value)
                      }
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
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, fontWeight: "bold", color: "#1591ea" }}
                  >
                    Unit Price: {product.unitPrice.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" color="error">
              No products available. Please try again later.
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddProduct}
              sx={{
                backgroundColor: "#D19C22",
                "&:hover": { backgroundColor: "#B8841C" },
              }}
            >
              Add Product
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1591ea",
                "&:hover": { backgroundColor: "#127cc1" },
              }}
              onClick={calculateTotalPrice}
            >
              Calculate Total Price
            </Button>
          </Box>
          <TextField
            label="Bank Slip"
            fullWidth
            type="file"
            inputProps={{ accept: "image/*" }}
            variant="outlined"
            onChange={handleFileChange}
            sx={{ mb: 1 }}
          />
          {totalPrice > 0 && (
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#1591ea",
                color: "#fff",
                textAlign: "center",
                borderRadius: 1,
              }}
            >
              Total Price: {totalPrice.toFixed(2)}
            </Typography>
          )}
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
