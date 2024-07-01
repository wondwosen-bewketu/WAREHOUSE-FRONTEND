import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03a9f4", // Light blue color
    },
  },
});

const TransferToSaleForm = () => {
  const formik = useFormik({
    initialValues: {
      productId: "",
      quantityToTransfer: 0,
      stockTransferNumber: "",
      transferredBy: "",
      remark: "",
      stockTransferImage: null,
    },
    validationSchema: Yup.object({
      productId: Yup.string().required("Product ID is required"),
      quantityToTransfer: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      stockTransferNumber: Yup.string().required(
        "Stock Transfer Number is required"
      ),
      transferredBy: Yup.string().required("Transferred By is required"),
      remark: Yup.string(),
      stockTransferImage: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("productId", values.productId);
      formData.append("quantityToTransfer", values.quantityToTransfer);
      formData.append("stockTransferNumber", values.stockTransferNumber);
      formData.append("transferredBy", values.transferredBy);
      formData.append("remark", values.remark);
      if (values.stockTransferImage) {
        formData.append("stockTransferImage", values.stockTransferImage);
      }

      try {
        const response = await axios.post("/api/transferToSale", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Transfer to sale successful:", response.data);
        // Handle success (e.g., show confirmation to user)
      } catch (error) {
        console.error("Error transferring to sale:", error);
        // Handle error (e.g., show error message to user)
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={formik.handleSubmit}>
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
              id="productId"
              name="productId"
              label="Product ID"
              value={formik.values.productId}
              onChange={formik.handleChange}
              error={
                formik.touched.productId && Boolean(formik.errors.productId)
              }
              helperText={formik.touched.productId && formik.errors.productId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="quantityToTransfer"
              name="quantityToTransfer"
              label="Quantity to Transfer"
              type="number"
              value={formik.values.quantityToTransfer}
              onChange={formik.handleChange}
              error={
                formik.touched.quantityToTransfer &&
                Boolean(formik.errors.quantityToTransfer)
              }
              helperText={
                formik.touched.quantityToTransfer &&
                formik.errors.quantityToTransfer
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="stockTransferNumber"
              name="stockTransferNumber"
              label="Stock Transfer Number"
              value={formik.values.stockTransferNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.stockTransferNumber &&
                Boolean(formik.errors.stockTransferNumber)
              }
              helperText={
                formik.touched.stockTransferNumber &&
                formik.errors.stockTransferNumber
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="transferredBy"
              name="transferredBy"
              label="Transferred By"
              value={formik.values.transferredBy}
              onChange={formik.handleChange}
              error={
                formik.touched.transferredBy &&
                Boolean(formik.errors.transferredBy)
              }
              helperText={
                formik.touched.transferredBy && formik.errors.transferredBy
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="remark"
              name="remark"
              label="Remark"
              value={formik.values.remark}
              onChange={formik.handleChange}
              error={formik.touched.remark && Boolean(formik.errors.remark)}
              helperText={formik.touched.remark && formik.errors.remark}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="stockTransferImage"
              name="stockTransferImage"
              type="file"
              onChange={(event) =>
                formik.setFieldValue(
                  "stockTransferImage",
                  event.currentTarget.files[0]
                )
              }
            />
            <label htmlFor="stockTransferImage">
              <Button variant="outlined" component="span">
                Upload Stock Transfer Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Transfer to Sale
            </Button>
          </Grid>
        </Grid>
      </form>
    </ThemeProvider>
  );
};

export default TransferToSaleForm;
