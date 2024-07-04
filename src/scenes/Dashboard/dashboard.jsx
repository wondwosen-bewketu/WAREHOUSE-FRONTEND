import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DashboardCard from "./DashboardCard";
import {
  ShoppingCart,
  Store,
  TransferWithinAStation,
  AssignmentReturn,
} from "@mui/icons-material";
import StockTransferGraph from "./StockTransferGraph"; // Import the new component
import { getDashboardCounts, getStockTransferData } from "../../api/api";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    productCount: 0,
    salesCount: 0,
    transfersToSaleCount: 0,
    restocksFromSaleCount: 0,
  });

  const [period, setPeriod] = useState("daily");
  const [graphData, setGraphData] = useState({
    transfersToSale: [],
    restocksFromSale: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardCounts();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await getStockTransferData(period);
        setGraphData(data);
      } catch (error) {
        console.error("Error fetching stock transfer data:", error);
      }
    };

    fetchGraphData();
  }, [period]);

  return (
    <Box p={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <DashboardCard
          title="Total Products"
          count={counts.productCount}
          icon={Store}
          color="#4caf50"
        />
        <DashboardCard
          title="Total Sales"
          count={counts.salesCount}
          icon={ShoppingCart}
          color="#2196f3"
        />
        <DashboardCard
          title="Transfers to Sale"
          count={counts.transfersToSaleCount}
          icon={TransferWithinAStation}
          color="#ff9800"
        />
        <DashboardCard
          title="Restocks from Sale"
          count={counts.restocksFromSaleCount}
          icon={AssignmentReturn}
          color="#f44336"
        />
      </Box>
      <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <StockTransferGraph data={graphData} period={period} />
      </Box>
    </Box>
  );
};

export default Dashboard;
