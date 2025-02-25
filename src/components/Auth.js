import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import supabase from "./supabaseClient";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  // Login function
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single(); // Fetch only one user

    setLoading(false);
    if (error || !data) {
      setMessage("Invalid username or password");
    } else {
      setMessage("Login successful!");
      localStorage.setItem("user", JSON.stringify(data)); // Store user session
      navigate(`/welcome/${username}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin} disabled={loading}>
        Login
      </button>
      
      <p>{message}</p>
    </div>
  );
}

export default Auth;
