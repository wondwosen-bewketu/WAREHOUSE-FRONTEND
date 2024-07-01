import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03a9f4", // Light blue color
    },
  },
});

const TransferToSaleForm = () => {
  const [formData, setFormData] = useState({
    quantityToTransfer: 0,
    stockTransferNumber: "",
    remark: "",
    stockTransferImage: null,
  });
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
    setFormData({
      ...formData,
      stockTransferImage: file,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append("quantityToTransfer", formData.quantityToTransfer);
    formDataToSend.append("stockTransferNumber", formData.stockTransferNumber);
    formDataToSend.append("remark", formData.remark);
   

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
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
    </ThemeProvider>
  );
};

export default TransferToSaleForm;
