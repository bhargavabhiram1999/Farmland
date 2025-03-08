import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";

const columns = [
  { width: 200, label: "Last Updated", dataKey: "last_updated" },
  { width: 200, label: "Plantation", dataKey: "plantation" },
  { width: 200, label: "Material Name", dataKey: "material_name" },
  { width: 150, label: "Quantity Used", dataKey: "quantity_used", numeric: true },
];

const dateColors = ["#f0f8ff", "#f5f5f5", "#e6f7ff"]; // Light alternating colors
const dateColorMap = {};
let colorIndex = 0;

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} stickyHeader sx={{ tableLayout: "fixed", width: "100%" }} />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric ? "right" : "left"}
          sx={{
            width: column.width,
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
    let date = formatDate(row.last_updated);
    if (!dateColorMap[date]) {
        dateColorMap[date] = dateColors[colorIndex % dateColors.length];
        colorIndex++;
      }
      let backgroundColor = dateColorMap[date];
  return (
    <>
      {columns.map((column) => {
        let value = row[column.dataKey];
        let cellStyle = { width: column.width };

        if (column.dataKey === "last_updated") {
          value = formatDate(value);
        }

        if (column.dataKey === "quantity_used") {
          const isLitre = row.is_litre;
          if (value < 1000) {
            value = `${value} ${isLitre ? "ml" : "gr"}`;
          } else {
            value = value / 1000;
            value = `${value} ${isLitre ? "lt" : "kg"}`;
          }
          cellStyle.color = "red";
          cellStyle.fontWeight = "bold";
        }

        return (
          <TableCell key={column.dataKey} align={column.numeric ? "right" : "left"} sx={cellStyle}>
            {value}
          </TableCell>
        );
      })}
    </>
  );
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
        console.error("Error fetching history data:", err);
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
        console.error("Error fetching stock data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (historyData.length === 0) return <p>No History data available.</p>;

  const mergedData = historyData.map((item) => ({
    ...item,
    is_litre: stockData[item.material_name] || false,
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper style={{ height: 600, width: 800 }}>
        <TableVirtuoso
          data={mergedData}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </div>
  );
}

export default DisplayHistory;
