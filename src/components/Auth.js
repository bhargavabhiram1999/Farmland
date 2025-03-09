import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import supabase from "./supabaseClient";
import "./Auth.css";  // ✅ Import the styles file

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={handleLogin} disabled={loading} className="auth-button">
          {loading ? <span className="loader"></span> : "Login"}
        </button>
        <p className={`auth-message ${message.includes("Invalid") ? "error" : "success"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default Auth;
