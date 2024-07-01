import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, Typography, MenuItem } from "@mui/material"; // Import MenuItem from Material-UI
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

const RecordSaleForm = () => {
  const formik = useFormik({
    initialValues: {
      product: "",
      quantitySold: 0,
      transactionType: "sale",
      sivNumber: "",
      soledBy: "",
      sivImage: null,
    },
    validationSchema: Yup.object({
      product: Yup.string().required("Product is required"),
      quantitySold: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      transactionType: Yup.string().required("Transaction type is required"),
      sivNumber: Yup.string().required("SIV Number is required"),
      soledBy: Yup.string().required("Sold By is required"),
      sivImage: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("product", values.product);
      formData.append("quantitySold", values.quantitySold);
      formData.append("transactionType", values.transactionType);
      formData.append("sivNumber", values.sivNumber);
      formData.append("soledBy", values.soledBy);
      if (values.sivImage) {
        formData.append("sivImage", values.sivImage);
      }

      try {
        const response = await axios.post("/api/recordSale", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Sale recorded successfully:", response.data);
        // Handle success (e.g., show confirmation to user)
      } catch (error) {
        console.error("Error recording sale:", error);
        // Handle error (e.g., show error message to user)
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Record Sale
        </Typography>
        <hr
          style={{
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "1rem",
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="product"
              name="product"
              label="Product"
              value={formik.values.product}
              onChange={formik.handleChange}
              error={formik.touched.product && Boolean(formik.errors.product)}
              helperText={formik.touched.product && formik.errors.product}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="quantitySold"
              name="quantitySold"
              label="Quantity Sold"
              type="number"
              value={formik.values.quantitySold}
              onChange={formik.handleChange}
              error={
                formik.touched.quantitySold &&
                Boolean(formik.errors.quantitySold)
              }
              helperText={
                formik.touched.quantitySold && formik.errors.quantitySold
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="transactionType"
              name="transactionType"
              label="Transaction Type"
              select
              value={formik.values.transactionType}
              onChange={formik.handleChange}
              error={
                formik.touched.transactionType &&
                Boolean(formik.errors.transactionType)
              }
              helperText={
                formik.touched.transactionType && formik.errors.transactionType
              }
            >
              <MenuItem value="sale">Sale</MenuItem>
              <MenuItem value="return">Return</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="sivNumber"
              name="sivNumber"
              label="SIV Number"
              value={formik.values.sivNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.sivNumber && Boolean(formik.errors.sivNumber)
              }
              helperText={formik.touched.sivNumber && formik.errors.sivNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="soledBy"
              name="soledBy"
              label="Sold By"
              value={formik.values.soledBy}
              onChange={formik.handleChange}
              error={formik.touched.soledBy && Boolean(formik.errors.soledBy)}
              helperText={formik.touched.soledBy && formik.errors.soledBy}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="sivImage"
              name="sivImage"
              type="file"
              onChange={(event) =>
                formik.setFieldValue("sivImage", event.currentTarget.files[0])
              }
            />
            <label htmlFor="sivImage">
              <Button variant="outlined" component="span">
                Upload SIV Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Record Sale
            </Button>
          </Grid>
        </Grid>
      </form>
    </ThemeProvider>
  );
};

export default RecordSaleForm;
