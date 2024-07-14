import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getWarehouses } from "../../api/api";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#1e88e5",
  borderRadius: "15px",
  boxShadow: "0 3px 10px 2px rgba(0, 0, 0, .3)",
  height: "200px",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer", // Cursor pointer on hover
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 10px 20px 2px rgba(0, 0, 0, .3)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  color: "#ffffff",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "2rem", // Increased font size for warehouse name
}));

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch warehouses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleWarehouseClick = (warehouseId) => {
    // Assuming opening in a new window for simplicity, you can also use modals or other UI components
    navigate(`/warehouse/${warehouseId}/products`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      {warehouses.map((warehouse) => (
        <Grid item xs={12} sm={6} md={3} key={warehouse._id}>
          <StyledCard onClick={() => handleWarehouseClick(warehouse._id)}>
            <StyledCardContent>
              <StyledTypography variant="h5">{warehouse.name}</StyledTypography>
              <Typography variant="body1" style={{ fontSize: "1.2rem" }}>
                {warehouse.location}
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default WarehouseList;
