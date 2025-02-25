import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={() => { 
        localStorage.removeItem("user"); 
        navigate("/"); 
      }}>
        Logout
      </button>
    </div>
  );
}

export default Welcome;
