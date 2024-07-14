import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWarehouseById } from "../../api/api";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const data = await getWarehouseById(id);
        setWarehouse(data.warehouse);
      } catch (error) {
        setError("Error fetching warehouse details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  const handleBack = () => {
    navigate("/WarehouseList"); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
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
    <Box sx={{ p: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="h4" gutterBottom align="center">
            Warehouse Details
          </Typography>
        </Grid>
        <Grid item></Grid>
      </Grid>
      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Basic Information" />
              <Divider />
              <CardContent>
                <Typography variant="body1">
                  <strong>Name:</strong> {warehouse.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {warehouse.location}
                </Typography>
                <Typography variant="body1">
                  <strong>Created At:</strong>{" "}
                  {format(new Date(warehouse.createdAt), "MMMM dd, yyyy")}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Updated:</strong>{" "}
                  {format(new Date(warehouse.updatedAt), "MMMM dd, yyyy")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Products in Warehouse" />
              <Divider />
              <CardContent>
                {warehouse.products.map((item) => (
                  <Box key={item._id} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Product Name:</strong> {item.product.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Quantity:</strong> {item.quantity}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Category:</strong> {item.product.category}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Unit:</strong> {item.product.unit}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Unit Price:</strong> $
                      {item.product.unitPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Description:</strong> {item.product.description}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WarehouseDetails;
