import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { label: "Plantation", dataKey: "plantation", width: "30%", paddingLeft: "10px" },
  { label: "Material Name", dataKey: "material_name", width: "40%", paddingLeft: "50px" }, // Fixed alignment
  { label: "Quantity Used", dataKey: "quantity_used", width: "30%", paddingLeft: "50px", align: "right" }, // Fixed alignment
];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function DisplayHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const { data, error } = await supabase.from("history").select("*");
        if (error) throw error;
        const sortedData = data.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
        setHistoryData(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { data, error } = await supabase.from("stock").select("material_name, is_litre");
        if (error) throw error;
        const stockLookup = {};
        data.forEach((item) => {
          stockLookup[item.material_name] = item.is_litre;
        });
        setStockData(stockLookup);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!historyData.length) return <p>No History data available.</p>;

  const mergedData = historyData.map((item) => ({
    ...item,
    is_litre: stockData[item.material_name] || false,
  }));

  let lastDate = null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Paper sx={{ width: 800, overflow: "hidden", padding: "20px" }}>
        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
          **History Timeline**
        </Typography>

        {mergedData.map((row, index) => {
          const rowDate = formatDate(row.last_updated);
          const showDateHeader = lastDate !== rowDate;
          lastDate = rowDate;

          return (
            <Box key={index} sx={{ marginBottom: "10px" }}>
              {showDateHeader && (
                <Box
                  sx={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    display: "inline-block",
                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {rowDate}
                </Box>
              )}
              <TableContainer component={Paper} sx={{ marginTop: "5px", borderLeft: "4px solid #3498db" }}>
                <Table size="small">
                  {showDateHeader && (
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#ecf0f1" }}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.dataKey}
                            sx={{
                              fontWeight: "bold",
                              width: column.width,
                              paddingLeft: column.paddingLeft || "10px",
                              textAlign: column.align || "left",
                            }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  )}
                  <TableBody>
                    <TableRow
                      sx={{
                        transition: "background 0.3s",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      {columns.map((column) => {
                        let value = row[column.dataKey];

                        if (column.dataKey === "quantity_used") {
                          const isLitre = row.is_litre;
                          value = value < 1000 ? `${value} ${isLitre ? "ml" : "gr"}` : `${value / 1000} ${isLitre ? "lt" : "kg"}`;
                        }

                        return (
                            <TableCell
                            key={column.dataKey}
                            sx={{
                              width: column.width,
                              paddingLeft: column.paddingLeft || "10px",
                              textAlign: column.align || "left",
                              color: column.dataKey === "quantity_used" ? "red" : "inherit", // Red color for Quantity Used
                              fontWeight: column.dataKey === "quantity_used" ? "bold" : "normal", // Bold text for visibility
                            }}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}

export default DisplayHistory;
