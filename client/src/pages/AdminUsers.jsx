import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      console.log("ADMIN USERS RESPONSE:", response.data);

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(
        `/admin/users/${id}`
      );

      console.log("DELETE USER RESPONSE:", response.data);

      if (response.data.success) {
        alert("User deleted successfully");

        // Remove deleted user from UI
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );
      }
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Users...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Manage Users</h1>

      <p>
        Total Users: <strong>{users.length}</strong>
      </p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {users.length === 0 ? (
        <h3>No users found.</h3>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h2>{user.name}</h2>

              <p>
                <strong>Email:</strong>{" "}
                {user.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {user.role}
              </p>

              <p>
                <strong>Joined:</strong>{" "}
                {user.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {user.role !== "admin" && (
                <button
                  onClick={() =>
                    handleDelete(user._id)
                  }
                  style={{
                    color: "red",
                    marginTop: "10px",
                  }}
                >
                  Delete User
                </button>
              )}

              {user.role === "admin" && (
                <p
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  Admin Account
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/admin")}
        >
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;