import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">ShoeStore</h2>

            <p className="text-gray-400 mt-4 max-w-md leading-relaxed">
              Discover premium shoes designed for comfort, style and everyday
              performance.
            </p>

            <p className="text-gray-500 text-sm mt-6">Your style. Your step.</p>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-semibold text-lg">Quick Links</h3>

            <div className="flex flex-col gap-3 mt-5">
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-gray-400 hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/cart"
                className="text-gray-400 hover:text-white transition"
              >
                Cart
              </Link>

              <Link
                to="/orders"
                className="text-gray-400 hover:text-white transition"
              >
                Orders
              </Link>
            </div>
          </div>

          {/* Account */}

          <div>
            <h3 className="font-semibold text-lg">Account</h3>

            <div className="flex flex-col gap-3 mt-5">
              <Link
                to="/profile"
                className="text-gray-400 hover:text-white transition"
              >
                My Profile
              </Link>

              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-gray-400 hover:text-white transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ShoeStore. All rights reserved.
            </p>

            <p className="text-gray-500 text-sm">Built with MERN Stack</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
