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
import { Box } from "@mui/material";

// Define columns with fixed widths
const columns = [
  { width: 50, label: "ID", dataKey: "id" },
  { width: 200, label: "Material Name", dataKey: "material_name" },
  { width: 100, label: "Pack Qty", dataKey: "pack_quantity" },
  { width: 120, label: "Cost/Unit", dataKey: "cost_per_unit" },
  { width: 150, label: "Available Qty", dataKey: "available_quantity" },
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
        tableLayout: "fixed",
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0 8px", // Spacing between rows
        "& th": {
          backgroundColor: "#1C325B", // Dark blue header
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px",
          textAlign: "center"
        },
        "& td": {
          backgroundColor: "#f9f9f9", // Light gray background
          borderBottom: "1px solid #ddd",
          padding: "10px", // Reduced padding
          fontSize: "14px",
          textAlign: "center"
        },
        "& tr:hover td": {
          backgroundColor: "#e3f2fd", // Light blue hover effect
          transition: "0.3s"
        }
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
          style={{ width: column.width, textAlign: "center" }}
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

        // Format "available_quantity" with units and apply red color if less than 25
        if (column.dataKey === "available_quantity") {
          const quantity = value;
          value = `${quantity} ${row.is_litre ? "Lt" : "kg"}`;
          return (
            <TableCell
              key={column.dataKey}
              sx={{
                fontWeight: "bold",
                color: quantity < 25 ? "#d32f2f" : "inherit", // Red only if < 25
                textAlign: "center",
              }}
            >
              {value}
            </TableCell>
          );
        }

        // Format "last_updated" date
        if (column.dataKey === "last_updated") {
          value = formatDate(value);
        }

        return (
          <TableCell
            key={column.dataKey}
            sx={{
              textAlign: "center",
            }}
          >
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
    <Box
      sx={{
        height: 600,
        width: "100%",
        padding: "10px",
        backgroundColor: "#f0f4f8", // Light gray background
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}
    >
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Box>
  );
}
