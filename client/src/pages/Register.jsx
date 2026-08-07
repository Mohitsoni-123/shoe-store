import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../services/api";


const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
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

      const response = await api.post("http://localhost:5000/api/auth/register", formData);

      console.log(response.data);

      alert("Registration successfully");

      navigate("/login");

    }catch(error){
      console.log(error);
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    }finally{
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Register Page</h1>

      {
        error && <p>{error}</p>
      }

      <form onSubmit={handleSubmit}>
        <input type='text' name='name' placeholder='Enter name' value={formData.name} onChange={handleChange} />

        <input type='email' name='email' placeholder='Enter email' value={formData.email} onChange={handleChange} />

        <input type='password' name='password' placeholder='Enter password' value={formData.password} onChange={handleChange} />

        <button type='submit' disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default Register