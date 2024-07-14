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

// Import the API functions
import { fetchUsersByWarehouse, deleteUserById } from "../../api/api"; // Adjust the path based on your project structure

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    maxWidth: "100%",
    padding: theme.spacing(3),
  },
  tableContainer: {
    boxShadow: theme.shadows[3],
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
}));

const UsersByWarehouse = () => {
  const classes = useStyles();
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
          setUsers(data.filter((user) => user._id !== user._id)); // Filter out logged-in user
        } catch (error) {
          setError("Failed to fetch users.");
        } finally {
          setLoading(false);
        }
      };

      getUsers();
    } catch (parseError) {
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

  if (loading) {
    return (
      <Box className={classes.root}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.root}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Typography variant="h4" gutterBottom textAlign="center">
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
