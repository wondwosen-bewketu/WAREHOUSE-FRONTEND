import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postUserAsync } from "../../redux/slice/userSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0", // Light background
}));

const RegisterUserForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "", // Default role
    warehouseId: "", // Default to empty string
  });
  const [loading, setLoading] = useState(false);

  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.warehouse) {
      setFormData((prevData) => ({
        ...prevData,
        warehouseId: user.warehouse,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = { ...formData };
      await dispatch(postUserAsync(dataToSend));
      toast.success("User registered successfully!");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "",
        warehouseId: "", // Reset warehouseId after successful registration
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
      toast.error("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography
          component="h1"
          variant="h5"
          style={{ color: "#1591ea", marginBottom: "1rem" }}
        >
          Register User
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="manager">Stock Manager</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#1591ea", color: "white" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </StyledPaper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        draggable
        closeOnClick
      />
    </Container>
  );
};

export default RegisterUserForm;
