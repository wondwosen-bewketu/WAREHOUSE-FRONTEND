import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  transferProductToSales,
  getAdminsWarehouseProducts,
  fetchSalesUsersByWarehouse,
} from "../../api/api"; // Adjust path as per your project structure
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
}));

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const inputStyle = {
  marginBottom: "1rem",
};

const buttonStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  backgroundColor: "#1591ea",
  color: "white",
  cursor: "pointer",
};

const selectStyle = {
  marginBottom: "1rem",
  cursor: "pointer",
};

const TransferProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    warehouseId: "", // Initialize warehouseId state
    salesUserId: "",
    location: "",
    stockTransferNumber: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError("User data not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userString);
        const warehouseId = user.warehouse;

        if (!warehouseId) {
          setError("Warehouse ID not found in user data.");
          setLoading(false);
          return;
        }

        // Set warehouseId in formData state
        setFormData((prevFormData) => ({
          ...prevFormData,
          warehouseId: warehouseId,
        }));

        const response = await getAdminsWarehouseProducts(user._id);
        if (response.products) {
          const productsList = response.products.map((item) => item.product);
          setProducts(productsList);
        } else {
          console.error("No products found in response");
        }

        const salesUsersData = await fetchSalesUsersByWarehouse(warehouseId);
        setSalesUsers(salesUsersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (
      !formData.productId ||
      !formData.quantity ||
      !formData.salesUserId ||
      !formData.location ||
      !formData.stockTransferNumber
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (image) {
      data.append("stockTransferImage", image);
    }

    try {
      const response = await transferProductToSales(data);
      setMessage(response.message);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
      >
        Back
      </Button>
      <Container component="main" maxWidth="md">
        <StyledPaper elevation={3}>
          <Typography
            component="h1"
            variant="h5"
            style={{ color: "#1591ea", marginBottom: "1rem" }}
          >
            Transfer Products To Sales
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            {error && (
              <Typography style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </Typography>
            )}
            <FormControl fullWidth style={selectStyle}>
              <InputLabel id="product-label">Select Product</InputLabel>
              <Select
                labelId="product-label"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              >
                <MenuItem value="" disabled>
                  Select Product
                </MenuItem>
                {Array.isArray(products) && products.length > 0 ? (
                  products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No products available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              type="number"
              name="quantity"
              label="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={inputStyle}
              required
              fullWidth
            />
            <FormControl fullWidth style={selectStyle}>
              <InputLabel id="sales-user-label">Select Sales User</InputLabel>
              <Select
                labelId="sales-user-label"
                name="salesUserId"
                value={formData.salesUserId}
                onChange={handleChange}
                required
              >
                <MenuItem value="" disabled>
                  Select Sales User
                </MenuItem>
                {salesUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="text"
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              style={inputStyle}
              required
              fullWidth
            />
            <TextField
              type="text"
              name="stockTransferNumber"
              label="Stock Transfer Number"
              value={formData.stockTransferNumber}
              onChange={handleChange}
              style={inputStyle}
              required
              fullWidth
            />
            <Button variant="contained" component="label" style={inputStyle}>
              Upload Stock Transfer Image
              <input
                type="file"
                name="stockTransferImage"
                onChange={handleFileChange}
                hidden
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={buttonStyle}
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Transfer Product"
              )}
            </Button>
            {message && (
              <Typography
                style={{
                  textAlign: "center",
                  color: message.includes("successfully") ? "green" : "red",
                  marginTop: "1rem",
                }}
              >
                {message}
              </Typography>
            )}
          </StyledForm>
        </StyledPaper>
      </Container>
    </>
  );
};

export default TransferProduct;
