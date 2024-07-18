import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MainCard from "../../ui-component/cards/MainCard";
import CardSecondaryAction from "../../ui-component/cards/CardSecondaryAction";
import { fetchProducts } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  backgroundColor: "#1591ea",
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1591ea",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data || []);
      setFilteredProducts(data || []); // Initialize filteredProducts with all products
    };

    getProducts();
  }, []);

  useEffect(() => {
    // Filter products based on searchTerm
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaleButtonClick = (productId) => {
    navigate(`/restock/${productId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <MainCard
      title="Products From Stock to Warehouse History"
      secondary={
        <CardSecondaryAction link={"/addProduct"} title="Add Product" />
      }
    >
      <Root>
        <TextField
          label="Search by Product Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Unit Price</StyledTableCell>
                <StyledTableCell>Product Price</StyledTableCell>
                {/* <StyledTableCell>Action</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product._id} style={{ cursor: "pointer" }}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unitPrice}</TableCell>
                    <TableCell>{product.productPrice}</TableCell>
                    {/* <TableCell>
                      <StyledButton
                        variant="contained"
                        onClick={() => handleSaleButtonClick(product._id)}
                      >
                        Restock
                      </StyledButton>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </StyledTableContainer>
      </Root>
    </MainCard>
  );
};

export default ProductList;
