import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { transferSale } from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03a9f4", // Light blue color
    },
  },
});

const TransferToSaleForm = () => {
  const { productId } = useParams(); // Get productId from route params
  const [formData, setFormData] = useState({
    quantityToTransfer: "",
    stockTransferNumber: "",
    remark: "",
  });
  const [stockTransferImage, setStockTransferImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setStockTransferImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { quantityToTransfer, stockTransferNumber, remark } = formData;

    // Validate quantityToTransfer
    const quantity = parseInt(quantityToTransfer, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity to transfer.");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("quantityToTransfer", quantity);
    data.append("stockTransferNumber", stockTransferNumber);
    data.append("remark", remark);
    if (stockTransferImage) {
      data.append("stockTransferImage", stockTransferImage);
    }

    try {
      const result = await transferSale(productId, data);
      console.log("Product transferred successfully:", result);
      toast.success("Product transferred successfully!");
      setFormData({
        quantityToTransfer: "",
        stockTransferNumber: "",
        remark: "",
      });
      setStockTransferImage(null);
    } catch (error) {
      console.error("Error recording sale:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error recording sale!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 800 }}>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              marginBottom: "1rem",
              textAlign: "center",
              marginTop: "4rem",
            }}
          >
            Transfer to Sale
          </Typography>
          <hr
            style={{
              border: "1px solid #ccc",
              width: "100%",
              marginBottom: "1rem",
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="quantityToTransfer"
                name="quantityToTransfer"
                label="Quantity to Transfer"
                type="number"
                value={formData.quantityToTransfer}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="stockTransferNumber"
                name="stockTransferNumber"
                label="Stock Transfer Number"
                value={formData.stockTransferNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="remark"
                name="remark"
                label="Remark"
                value={formData.remark}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="stockTransferImage"
                name="stockTransferImage"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="stockTransferImage">
                <Button variant="outlined" component="span">
                  Upload Stock Transfer Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Transfer to Sale"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default TransferToSaleForm;
