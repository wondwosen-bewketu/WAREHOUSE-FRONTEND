import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const ProductTransfersList = () => {
  const [productTransfers, setProductTransfers] = useState([]);

  // useEffect(() => {
  //   const fetchProductTransfers = async () => {
  //     try {
  //       const response = await axios.get("/api/productTransfers");
  //       setProductTransfers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching product transfers:", error);
  //       console.log("Response:", error.response); // Log the response for debugging
  //     }
  //   };

  //   fetchProductTransfers();
  // }, []);

  return (
    <TableContainer component={Paper}>
      {productTransfers.length === 0 ? (
        <Typography variant="h6" align="center" style={{ padding: "1rem" }}>
          No stock transfers found
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transfer Type</TableCell>
              <TableCell>Quantity on Sale</TableCell>
              <TableCell>Total Sold Price</TableCell>
              <TableCell>Stock Transfer Number</TableCell>
              <TableCell>Transferred By</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productTransfers.map((productTransfer) => (
              <TableRow key={productTransfer._id}>
                <TableCell>{productTransfer.transferType}</TableCell>
                <TableCell>{productTransfer.quantityOnSale}</TableCell>
                <TableCell>{productTransfer.totalSoldPrice}</TableCell>
                <TableCell>{productTransfer.stockTransferNumber}</TableCell>
                <TableCell>{productTransfer.transferredBy}</TableCell>
                <TableCell>{productTransfer.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default ProductTransfersList;
