import {
  Box,
  IconButton,
  Typography,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../../redux/slice/userSlice";

const Topbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
    toggleSidebar(); // Toggle sidebar when user icon is clicked
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      backgroundColor="#efefef"
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>

      {/* User Information */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={handleUserIconClick} sx={{ color: "#d7a022" }}>
          <PersonOutlinedIcon />
        </IconButton>
        {user && (
          <Typography variant="body2" color="#d7a022" sx={{ mr: 1 }}>
            {user.fullName} - {user.role}
          </Typography>
        )}

        {/* User Information Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Paper>
            <List>
              {user && (
                <>
                  <ListItem>
                    <ListItemText primary={`Name: ${user.fullName}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Role: ${user.role}`} />
                  </ListItem>
                  <Divider />
                </>
              )}
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Popover>
      </Box>
    </Box>
  );
};

export default Topbar;
