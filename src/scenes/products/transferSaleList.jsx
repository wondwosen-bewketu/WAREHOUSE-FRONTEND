import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import { getTransferToSalesTransactionsByWarehouse } from "../../api/api";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "productName", headerName: "Product Name", width: 200 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "unit", headerName: "Unit", width: 100 },
  { field: "unitPrice", headerName: "Unit Price", width: 150 },
  { field: "quantity", headerName: "Quantity", width: 130 },
  { field: "salesUserName", headerName: "Sales User", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const warehouseId = JSON.parse(localStorage.getItem("user")).warehouse; // Assuming the warehouse ID is stored in user object
        const data = await getTransferToSalesTransactionsByWarehouse(
          warehouseId
        );

        const transformedData = data.map((transaction, index) => ({
          id: index + 1,
          productName: transaction.productId.name,
          category: transaction.productId.category,
          unit: transaction.productId.unit,
          unitPrice: transaction.productId.unitPrice,
          quantity: transaction.quantity,
          salesUserName: transaction.salesUserId.fullName,
          date: new Date(transaction.date).toLocaleString(),
        }));

        setTransactions(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, width: "90%", height: "90%" }}>
        <Typography variant="h4" gutterBottom>
          Transfer to Sales Transactions
        </Typography>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Paper>
    </Box>
  );
};

export default TransactionsPage;
