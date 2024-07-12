import { useEffect, useState } from "react";
import { getAllTransactions } from "../../api/api";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
        setError("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const containerStyle = {
    margin: "2rem auto",
    padding: "1rem",
    maxWidth: "1300px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#1591ea",
    color: "white",
  };

  const tdStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };

  const evenRowStyle = {
    backgroundColor: "#f2f2f2",
  };

  const hoverRowStyle = {
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", color: "#1591ea" }}>
        Warehouse Transactions
      </h1>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Warehouse</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction._id}
                style={{
                  ...hoverRowStyle,
                  ...(index % 2 === 0 ? evenRowStyle : {}),
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ddd")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#f2f2f2" : "#fff")
                }
              >
                <td style={tdStyle}>{transaction.productId.name}</td>
                <td style={tdStyle}>{transaction.warehouseId.name}</td>
                <td style={tdStyle}>{transaction.quantity}</td>
                <td style={tdStyle}>{transaction.transactionType}</td>
                <td style={tdStyle}>
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsList;
