import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
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

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Profile Card */}
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

          {/* Right Information */}
          <div className="lg:col-span-2 space-y-6">

            {/* Account Information */}
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
              </div>

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
            </div>

            {/* Quick Actions */}
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
                  <div className="text-2xl mb-3">🛍️</div>

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
                  <div className="text-2xl mb-3">🛒</div>

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
                  <div className="text-2xl mb-3">📦</div>

                  <h3 className="font-semibold text-gray-900">
                    My Orders
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Track your orders
                  </p>
                </button>

              </div>
            </div>

            {/* Logout */}
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