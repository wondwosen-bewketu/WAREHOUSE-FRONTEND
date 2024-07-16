import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Box,
} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { setUser } from "./redux/slice/userSlice";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
const Login = React.lazy(() => import("./scenes/user/loginPage"));
const Dashboard = React.lazy(() => import("./scenes/Dashboard/dashboard"));

const AddProducts = React.lazy(() => import("./scenes/products/addProducts"));
const ProductTransferList = React.lazy(() =>
  import("./scenes/products/productTransferList")
);
const RestockTransfer = React.lazy(() =>
  import("./scenes/products/restockTransfer")
);
const ListProducts = React.lazy(() => import("./scenes/products/listProducts"));
const Restock = React.lazy(() => import("./scenes/products/restock"));
const RestockList = React.lazy(() => import("./scenes/products/restockList"));
const RegisterUser = React.lazy(() =>
  import("./scenes/Registration/registerUser")
);

const RecordSale = React.lazy(() => import("./scenes/products/recordSale"));
const TransferSaleList = React.lazy(() =>
  import("./scenes/products/transferSaleList")
);

const SalesProductList = React.lazy(() =>
  import("./scenes/products/salesProductList")
);

const TransferToSale = React.lazy(() =>
  import("./scenes/products/transferToSale")
);

const CreateWarehouse = React.lazy(() =>
  import("./scenes/Warehouse/createWarehouse")
);

const WarehouseList = React.lazy(() =>
  import("./scenes/Warehouse/WarehouseList")
);
const SendProduct = React.lazy(() => import("./scenes/Warehouse/sendProduct"));

const DisplayUsers = React.lazy(() => import("./scenes/user/Displayusers"));
const WarehouseTransaction = React.lazy(() =>
  import("./scenes/Warehouse/transaction")
);

const AdminRegisterUser = React.lazy(() =>
  import("./scenes/Registration/AdminRegisterUser")
);

const WarehouseDetail = React.lazy(() =>
  import("./scenes/Warehouse/warehouseDetail")
);

const AdminWarehouse = React.lazy(() =>
  import("./scenes/Warehouse/AdminWarehouse")
);

const ProductRequest = React.lazy(() =>
  import("./scenes/products/productRequest")
);

const AllProductRequests = React.lazy(() =>
  import("./scenes/products/AllProductRequests")
);

const UsersOnWarehouse = React.lazy(() =>
  import("./scenes/Warehouse/UsersOnWarehouse")
);

const SoldRecords = React.lazy(() => import("./scenes/Sales/SoldRecords"));
function PrivateRoutes() {
  const user = useSelector((state) => state.user);

  if (user && user.token) {
    switch (user.user.role) {
      case "superAdmin":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createWarehouse" element={<CreateWarehouse />} />
            <Route path="/WarehouseList" element={<WarehouseList />} />
            <Route
              path="/warehouse/:id/products"
              element={<WarehouseDetail />}
            />
            <Route path="/registerUser" element={<RegisterUser />} />
            <Route path="/addProducts" element={<AddProducts />} />
            <Route path="/listProducts" element={<ListProducts />} />
            <Route path="/SendProduct" element={<SendProduct />} />
            <Route path="/DisplayUsers" element={<DisplayUsers />} />
            <Route
              path="/WarehouseTransaction"
              element={<WarehouseTransaction />}
            />
            <Route
              path="/AllProductRequests"
              element={<AllProductRequests />}
            />
          </Routes>
        );
      case "admin":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/AdminRegisterUser" element={<AdminRegisterUser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listProducts" element={<AdminWarehouse />} />
            <Route path="/TransferToSale" element={<TransferToSale />} />
            <Route path="/UsersOnWarehouse" element={<UsersOnWarehouse />} />
            <Route path="/ProductRequest" element={<ProductRequest />} />
            <Route path="/restockTransferList" element={<RestockList />} />
          </Routes>
        );
      case "manager": // Combine cases for Call Center and General Manager
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listProducts" element={<AdminWarehouse />} />
            <Route path="TransferToSale" element={<TransferToSale />} />
            <Route path="/restockTransfer" element={<RestockTransfer />} />
            <Route path="/restockTransferList" element={<RestockList />} />
            <Route
              path="/transfertosale/:productId"
              element={<TransferToSale />}
            />
            <Route path="/transferSaleList" element={<TransferSaleList />} />
          </Routes>
        );
      case "sales": // Combine cases for Call Center and General Manager
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restock/:productId" element={<Restock />} />
            <Route path="/recordsale" element={<RecordSale />} />
            <Route path="/restock" element={<Restock />} />
            <Route path="/SoldRecords" element={<SoldRecords />} />
            <Route path="/salesProductList" element={<SalesProductList />} />

            <Route
              path="productTransferList"
              element={<ProductTransferList />}
            />
            <Route path="/restockTransfer" element={<RestockTransfer />} />
          </Routes>
        );

      default:
        return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
  const [theme, colorMode] = useMode();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar open/close

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          dispatch(setUser({ user: parsedUser, token: storedToken }));
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          {user && user.token ? (
            <>
              <Topbar toggleSidebar={toggleSidebar} />
              <Box
                sx={{
                  display: "flex",
                  marginTop: "-30px", // Adjust based on your topbar height
                }}
              >
                <Sidebar
                  userRole={user.user.role} // assuming user.user.role is correct
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    overflowX: "hidden",
                    transition: theme.transitions.create("margin", {
                      easing: theme.transitions.easing.easeOut,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: isSidebarOpen ? `280px` : `0px`, // Adjust based on sidebar width
                    marginTop: "64px", // Adjust based on your topbar height
                    paddingLeft: theme.spacing(2), // Adjust as needed
                    paddingRight: theme.spacing(2), // Adjust as needed
                    paddingBottom: theme.spacing(2), // Adjust as needed
                  }}
                >
                  <Suspense
                    fallback={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                        }}
                      >
                        Loading...
                        <CircularProgress />
                      </div>
                    }
                  >
                    <PrivateRoutes />
                  </Suspense>
                </Box>
              </Box>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
