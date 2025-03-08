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
    { width: 50, label: "Material Name", dataKey: "material_name" },
    { width: 20, label: "quantity Used", dataKey: "quantity_used", numeric: true },
    { width: 50, label: "Last Updated", dataKey: "last_updated" }
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

  // Row Content Function
  function rowContent(_index, row) {
    return (
      <>
        {columns.map((column) => (
          <TableCell key={column.dataKey} align={column.numeric ? "right" : "left"}>
            {row[column.dataKey]}
          </TableCell>
        ))}
      </>
    );
  }

function DisplayHistory() {

    const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchHistoryData = async () => {
          try {
            const { data, error } = await supabase
              .from("history")
              .select("*");
    
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
    
        fetchHistoryData();
      }, []);

      if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No History data available.</p>;


    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh" // Full viewport height
          }}>
            <Paper style={{ height: 600, width: "50%" }}> 
              <TableVirtuoso
                data={data}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
              />
            </Paper>
          </div>
    );
}

export default DisplayHistory;