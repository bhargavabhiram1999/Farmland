import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";

function FetchData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          let { data, error } = await supabase
            .from("stock")
            .select("*")
            .order("id", { ascending: true });
  
          if (error) {
            throw error;
          }
          setData(data);
          console.log("Fetched Data: ",data)
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (data.length === 0) return <p>No stock data available.</p>;
  
    return (
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <table border="1" style={{ width: "80%", margin: "auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {Object.entries(item).map(([key, value], index) => (
                  <td key={index} style={{ padding: "8px" }}>
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  export default FetchData;