import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import logo from "../../assets/warehouse-management-system-hero-img-01-1.webp";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#f0f0f0", // Light gray background color
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logo: {
    width: "40%", // Adjusted width to make the logo smaller
    height: "40%", // Automatically adjust height while maintaining aspect ratio
    filter: theme.palette.mode === "dark" ? "invert(100%)" : "none",
  },
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  listItemText: {
    fontSize: "1rem",
  },
  menuHeader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  lightBlueIcon: {
    color: theme.palette.info.main, // Light blue color
  },
}));

const Sidebar = ({ userRole, isOpen, toggleSidebar }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleItemClick = (route) => {
    navigate(route);
    toggleSidebar(); // Close the sidebar after navigating
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        <Box textAlign="center" mt={2} mb={4}>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Box>
        <Typography
          variant="subtitle2"
          className={classes.menuHeader}
        ></Typography>
        {userRole === "superAdmin" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/dashboard")}
              button
            >
              <ListItemIcon>
                <DashboardIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/createWarehouse")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Create Warehouse" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/WarehouseList")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Warehouses List" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/registerUser")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />{" "}
              </ListItemIcon>
              <ListItemText primary="Register User" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/addProducts")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Add Products" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/listProducts")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/SendProduct")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Send Product" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/DisplayUsers")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="All Users" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/WarehouseTransaction")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Transaction" />
            </ListItem>
          </>
        )}

        {userRole === "admin" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/dashboard")}
              button
            >
              <ListItemIcon>
                <DashboardIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/listProducts")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="List Products" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/AdminRegisterUser")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Register User" />
            </ListItem>
          </>
        )}

        {userRole === "manager" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/dashboard")}
              button
            >
              <ListItemIcon>
                <DashboardIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/listProducts")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/addProducts")}
              button
            >
              <ListItemIcon>
                <ListAltIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Add Products" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/TransferToSale")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Send Product" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/productTransferList")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Stock Out" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/restockTransfer")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Stock In" />
            </ListItem>
          </>
        )}

        {userRole === "sales" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/dashboard")}
              button
            >
              <ListItemIcon>
                <DashboardIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/salesProductList")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Sales Product List" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/productTransferList")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Stock Out" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("/restockTransfer")}
              button
            >
              <ListItemIcon>
                <MonetizationOnIcon className={classes.lightBlueIcon} />
              </ListItemIcon>
              <ListItemText primary="Stock In" />
            </ListItem>
          </>
        )}
        {/* Add other userRole specific menu items similarly */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
