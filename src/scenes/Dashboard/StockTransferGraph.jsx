import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import {
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StockTransferGraph = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [lineChartData1, setLineChartData1] = useState(null);
  const [lineChartData2, setLineChartData2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/dashboard/stock-transfer-data?period=daily"
        );
        const data = await response.json();

        if (data.transfersToSale && data.restocksFromSale) {
          const labels = data.transfersToSale.map(
            (entry) => `${entry._id.year}-${entry._id.month}-${entry._id.day}`
          );
          const transfersToSale = data.transfersToSale.map(
            (entry) => entry.totalQuantity
          );
          const restocksFromSale = data.restocksFromSale.map(
            (entry) => entry.totalQuantity
          );

          // Bar chart data
          setBarChartData({
            labels,
            datasets: [
              {
                label: "Transfers to Sale",
                data: transfersToSale,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "Restocks from Sale",
                data: restocksFromSale,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          });

          // Pie chart data
          setPieChartData({
            labels: ["Transfers to Sale", "Restocks from Sale"],
            datasets: [
              {
                data: [
                  transfersToSale.reduce((a, b) => a + b, 0),
                  restocksFromSale.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1,
              },
            ],
          });

          // Line chart data
          setLineChartData1({
            labels: labels.slice(0, 7), // Example: Show first 7 days
            datasets: [
              {
                label: "Transfers to Sale",
                data: transfersToSale.slice(0, 7), // Example: Show first 7 days
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
              },
            ],
          });

          setLineChartData2({
            labels: labels.slice(0, 7), // Example: Show first 7 days
            datasets: [
              {
                label: "Restocks from Sale",
                data: restocksFromSale.slice(0, 7), // Example: Show first 7 days
                fill: false,
                borderColor: "rgba(153, 102, 255, 1)",
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching stock transfer data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Row: Bar Chart, Pie Chart, Table */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Bar Chart */}
        <div style={{ flex: "1 1 50%", height: "400px" }}>
          <h2
            style={{ color: "#333", marginBottom: "30px", fontSize: "1.2rem" }}
          >
            Stock Transfers - Bar Chart
          </h2>
          {barChartData ? (
            <Bar
              data={barChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    type: "category",
                    title: {
                      display: true,
                      text: "Date",
                      color: "#333",
                    },
                    ticks: {
                      color: "#333",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Quantity",
                      color: "#333",
                    },
                    ticks: {
                      color: "#333",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "#333",
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* Pie Chart */}
        <div
          style={{
            flex: "1 1 50%",
            height: "400px",
            position: "relative",
          }}
        >
          <h2
            style={{ color: "#333", marginBottom: "30px", fontSize: "1.2rem" }}
          >
            Stock Transfers - Pie Chart
          </h2>
          {pieChartData ? (
            <Pie
              data={pieChartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "#333",
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading data...</p>
          )}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Optional: Centered loading or other content */}
          </div>
        </div>
      </div>

      {/* Line Charts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Line Chart 1 */}
        <div style={{ flex: "1 1 50%", height: "400px" }}>
          <h2
            style={{ color: "#333", marginBottom: "10px", fontSize: "1.2rem" }}
          >
            Transfers to Sale - Histogram
          </h2>
          {lineChartData1 ? (
            <Line
              data={lineChartData1}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "#333",
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* Line Chart 2 */}
        <div style={{ flex: "1 1 50%", height: "400px" }}>
          <h2
            style={{ color: "#333", marginBottom: "10px", fontSize: "1.2rem" }}
          >
            Restocks from Sale - Histogram
          </h2>
          {lineChartData2 ? (
            <Line
              data={lineChartData2}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "#333",
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <h2 style={{ color: "#333", marginBottom: "10px", fontSize: "1.2rem" }}>
          Stock Transfers - Table
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Date
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Transfers to Sale
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Restocks from Sale
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows, replace with dynamic data */}
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                2024-07-01
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                50
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                30
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                2024-07-02
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                40
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                25
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTransferGraph;
