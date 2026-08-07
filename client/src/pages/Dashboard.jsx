import React from 'react'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  return (
    <div>
      <h1>Welcome, {user?.name} 👋</h1>

      <p>You are successfully logged in.</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Dashboard
