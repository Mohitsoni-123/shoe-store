import React, { useEffect, useState } from "react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Dashboard Container */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= HERO ================= */}
        <section className="bg-black text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Welcome back
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {user?.name || "User"} 👋
            </h1>

            <p className="text-gray-400">
              Manage your account and explore our latest shoes.
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Start Shopping
          </button>

        </section>


        {/* ================= STAT CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

          {/* Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">
              
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">
                📦
              </div>

              <span className="text-sm text-gray-400">
                Orders
              </span>

            </div>

            <h2 className="text-3xl font-bold mt-5">
              0
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Total orders
            </p>

          </div>


          {/* Wishlist */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-xl">
                ❤️
              </div>

              <span className="text-sm text-gray-400">
                Wishlist
              </span>

            </div>

            <h2 className="text-3xl font-bold mt-5">
              0
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Saved products
            </p>

          </div>


          {/* Cart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                🛒
              </div>

              <span className="text-sm text-gray-400">
                Cart
              </span>

            </div>

            <h2 className="text-3xl font-bold mt-5">
              0
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Items in cart
            </p>

          </div>

        </section>


        {/* ================= ACCOUNT + ACTIONS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          {/* Account Information */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Account Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your personal account details
                </p>
              </div>

              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                👤
              </div>

            </div>


            {/* Name */}
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Full Name
              </p>

              <p className="font-medium mt-1">
                {user?.name || "N/A"}
              </p>
            </div>


            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Email Address
              </p>

              <p className="font-medium mt-1">
                {user?.email || "N/A"}
              </p>
            </div>


            {/* Role */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Account Type
              </p>

              <p className="font-medium mt-1 capitalize">
                {user?.role || "User"}
              </p>
            </div>

          </div>


          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">

            <h2 className="text-xl font-bold">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Quickly access your account
            </p>


            {/* Shop */}
            <button
              onClick={() => navigate("/products")}
              className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition text-left"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  🛍️
                </div>

                <div>
                  <p className="font-medium">
                    Shop Products
                  </p>

                  <p className="text-xs text-gray-500">
                    Browse shoes
                  </p>
                </div>

              </div>

              <span>
                →
              </span>

            </button>


            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition text-left"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  🛒
                </div>

                <div>
                  <p className="font-medium">
                    My Cart
                  </p>

                  <p className="text-xs text-gray-500">
                    View cart items
                  </p>
                </div>

              </div>

              <span>
                →
              </span>

            </button>


            {/* Orders */}
            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition text-left"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                  📦
                </div>

                <div>
                  <p className="font-medium">
                    My Orders
                  </p>

                  <p className="text-xs text-gray-500">
                    Track your orders
                  </p>
                </div>

              </div>

              <span>
                →
              </span>

            </button>

          </div>

        </section>


        {/* ================= BOTTOM CTA ================= */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-5">

          <div>
            <h2 className="text-xl font-bold">
              Looking for something new?
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Explore our latest collection of shoes.
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Explore Collection →
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;