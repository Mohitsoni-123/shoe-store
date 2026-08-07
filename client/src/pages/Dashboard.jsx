import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        console.log("PROFILE RESPONSE:", response.data);

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name} 👋</h1>

      <p>Email: {user?.email}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;