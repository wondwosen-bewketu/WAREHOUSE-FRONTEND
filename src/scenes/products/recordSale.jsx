import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, Typography, MenuItem } from "@mui/material";
import { recordSale } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03a9f4",
    },
  },
});

const RecordSaleForm = () => {
  const { productId } = useParams(); // Get productId from route params
  const [formData, setFormData] = useState({
    quantitySold: 0,
    transactionType: "sale",
    sivNumber: "",
  });
  const [sivImage, setSivImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSIVImageChange = (event) => {
    const file = event.target.files[0];
    setSivImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("product", productId); // Append productId from route params
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (sivImage) {
      data.append("sivImage", sivImage);
    }

    try {
      const result = await recordSale(productId, data); // Pass productId to recordSale function
      console.log("Sale recorded successfully:", result);
      toast.success("Sale recorded successfully!");
      setFormData({
        quantitySold: 0,
        transactionType: "sale",
        sivNumber: "",
      });
    } catch (error) {
      console.error("Error recording sale:", error);
      toast.error("Error recording sale!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
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
              marginTop: "2rem",
            }}
          >
            Record Sale
          </Typography>
          <hr
            style={{
              border: "1px solid #ccc",
              width: "100%",
              marginBottom: "4rem",
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="quantitySold"
                name="quantitySold"
                label="Quantity Sold"
                type="number"
                value={formData.quantitySold}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 0 } }} // Ensure non-negative quantity
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="transactionType"
                name="transactionType"
                label="Transaction Type"
                select
                value={formData.transactionType}
                onChange={handleChange}
                required
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
                value={formData.sivNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="sivImage"
                name="sivImage"
                type="file"
                onChange={handleSIVImageChange}
                required
              />
              <label htmlFor="sivImage">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  style={{ marginTop: "1rem" }}
                >
                  Upload SIV Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                fullWidth
                style={{ marginTop: "1rem" }}
              >
                {isSubmitting ? "Submitting..." : "Record Sale"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default RecordSaleForm;
