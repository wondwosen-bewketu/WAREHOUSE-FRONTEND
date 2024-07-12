import React, { useState } from "react";
import { createWarehouse } from "../../api/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const WarehouseForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createWarehouse(name, location);
      setMessage(response.message);
    } catch (error) {
      setMessage("Error creating warehouse");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Create New Warehouse
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Fill out the form below to create a new warehouse
        </Typography>
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Warehouse Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                bgcolor: "#D19C22",
                color: "white",
                "&:hover": { bgcolor: "#af7c18" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Warehouse"
              )}
            </Button>
          </form>
          {message && (
            <Typography
              variant="body1"
              align="center"
              sx={{
                mt: 2,
                color: message.includes("Error")
                  ? "error.main"
                  : "success.main",
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default WarehouseForm;
