import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { loginUserAsync } from "../../redux/slice/userSlice";
import backgroundImage from "./warehouse-management-system-hero-img-01-1.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(loginUserAsync({ phoneNumber, password }));
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to log in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={0}>
          {/* Left side: Background Image */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={backgroundImage}
              alt="Background"
              sx={{
                width: "100%",
                maxHeight: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                animation: "float 5s infinite alternate",
                "@keyframes float": {
                  "0%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-10px)" },
                  "100%": { transform: "translateY(0)" },
                },
              }}
            />
          </Grid>
          {/* Right side: Login Form */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                maxWidth: "400px",
                width: "100%",
                textAlign: "center",
                animation: "fadeIn 1s ease-in",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ marginBottom: "1rem", fontWeight: 600 }}
              >
                Welcome
              </Typography>
              <form onSubmit={handleLogin} style={{ width: "100%" }}>
                <TextField
                  fullWidth
                  margin="normal"
                  required
                  label="Phone Number"
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  required
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {error && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ marginTop: "0.5rem", marginBottom: "1rem" }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: "1rem" }}
              >
                Don't have an account? Sign up{" "}
                <a
                  href="/signup"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  here
                </a>
                .
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LoginPage;
