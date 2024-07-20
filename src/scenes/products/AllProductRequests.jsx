import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  fetchProductRequests,
  approveProductRequest,
  rejectProductRequest,
} from "../../api/api";
import { useSnackbar } from "notistack";

const ProductRequests = () => {
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchProductRequests();
        setProductRequests(data);
      } catch (error) {
        setError("Failed to fetch product requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async () => {
    try {
      await approveProductRequest(selectedRequest._id);
      setProductRequests(
        productRequests.map((request) =>
          request._id === selectedRequest._id
            ? { ...request, status: "approved" }
            : request
        )
      );
      enqueueSnackbar("Product request approved successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to approve product request", {
        variant: "error",
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectProductRequest(selectedRequest._id);
      setProductRequests(
        productRequests.map((request) =>
          request._id === selectedRequest._id
            ? { ...request, status: "rejected" }
            : request
        )
      );
      enqueueSnackbar("Product request rejected successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to reject product request", { variant: "error" });
    }
  };

  const openConfirmationDialog = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setSelectedRequest(null);
    setActionType("");
    setConfirmationDialogOpen(false);
  };

  const confirmAction = () => {
    if (actionType === "approve") {
      handleApprove();
    } else if (actionType === "reject") {
      handleReject();
    }
    closeConfirmationDialog();
  };

  const openDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogOpen(false);
  };

  const calculateTotalPrice = (quantity, unitPrice) => {
    return quantity * unitPrice;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        p: 3,
        backgroundColor: "#f0f0f0",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Product Requests
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Bank Slip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productRequests.map((request) => (
              <TableRow
                key={request._id}
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={request.product.image}
                      alt={request.product.name}
                      sx={{ mr: 2 }}
                    />
                    {request.product.name}
                  </Box>
                </TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{request.product.unitPrice}</TableCell>
                <TableCell>
                  {calculateTotalPrice(
                    request.quantity,
                    request.product.unitPrice
                  ).toFixed(2)}
                </TableCell>
                <TableCell>{request.warehouse.name}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)
                    }
                    color={
                      request.status === "pending"
                        ? "warning"
                        : request.status === "approved"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          openConfirmationDialog(request, "approve")
                        }
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          openConfirmationDialog(request, "reject")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {request.bankSlip && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openDialog(request)}
                    >
                      View Bank Slip
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              {/* <TableCell colSpan={3}>
                <Typography variant="h6">Total</Typography>
              </TableCell> */}
              {/* <TableCell>
                <Typography variant="h6">
                  {productRequests
                    .reduce(
                      (acc, request) =>
                        acc +
                        calculateTotalPrice(
                          request.quantity,
                          request.product.unitPrice
                        ),
                      0
                    )
                    .toFixed(2)}
                </Typography>
              </TableCell> */}
              <TableCell colSpan={5} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to show bank slip */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Bank Slip</DialogTitle>
        <DialogContent>
          {selectedRequest && selectedRequest.bankSlip && (
            <img
              src={selectedRequest.bankSlip.url}
              alt="Bank Slip"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {actionType} this product request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAction} color="secondary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductRequests;
