import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MainCard from "../../ui-component/cards/MainCard";
import CardSecondaryAction from "../../ui-component/cards/CardSecondaryAction";
import { fetchProducts } from "../../api/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  margin: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[10],
  },
  background: theme.palette.background.paper,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1591ea",
  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  marginBottom: theme.spacing(1),
}));

const CardContentText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const Actions = styled(CardActions)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1),
}));

const DetailButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const QRCodeContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1,
}));

const DialogTitleWrapper = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const DialogContentWrapper = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const DialogGrid = styled(Grid)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const DialogImage = styled("img")(({ theme }) => ({
  maxWidth: "200px",
  height: "200px",
  cursor: "pointer",
  borderRadius: theme.spacing(1),
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const PaginationContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: theme.spacing(2),
}));

const PaginationButton = styled(IconButton)(({ theme }) => ({
  color: "#1591ea",
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) =>
      (prevPage + 1) * rowsPerPage < products.length ? prevPage + 1 : prevPage
    );
  };

  return (
    <MainCard
      title="Product List"
      secondary={
        <CardSecondaryAction link={"/addProduct"} title="Add Product" />
      }
    >
      <Root>
        <Grid container spacing={2} justifyContent="center">
          {products
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  <QRCodeContainer>
                    <p value={product.barcode} size={48} />
                  </QRCodeContainer>
                  <CardContent>
                    <CardTitle>{product.name}</CardTitle>
                    <CardContentText>
                      Category: {product.category}
                    </CardContentText>
                    <CardContentText>
                      Quantity: {product.quantity}
                    </CardContentText>
                    <CardContentText>
                      Unit Price: {product.unitPrice}
                    </CardContentText>
                    <CardContentText>
                      Product Price: {product.productPrice}
                    </CardContentText>
                  </CardContent>
                  <Actions>
                    <DetailButton
                      variant="outlined"
                      onClick={() => handleOpenDialog(product)}
                    >
                      Detail
                    </DetailButton>
                    {/* <IconButton aria-label="edit" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" color="secondary">
                      <Delete />
                    </IconButton> */}
                  </Actions>
                </StyledCard>
              </Grid>
            ))}
        </Grid>
        <PaginationContainer>
          <PaginationButton onClick={handlePreviousPage} disabled={page === 0}>
            <ArrowBackIcon />
          </PaginationButton>
          <Typography variant="body2">
            Page {page + 1} of {Math.ceil(products.length / rowsPerPage)}
          </Typography>
          <PaginationButton
            onClick={handleNextPage}
            disabled={(page + 1) * rowsPerPage >= products.length}
          >
            <ArrowForwardIcon />
          </PaginationButton>
        </PaginationContainer>
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogTitleWrapper>Product Details</DialogTitleWrapper>
          <DialogContentWrapper dividers>
            {selectedProduct && (
              <DialogGrid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">{selectedProduct.name}</Typography>
                  <Typography>Category: {selectedProduct.category}</Typography>
                  <Typography>Quantity: {selectedProduct.quantity}</Typography>
                  <Typography>Unit: {selectedProduct.unit}</Typography>
                  <Typography>
                    Unit Price: {selectedProduct.unitPrice}
                  </Typography>
                  <Typography>
                    Product Price: {selectedProduct.productPrice}
                  </Typography>
                  <Typography>
                    Description: {selectedProduct.description}
                  </Typography>
                  <Typography>
                    Warehouse Location: {selectedProduct.warehouseLocation}
                  </Typography>
                  <Typography>Barcode: {selectedProduct.barcode}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectedProduct.grnImage && (
                    <DialogImage
                      src={selectedProduct.grnImage.url}
                      alt="GRN"
                      onClick={() => window.open(selectedProduct.grnImage.url)}
                    />
                  )}
                  {selectedProduct.purchaseReceiptImage && (
                    <DialogImage
                      src={selectedProduct.purchaseReceiptImage.url}
                      alt="Purchase Receipt"
                      onClick={() =>
                        window.open(selectedProduct.purchaseReceiptImage.url)
                      }
                    />
                  )}
                </Grid>
              </DialogGrid>
            )}
          </DialogContentWrapper>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </MainCard>
  );
};

export default ProductList;
