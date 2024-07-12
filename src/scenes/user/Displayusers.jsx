// DisplayUsersForm.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsers } from "../../api/api"; // Adjust the import path as necessary

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "12px",
  boxShadow: theme.shadows[3],
  width: "100%", // Make the paper take the full width of the container
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: theme.shadows[3],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#1591ea",
  color: "white",
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DisplayUsersForm = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        toast.error("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container component="main" maxWidth={false} style={{ padding: "0 24px" }}>
      <StyledPaper elevation={3}>
        <Typography
          component="h1"
          variant="h5"
          style={{ color: "#1591ea", marginBottom: "1rem" }}
        >
          Users List
        </Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Avatar</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Warehouse</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user._id}>
                  <TableCell>
                    <Avatar>{user.fullName.charAt(0)}</Avatar>
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.warehouse ? user.warehouse.name : "N/A"}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        draggable
        closeOnClick
      />
    </Container>
  );
};

export default DisplayUsersForm;
