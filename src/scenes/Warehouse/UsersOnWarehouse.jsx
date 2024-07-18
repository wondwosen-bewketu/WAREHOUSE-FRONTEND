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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Import the API functions
import { fetchUsersByWarehouse, deleteUserById } from "../../api/api"; // Adjust the path based on your project structure

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  container: {
    maxWidth: "100%",
  },
  tableContainer: {
    boxShadow: theme.shadows[3],
    maxWidth: "100%",
    marginTop: theme.spacing(2),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  backButton: {
    marginBottom: theme.spacing(2),
  },
  pageTitle: {
    marginBottom: theme.spacing(3),
    textAlign: "center",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const UsersByWarehouse = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      setError("User data not found in localStorage.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userString);
      const warehouseId = user.warehouse;

      if (!warehouseId) {
        setError("Warehouse ID not found in user data.");
        setLoading(false);
        return;
      }

      const getUsers = async () => {
        try {
          const data = await fetchUsersByWarehouse(warehouseId);
          console.log("Fetched users:", data); // Log fetched users

          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setError("Failed to fetch users.");
        } finally {
          setLoading(false);
        }
      };

      getUsers();
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      setError("Error parsing user data from localStorage.");
      setLoading(false);
    }
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserById(userId);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenDeleteDialog = (userId) => {
    setDeleteUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteUserId("");
    setDeleteDialogOpen(false);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.root}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
      >
        Back
      </Button>
      <Typography variant="h4" className={classes.pageTitle}>
        Users in Warehouse
      </Typography>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      className={classes.deleteButton}
                      onClick={() => handleOpenDeleteDialog(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteUser(deleteUserId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersByWarehouse;
