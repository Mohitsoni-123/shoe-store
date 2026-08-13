import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editing, setEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // FETCH PROFILE
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");

        console.log("PROFILE RESPONSE:", response.data);

        const profileUser = response.data.user;

        setUser(profileUser);

        setFormData({
          name: profileUser.name || "",
          email: profileUser.email || "",
        });
      } catch (error) {
        console.error("PROFILE ERROR:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // START EDIT
  // ===============================
  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };

  // ===============================
  // CANCEL EDIT
  // ===============================
  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/user/profile", {
        name: formData.name,
        email: formData.email,
      });

      console.log("UPDATE PROFILE RESPONSE:", response.data);

      const updatedUser = response.data.user;

      // Update UI
      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      // Update localStorage user
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Tell other components
      window.dispatchEvent(new Event("authChanged"));

      setSuccess("Profile updated successfully!");

      setEditing(false);
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-12">

          <p className="text-sm tracking-[0.25em] text-gray-400 uppercase">
            Account
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information and shopping activity.
          </p>

        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT PROFILE CARD ================= */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-5">
                {user.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {user.email}
              </p>

              <span className="mt-4 px-4 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 capitalize">
                {user.role || "User"}
              </span>

            </div>

            <div className="border-t mt-6 pt-6">

              <button
                onClick={() => navigate("/products")}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Start Shopping
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                View My Cart
              </button>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* ================= ACCOUNT INFORMATION ================= */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <div className="flex justify-between items-center mb-6">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Account Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your personal account details
                  </p>
                </div>

                {!editing && (
                  <button
                    onClick={handleEdit}
                    className="px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                  >
                    Edit Profile
                  </button>
                )}

              </div>

              {/* ================= VIEW MODE ================= */}
              {!editing && (
                <div className="space-y-4">

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Full Name
                    </p>

                    <p className="text-gray-900 font-medium mt-1">
                      {user.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Email Address
                    </p>

                    <p className="text-gray-900 font-medium mt-1">
                      {user.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Account Type
                    </p>

                    <p className="text-gray-900 font-medium mt-1 capitalize">
                      {user.role || "User"}
                    </p>
                  </div>

                </div>
              )}

              {/* ================= EDIT MODE ================= */}
              {editing && (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-5"
                >

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black transition"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black transition"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                  </div>

                </form>
              )}

            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Quickly access your account
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <button
                  onClick={() => navigate("/products")}
                  className="border border-gray-200 rounded-xl p-5 text-left hover:border-black transition"
                >
                  <div className="text-2xl mb-3">
                    🛍️
                  </div>

                  <h3 className="font-semibold text-gray-900">
                    Shop Products
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Browse shoes
                  </p>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="border border-gray-200 rounded-xl p-5 text-left hover:border-black transition"
                >
                  <div className="text-2xl mb-3">
                    🛒
                  </div>

                  <h3 className="font-semibold text-gray-900">
                    My Cart
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    View cart items
                  </p>
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="border border-gray-200 rounded-xl p-5 text-left hover:border-black transition"
                >
                  <div className="text-2xl mb-3">
                    📦
                  </div>

                  <h3 className="font-semibold text-gray-900">
                    My Orders
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Track your orders
                  </p>
                </button>

              </div>

            </div>

            {/* ================= ACCOUNT ACTIONS ================= */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-lg font-bold text-gray-900">
                Account Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Sign out from your ShoeStore account.
              </p>

              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;