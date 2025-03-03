import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FarmLandNavBar from "./FarmLandNavBar";
import FetchData from "./FetchData";
import DisplayMaterialInfo from "./DisplayMaterialInfo";

function Welcome() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      <FarmLandNavBar />
      
      <div style={{ paddingTop: "60px" }}>
      <DisplayMaterialInfo />
      {/* <FetchData /> */}
      </div>
    </div>
  );
}



export default Welcome;
