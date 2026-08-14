import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChanged = () => {
      const newToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      setToken(newToken);

      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("authChanged", handleAuthChanged);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-gray-900"
          >
            ShoeStore
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-black transition">
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

            {token && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-black transition"
              >
                Orders
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-black transition"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Account */}

          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:text-black transition"
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
                  className="text-gray-700 hover:text-black transition"
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

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-4 pt-4 pb-2">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Products
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cart
              </Link>

              {token && (
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </Link>
              )}

              {token && (
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-100 my-2" />

              {token ? (
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg bg-black text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
