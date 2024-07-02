import React, { useState } from "react";
import { transferToSale } from "../../api/api";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const styles = {
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f0f8ff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    form: {
      width: "100%",
      maxWidth: "500px",
    },
    button: {
      backgroundColor: "#1976d2",
      color: "#fff",
    },
    input: {
      margin: "16px 0",
    },
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Typography variant="h5" color="primary" gutterBottom>
          Product Restock
        </Typography>
        <TextField
          label="Quantity to Transfer"
          value={quantityToTransfer}
          onChange={(e) => setQuantityToTransfer(e.target.value)}
          required
          fullWidth
          margin="normal"
          type="number"
          style={styles.input}
        />
        <TextField
          label="Stock Transfer Number"
          value={stockTransferNumber}
          onChange={(e) => setStockTransferNumber(e.target.value)}
          required
          fullWidth
          margin="normal"
          style={styles.input}
        />
        <TextField
          label="Remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          fullWidth
          margin="normal"
          style={styles.input}
        />
        <input
          type="file"
          onChange={(e) => setStockTransferImage(e.target.files[0])}
          accept="image/*"
          style={styles.input}
        />
        <Button
          type="submit"
          variant="contained"
          style={styles.button}
          disabled={loading}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Transfer to Sale"
          )}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TransferToSale;
