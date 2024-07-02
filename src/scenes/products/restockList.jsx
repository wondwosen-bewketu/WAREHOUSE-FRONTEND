import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  const handleSaleButtonClick = (productId) => {
    navigate(`/restock/${productId}`);
  };

  return (
    <MainCard
      title="Product List"
      secondary={
        <CardSecondaryAction link={"/addProduct"} title="Add Product" />
      }
    >
      <Root>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Product Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} style={{ cursor: "pointer" }}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unitPrice}</TableCell>
                  <TableCell>{product.productPrice}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSaleButtonClick(product._id)}
                    >
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Root>
    </MainCard>
  );
};

export default ProductList;
