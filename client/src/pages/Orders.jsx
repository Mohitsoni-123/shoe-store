import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      console.log("ORDERS RESPONSE:", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("ORDERS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "pending":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-sm tracking-[0.25em] text-gray-400 uppercase">
            Account
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">My Orders</h1>

          <p className="text-gray-500 mt-2">
            View and track all your ShoeStore orders.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {!error && orders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-5">📦</div>

            <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>

            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>

                    <p className="font-semibold text-gray-900 mt-1 break-all">
                      #{order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Order Date
                    </p>

                    <p className="text-gray-700 mt-1">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-5">
                  {order.items?.map((item, index) => {
                    const product = item.product;

                    return (
                      <div
                        key={item._id || index}
                        className="flex flex-col sm:flex-row gap-5 border-b last:border-b-0 pb-5 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {product?.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {product?.name || "Product"}
                          </h3>

                          {product?.brand && (
                            <p className="text-sm text-gray-500 mt-1">
                              {product.brand}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            <span>
                              Size:{" "}
                              <strong className="text-gray-900">
                                {item.size}
                              </strong>
                            </span>

                            <span>
                              Quantity:{" "}
                              <strong className="text-gray-900">
                                {item.quantity}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="sm:text-right">
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Price
                          </p>

                          <p className="font-bold text-gray-900 mt-1">
                            ₹
                            {(
                              Number(item.price || product?.price || 0) *
                              Number(item.quantity || 1)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>

                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {Number(
                        order.totalAmount || order.total || 0,
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="border border-gray-300 bg-white px-5 py-3 rounded-lg font-medium hover:border-black transition"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;
