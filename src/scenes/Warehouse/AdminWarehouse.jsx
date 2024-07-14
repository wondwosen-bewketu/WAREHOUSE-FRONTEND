import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminsWarehouseProducts } from "../../api/api";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: "#fff",
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user")); // Get admin details from localStorage
  const adminId = admin ? admin._id : null;
  console.log("Admin ID:", adminId);

  useEffect(() => {
    const fetchProducts = async () => {
      if (adminId) {
        try {
          const data = await getAdminsWarehouseProducts(adminId);
          console.log("Fetched data:", data); // Add logging for debugging
          if (data && data.products) {
            // Merge products with the same ID by summing their quantities
            const mergedProducts = data.products.reduce((acc, item) => {
              const existingProduct = acc.find(
                (p) => p.product._id === item.product._id
              );
              if (existingProduct) {
                existingProduct.quantity += item.quantity;
              } else {
                acc.push({ ...item });
              }
              return acc;
            }, []);
            setProducts(mergedProducts);
          } else {
            setError("Products data is not in the expected format");
            console.log("Products data is not in the expected format:", data);
          }
        } catch (error) {
          setError("Error fetching products");
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Admin ID not found");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [adminId]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <StyledBox sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </StyledBox>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" align="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <StyledBox>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <StyledButton
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </StyledButton>
        </Grid>
        <Grid item>
          <Typography variant="h4" gutterBottom align="center">
            Admin Products
          </Typography>
        </Grid>
        <Grid item></Grid>
      </Grid>
      <StyledPaper>
        <Grid container spacing={3}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <StyledCard>
                  <StyledCardHeader title={item.product.name} />
                  <StyledDivider />
                  <CardContent>
                    <Tooltip title="Category" arrow>
                      <Typography variant="body1">
                        <strong>Category:</strong> {item.product.category}
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Quantity" arrow>
                      <Typography variant="body1">
                        <strong>Quantity:</strong> {item.quantity}
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Unit" arrow>
                      <Typography variant="body1">
                        <strong>Unit:</strong> {item.product.unit}
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Unit Price" arrow>
                      <Typography variant="body1">
                        <strong>Unit Price:</strong> $
                        {item.product.unitPrice.toFixed(2)}
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Description" arrow>
                      <Typography variant="body1">
                        <strong>Description:</strong> {item.product.description}
                      </Typography>
                    </Tooltip>
                    {item.product.purchaseReceiptImage && (
                      <Box mb={1}>
                        <Typography variant="body1">
                          <strong>Purchase Receipt:</strong>
                        </Typography>
                        <img
                          src={item.product.purchaseReceiptImage.url}
                          alt="Purchase Receipt"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    )}
                    {item.product.grnImage && (
                      <Box>
                        <Typography variant="body1">
                          <strong>GRN Image:</strong>
                        </Typography>
                        <img
                          src={item.product.grnImage.url}
                          alt="GRN Image"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    )}
                    <StyledDivider />
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
    </StyledBox>
  );
};

export default AdminProducts;
