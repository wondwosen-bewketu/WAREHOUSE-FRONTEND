import React, { useState } from "react";
import { transferToSale } from "../../api/api";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";

const TransferToSale = () => {
  const { productId } = useParams();
  const [quantityToTransfer, setQuantityToTransfer] = useState("");
  const [stockTransferNumber, setStockTransferNumber] = useState("");
  const [remark, setRemark] = useState("");
  const [stockTransferImage, setStockTransferImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        quantityToTransfer: parseInt(quantityToTransfer, 10), // Ensure quantity is an integer
        stockTransferNumber,
        remark,
        stockTransferImage,
      };

      const response = await transferToSale(productId, formData);
      toast.success("Stock transfer successful!");
      setQuantityToTransfer("");
      setStockTransferNumber("");
      setRemark("");
      setStockTransferImage(null);
    } catch (error) {
      toast.error(error.error || "Stock transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const StyledContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    marginTop: "-130px",
  }));

  const StyledForm = styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: "800px",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#1591ea",
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  return (
    <StyledContainer>
      <StyledForm component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" color="primary" gutterBottom>
          Product Restock
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Quantity to Transfer"
              value={quantityToTransfer}
              onChange={(e) => setQuantityToTransfer(e.target.value)}
              required
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Stock Transfer Number"
              value={stockTransferNumber}
              onChange={(e) => setStockTransferNumber(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              onChange={(e) => setStockTransferImage(e.target.files[0])}
              accept="image/*"
              style={{ marginTop: 16, marginBottom: 16 }}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledButton
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Transfer to Sale"
              )}
            </StyledButton>
          </Grid>
        </Grid>
      </StyledForm>
      <ToastContainer />
    </StyledContainer>
  );
};

export default TransferToSale;
