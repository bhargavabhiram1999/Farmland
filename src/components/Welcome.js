import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FarmLandNavBar from "./FarmLandNavBar";
import DisplayMaterialInfo from "./DisplayMaterialInfo";
import MaterialUpdate from "./MaterialUpdate"

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

  if (!user) return null; 

  return (
    <div style={{ textAlign: "center", marginTop: "0px" }}>
      <FarmLandNavBar setActiveSection={setActiveSection}/>
      
      <div style={{ paddingTop: "100px" }}>
      {activeSection === "stockData" && <DisplayMaterialInfo />}
        {activeSection === "materialData" && <MaterialUpdate />}
      {/* <FetchData /> */}
      </div>
    </div>
  );
}



export default Welcome;
