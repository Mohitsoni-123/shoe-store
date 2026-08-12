import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900"
          >
            ShoeStore
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-black transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-black transition"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="text-gray-700 hover:text-black transition"
            >
              Cart
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {token ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:text-black"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-black"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;