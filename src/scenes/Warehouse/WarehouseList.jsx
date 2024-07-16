import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetchWarehouses } from "../../api/api";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "20px",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
  height: "250px",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.3)",
  },
  "&:hover::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  color: theme.palette.text.primary,
  position: "relative",
  zIndex: 2,
  background: "linear-gradient(45deg, #f3f3f3 30%, #fafafa 90%)",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "2.5rem",
  color: "#1e88e5",
  marginBottom: "10px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const StyledLocation = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: "#1e88e5",
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)",
}));

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const warehousesPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehousess = async () => {
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch warehouses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehousess();
  }, []);

  const handleWarehouseClick = (warehouseId) => {
    navigate(`/warehouse/${warehouseId}/products`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = warehouses.slice(
    indexOfFirstWarehouse,
    indexOfLastWarehouse
  );

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={80} />
      </LoadingContainer>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        sx={{
          color: "#1e88e5",
          fontWeight: "bold",
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.1)",
          mb: 5,
        }}
      >
        Warehouses
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {currentWarehouses.map((warehouse) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={warehouse._id}>
            <StyledCard onClick={() => handleWarehouseClick(warehouse._id)}>
              <StyledCardContent>
                <StyledTypography variant="h5">
                  {warehouse.name}
                </StyledTypography>
                <StyledLocation variant="body1">
                  {warehouse.location}
                </StyledLocation>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(warehouses.length / warehousesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default WarehouseList;
