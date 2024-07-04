import { useState } from "react";
import { useDispatch } from "react-redux";
import MainCard from "../../ui-component/cards/MainCard";
import SecondaryAction from "../../ui-component/cards/CardSecondaryAction";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { CardContent } from "@mui/material";
import { addProductAsync } from "../../redux/slice/productSlice"; // Adjust the path based on your project structure
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles({
  formContainer: {
    padding: "1rem",
    backgroundColor: "#f4f6f8",
    borderRadius: "8px",
  },
  formField: {
    marginBottom: "1rem",
  },
  submitButton: {
    marginTop: "1.5rem",
  },
  header: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  fileInputLabel: {
    display: "block",
    marginTop: "0.5rem",
    padding: "10px",
    border: "2px dashed #ccc",
    borderRadius: "4px",
    textAlign: "center",
    cursor: "pointer",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "150px",
    marginTop: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
});

const AddProduct = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [grnImage, setGrnImage] = useState(null);
  const [purchaseReceiptImage, setPurchaseReceiptImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    unitPrice: 0,
    description: "",
    warehouseLocation: "",
    barcode: "",
    grnNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleGrnImageChange = (e) => {
    const file = e.target.files[0];
    setGrnImage(file);
  };

  const handlePurchaseReceiptImageChange = (e) => {
    const file = e.target.files[0];
    setPurchaseReceiptImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("category", formValues.category);
      formData.append("quantity", formValues.quantity);
      formData.append("unit", formValues.unit);
      formData.append("unitPrice", formValues.unitPrice);
      formData.append("description", formValues.description);
      formData.append("warehouseLocation", formValues.warehouseLocation);
      formData.append("barcode", formValues.barcode);
      formData.append("grnNumber", formValues.grnNumber);
      if (grnImage) formData.append("grnImage", grnImage);
      if (purchaseReceiptImage)
        formData.append("purchaseReceiptImage", purchaseReceiptImage);

      await dispatch(addProductAsync(formData));

      toast.success("Product added successfully!");

      setFormValues({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        unitPrice: 0,
        description: "",
        warehouseLocation: "",
        barcode: "",
        grnNumber: "",
      });
      setGrnImage(null);
      setPurchaseReceiptImage(null);
    } catch (error) {
      toast.error("Error adding product. Please try again.");
      console.error("Error adding product:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainCard
      title="Add Product"
      secondary={<SecondaryAction link={"/listProduct"} />}
    >
      <CardContent>
        <form onSubmit={handleSubmit} className={classes.formContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Product Name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="category"
                name="category"
                label="Category"
                value={formValues.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="quantity"
                name="quantity"
                label="Quantity"
                type="number"
                value={formValues.quantity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="unit"
                name="unit"
                label="Unit"
                value={formValues.unit}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="unitPrice"
                name="unitPrice"
                label="Unit Price"
                type="number"
                value={formValues.unitPrice}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                value={formValues.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="warehouseLocation"
                name="warehouseLocation"
                label="Warehouse Location"
                value={formValues.warehouseLocation}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="barcode"
                name="barcode"
                label="Barcode"
                value={formValues.barcode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <TextField
                fullWidth
                id="grnNumber"
                name="grnNumber"
                label="GRN Number"
                value={formValues.grnNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <input
                accept="image/*"
                label="GRN Image"
                className={classes.fileInput}
                id="grnImage"
                type="file"
                onChange={handleGrnImageChange}
                required
              />
              <label htmlFor="grnImage" className={classes.fileInputLabel}>
                Upload GRN Image
              </label>
              {grnImage && (
                <img
                  src={URL.createObjectURL(grnImage)}
                  alt="GRN Preview"
                  className={classes.previewImage}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.formField}>
              <input
                accept="image/*"
                className={classes.fileInput}
                id="purchaseReceiptImage"
                type="file"
                onChange={handlePurchaseReceiptImageChange}
                required
              />
              <label
                htmlFor="purchaseReceiptImage"
                className={classes.fileInputLabel}
              >
                Upload Purchase Receipt Image
              </label>
              {purchaseReceiptImage && (
                <img
                  src={URL.createObjectURL(purchaseReceiptImage)}
                  alt="Purchase Receipt Preview"
                  className={classes.previewImage}
                />
              )}
            </Grid>
            <Grid item xs={12} className={classes.submitButton}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Product"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </MainCard>
  );
};

export default AddProduct;
