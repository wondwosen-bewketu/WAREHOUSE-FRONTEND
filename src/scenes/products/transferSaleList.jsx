import React, { useEffect, useState } from "react";
import { getTransfersToSale } from "../../api/api";
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
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MainCard from "../../ui-component/cards/MainCard";
import CardSecondaryAction from "../../ui-component/cards/CardSecondaryAction";
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

const TransfersToSale = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchTransfers = async (page = 1) => {
    setLoading(true);
    try {
      const { transfersToSale = [], totalPages = 1 } = await getTransfersToSale(
        page,
        searchTerm,
        filterType
      );
      setTransfers(transfersToSale);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching transfers to sale:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers(currentPage);
  }, [currentPage, searchTerm, filterType]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  if (loading) {
    return (
      <MainCard
        title="Transfers to Sale"
        secondary={
          <CardSecondaryAction link={"/addTransfer"} title="Add Transfer" />
        }
      >
        <Root>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            Loading...
          </Box>
        </Root>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Transfers to Sale"
      secondary={
        <CardSecondaryAction link={"/addTransfer"} title="Add Transfer" />
      }
    >
      <Root>
        <TextField
          label="Search by Product Name or Remark"
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
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Quantity to Transfer</StyledTableCell>
                <StyledTableCell>Transfer Type</StyledTableCell>
                <StyledTableCell>Quantity on Sale</StyledTableCell>
                <StyledTableCell>Total Sold Price</StyledTableCell>
                <StyledTableCell>Stock Transfer Number</StyledTableCell>
                <StyledTableCell>Transferred By</StyledTableCell>
                <StyledTableCell>Remark</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer._id}>
                  <TableCell>{transfer.productId?.name || "N/A"}</TableCell>
                  <TableCell>{transfer.quantityToTransfer}</TableCell>
                  <TableCell>{transfer.transferType}</TableCell>
                  <TableCell>{transfer.quantityOnSale}</TableCell>
                  <TableCell>{transfer.totalSoldPrice}</TableCell>
                  <TableCell>{transfer.stockTransferNumber}</TableCell>
                  <TableCell>{transfer.transferredBy?.name || "N/A"}</TableCell>
                  <TableCell>{transfer.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transfers.length}
            rowsPerPage={10}
            page={currentPage - 1}
            onPageChange={(e, page) => setCurrentPage(page + 1)}
          />
        </StyledTableContainer>
      </Root>
    </MainCard>
  );
};

export default TransfersToSale;
