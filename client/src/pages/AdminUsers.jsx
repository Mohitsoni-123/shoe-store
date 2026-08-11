import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current logged-in admin
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================
  // FETCH USERS
  // =========================

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

  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(
        `/admin/users/${id}`
      );

      console.log(
        "DELETE USER RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert("User deleted successfully");

        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => user._id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // =========================
  // CHANGE USER ROLE
  // =========================

  const handleRoleChange = async (user) => {
    const newRole =
      user.role === "admin"
        ? "user"
        : "admin";

    const confirmChange = window.confirm(
      `Change ${user.name}'s role to ${newRole}?`
    );

    if (!confirmChange) {
      return;
    }

    try {
      const response = await api.put(
        `/admin/users/${user._id}/role`,
        {
          role: newRole,
        }
      );

      console.log(
        "UPDATE ROLE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "User role updated successfully"
        );

        setUsers((prevUsers) =>
          prevUsers.map((item) =>
            item._id === user._id
              ? {
                  ...item,
                  role: newRole,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ROLE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Users...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1>Manage Users</h1>

      <p>
        Total Users:{" "}
        <strong>{users.length}</strong>
      </p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* EMPTY USERS */}

      {users.length === 0 ? (
        <h3>No users found.</h3>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {users.map((user) => {
            const isCurrentUser =
              currentUser?.id === user._id;

            return (
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

                {/* CURRENT ADMIN */}

                {isCurrentUser &&
                  user.role === "admin" && (
                    <div>
                      <p
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        Current Admin Account
                      </p>
                    </div>
                  )}

                {/* OTHER ADMIN */}

                {!isCurrentUser &&
                  user.role === "admin" && (
                    <div>
                      <p
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        Admin Account
                      </p>

                      <button
                        onClick={() =>
                          handleRoleChange(
                            user
                          )
                        }
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Make User
                      </button>
                    </div>
                  )}

                {/* NORMAL USER */}

                {user.role === "user" && (
                  <div>
                    <button
                      onClick={() =>
                        handleRoleChange(
                          user
                        )
                      }
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      Make Admin
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          user._id
                        )
                      }
                      style={{
                        color: "red",
                      }}
                    >
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BACK BUTTON */}

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() =>
            navigate("/admin")
          }
        >
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;