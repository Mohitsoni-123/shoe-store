import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("USERS ERROR:", error);

      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await api.put(`/admin/users/${id}/role`, { role });

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? response.data.user : user)),
      );
    } catch (error) {
      console.error("ROLE UPDATE ERROR:", error);

      setError(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/admin/users/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      setError(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = `${user.name || ""} ${user.email || ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate("/admin")}
            className="text-sm text-gray-500 hover:text-black mb-5"
          >
            ← Back to Dashboard
          </button>

          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Admin Panel
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mt-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Users</h1>

              <p className="text-gray-500 mt-2">
                Manage registered ShoeStore users.
              </p>
            </div>

            <div className="bg-gray-100 px-5 py-3 rounded-xl">
              <p className="text-sm text-gray-500">Total Users</p>

              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">👤</div>

            <h2 className="text-xl font-bold text-gray-900">No users found</h2>

            <p className="text-gray-500 mt-2">No users match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>

                          <p className="font-semibold text-gray-900">
                            {user.name || "User"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">{user.email}</td>

                      <td className="px-6 py-5">
                        <select
                          value={user.role || "user"}
                          disabled={updatingId === user._id}
                          onChange={(e) => updateRole(user._id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-black disabled:opacity-50"
                        >
                          <option value="user">User</option>

                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
