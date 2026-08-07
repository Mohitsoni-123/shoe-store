import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError("");

      const response = await api.post("http://localhost:5000/api/auth/login",formData);

      const {token, user} = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    }catch(error){
      setError(
        error.response?.data?.message || "Invalid credentials"
      );
    }finally{
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Login Page</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder='Enter email' value={formData.email} onChange={handleChange} />

        <input type="password" name="password" placeholder='Enter password' value={formData.password} onChange={handleChange} />

        <button type='submit' disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
