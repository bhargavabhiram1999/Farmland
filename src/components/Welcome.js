import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FarmLandNavBar from "./FarmLandNavBar";
import DisplayMaterialInfo from "./DisplayMaterialInfo";
import MaterialUpdate from "./MaterialUpdate";
import supabase from "./supabaseClient";

function Welcome() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("materialData");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.username !== username) {
      alert("Please login again!");
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [username, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("stock")
          .select("material_name, available_quantity");

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        // Check quantity condition and alert only once
        data.forEach((row) => {
          if (row.available_quantity < 10) {
            alert(`⚠️ Warning: ${row.material_name} stock is below 10!`);
          }
        });

        console.log(data); // Logs fetched data
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchData();
  }, []); // Runs only once on component mount

  if (!user) return null; 

  return (
    <div style={{ textAlign: "center", marginTop: "0px" }}>
      <FarmLandNavBar setActiveSection={setActiveSection} />
      
      <div style={{ paddingTop: "100px" }}>
        {activeSection === "stockData" && <DisplayMaterialInfo />}
        {activeSection === "materialData" && <MaterialUpdate />}
      </div>
    </div>
  );
}

export default Welcome;
