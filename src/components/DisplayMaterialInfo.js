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

// Define columns with fixed widths
const columns = [
  { width: 50, label: "ID", dataKey: "id", numeric: true },
  { width: 200, label: "Material Name", dataKey: "material_name" },
  { width: 100, label: "Pack Qty", dataKey: "pack_quantity", numeric: true },
  { width: 120, label: "Cost/Unit", dataKey: "cost_per_unit", numeric: true },
  { width: 150, label: "Available Qty", dataKey: "available_quantity", numeric: true },
  { width: 180, label: "Last Updated", dataKey: "last_updated" }
];

// Custom Components for Virtualized Table
const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        tableLayout: "fixed", // Ensures uniform column spacing
        width: "100%",
        "& td, & th": { padding: "8px 12px" } // Adjust padding for better readability
      }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

// Fixed Table Header
function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric ? "right" : "left"}
          style={{ width: column.width }}
          sx={{ backgroundColor: "background.paper", fontWeight: "bold" }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return ""; // Handle empty values
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

// Row Content Function
function rowContent(_index, row) {
  return (
    <>
      {columns.map((column) => {
        let value = row[column.dataKey];

        // Format "available_quantity" with units
        if (column.dataKey === "available_quantity") {
          value = `${value} ${row.is_litre ? "Lt" : "kg"}`;
        }

        // Format "last_updated" date
        if (column.dataKey === "last_updated") {
          value = formatDate(value);
        }

        return (
          <TableCell key={column.dataKey} align={column.numeric ? "right" : "left"}>
            {value}
          </TableCell>
        );
      })}
    </>
  );
}

// Main Component
export default function DisplayMaterialInfo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { data, error } = await supabase
          .from("stock")
          .select("id, material_name, pack_quantity, cost_per_unit, available_quantity, last_updated,is_litre")
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        setData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No stock data available.</p>;

  return (
    <Paper style={{ height: 600, width: "100%" }}> {/* Increased height to 600px */}
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
