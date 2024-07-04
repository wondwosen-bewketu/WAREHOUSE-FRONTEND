import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { fetchProducts } from "../../api/api";
import { useNavigate } from "react-router-dom";
import MainCard from "../../ui-component/cards/MainCard";
import CardSecondaryAction from "../../ui-component/cards/CardSecondaryAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    };

    getProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
    setPage(0); // Reset page when filters change
  };

  const handleSaleButtonClick = (productId) => {
    navigate(`/recordsale/${productId}`);
  };

  const handleRestockButtonClick = (productId) => {
    navigate(`/restock/${productId}`);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) =>
      (prevPage + 1) * rowsPerPage < filteredProducts.length
        ? prevPage + 1
        : prevPage
    );
  };

  return (
    <MainCard
      title="Product List"
      style={{
        flexGrow: 1,
        padding: "16px",
        background: "#f0f2f5",
      }}
      secondary={
        <CardSecondaryAction link={"/addProduct"} title="Add Product" />
      }
    >
      <Paper
        style={{
          marginTop: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#ffffff",
          overflowX: "auto",
        }}
      >
        <div style={{ padding: "16px" }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <FormControl
            variant="outlined"
            fullWidth
            style={{ marginBottom: "16px" }}
          >
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {[...new Set(products.map((product) => product.category))].map(
                (category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                    }}
                  >
                    Unit Price
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                    }}
                  >
                    Product Price
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#1591ea",
                      color: "#ffffff",
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product._id} style={{ cursor: "pointer" }}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.quantityOnSale}</TableCell>
                      <TableCell>{product.unitPrice}</TableCell>
                      <TableCell>{product.totalSoldPrice}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#1591ea",
                            color: "#ffffff",
                            margin: "4px",
                          }}
                          onClick={() => handleSaleButtonClick(product._id)}
                        >
                          Sale
                        </Button>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#1591ea",
                            color: "#ffffff",
                            margin: "4px",
                          }}
                          onClick={() => handleRestockButtonClick(product._id)}
                        >
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <IconButton onClick={handlePreviousPage} disabled={page === 0}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2">
          Page {page + 1} of {Math.ceil(filteredProducts.length / rowsPerPage)}
        </Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={(page + 1) * rowsPerPage >= filteredProducts.length}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </MainCard>
  );
};

export default ProductList;
