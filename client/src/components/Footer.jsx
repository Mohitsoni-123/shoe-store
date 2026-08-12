import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ShoeStore
            </h2>

            <p className="text-gray-400 leading-7 text-sm">
              Discover premium shoes designed for comfort, style and
              everyday performance.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                f
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                i
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="hover:text-white transition"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                className="hover:text-white transition"
              >
                Cart
              </Link>

              <Link
                to="/products"
                className="hover:text-white transition"
              >
                All Products
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Categories
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/products?category=Running"
                className="hover:text-white transition"
              >
                Running Shoes
              </Link>

              <Link
                to="/products?category=Casual"
                className="hover:text-white transition"
              >
                Casual Shoes
              </Link>

              <Link
                to="/products?category=Sports"
                className="hover:text-white transition"
              >
                Sports Shoes
              </Link>

              <Link
                to="/products?category=Formal"
                className="hover:text-white transition"
              >
                Formal Shoes
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm text-gray-400">
              <p>
                📍 Jaipur, Rajasthan, India
              </p>

              <p>
                📧 support@shoestore.com
              </p>

              <p>
                📞 +91 98765 43210
              </p>

              <p>
                🕒 Mon - Sat: 9:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} ShoeStore. All rights reserved.
          </p>

          <div className="flex gap-5">
            <span className="hover:text-gray-300 cursor-pointer">
              Privacy Policy
            </span>

            <span className="hover:text-gray-300 cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;