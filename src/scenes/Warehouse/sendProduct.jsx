// SendProductForm.jsx
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  styled,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  sendProductToWarehouse,
  getWarehouses,
  fetchProducts,
} from "../../api/api"; // Adjust the import path as necessary

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
}));

const SendProductForm = () => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    warehouseId: "",
  });
  const [sending, setSending] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, warehousesData] = await Promise.all([
          fetchProducts(),
          getWarehouses(),
        ]);
        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (error) {
        toast.error("Error fetching products or warehouses. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await sendProductToWarehouse(formData);
      toast.success("Product sent to warehouse successfully!");
      setFormData({
        productId: "",
        quantity: "",
        warehouseId: "",
      });
    } catch (error) {
      toast.error("Error sending product to warehouse. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography
          component="h1"
          variant="h5"
          style={{ color: "#1591ea", marginBottom: "1rem" }}
        >
          Send Product to Warehouse
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="product-label">Product</InputLabel>
                <Select
                  labelId="product-label"
                  label="Product"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="warehouse-label">Warehouse</InputLabel>
                <Select
                  labelId="warehouse-label"
                  label="Warehouse"
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                  required
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#1591ea", color: "white" }}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Product"}
          </Button>
        </form>
      </StyledPaper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        draggable
        closeOnClick
      />
    </Container>
  );
};

export default SendProductForm;
