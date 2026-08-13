import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      // We will create this backend endpoint in the next step
      const response = await api.get(`/orders/${id}`);

      console.log("ORDER DETAILS:", response.data);

      setOrder(response.data.order);
    } catch (error) {
      console.error("ORDER DETAILS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load order details"
      );
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

      case "confirmed":
        return "bg-purple-100 text-purple-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load order
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-10">

          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            ← Back to Orders
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mt-6">

            <div>
              <p className="text-sm tracking-[0.25em] text-gray-400 uppercase">
                Order Details
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 break-all">
                #{order._id}
              </h1>

              <p className="text-gray-500 mt-2">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`w-fit px-5 py-2 rounded-full text-sm font-medium capitalize ${getStatusClass(
                order.status
              )}`}
            >
              {order.status || "Pending"}
            </span>

          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT ================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* Order Items */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Ordered Items
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Products included in this order
              </p>

              <div className="mt-6 space-y-5">

                {order.items?.map((item, index) => {

                  const product = item.product;

                  return (
                    <div
                      key={item._id || index}
                      className="flex flex-col sm:flex-row gap-5 border-b last:border-b-0 pb-5 last:pb-0"
                    >

                      {/* Image */}

                      <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">

                        {product?.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={
                              item.name ||
                              product.name ||
                              "Product"
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}

                      </div>

                      {/* Info */}

                      <div className="flex-1">

                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.name ||
                            product?.name ||
                            "Product"}
                        </h3>

                        {product?.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-4">

                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Size: {item.size}
                          </span>

                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Quantity: {item.quantity}
                          </span>

                        </div>

                      </div>

                      {/* Price */}

                      <div className="sm:text-right">

                        <p className="text-sm text-gray-500">
                          Price
                        </p>

                        <p className="font-bold text-gray-900 text-lg">
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* Shipping Address */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Address
              </h2>

              <div className="mt-5 bg-gray-50 rounded-xl p-5">

                <h3 className="font-semibold text-gray-900">
                  {order.shippingAddress?.name}
                </h3>

                <p className="text-gray-600 mt-2">
                  {order.shippingAddress?.address}
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.pincode}
                </p>

                <p className="text-gray-600 mt-2">
                  Phone:{" "}
                  {order.shippingAddress?.phone}
                </p>

              </div>
            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-6">

            {/* Order Summary */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-600">
                  <span>Items</span>

                  <span>
                    {order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(item.quantity || 0),
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Payment</span>

                  <span>
                    {order.paymentMethod || "COD"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Payment Status</span>

                  <span className="capitalize">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between">

                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

              </div>
            </div>

            {/* Order Status */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Order Status
              </h2>

              <div className="mt-6 space-y-5">

                {[
                  "Pending",
                  "Confirmed",
                  "Shipped",
                  "Delivered",
                ].map((status, index) => {

                  const statuses = [
                    "Pending",
                    "Confirmed",
                    "Shipped",
                    "Delivered",
                  ];

                  const currentIndex =
                    statuses.indexOf(
                      order.status
                    );

                  const completed =
                    currentIndex >= index;

                  return (
                    <div
                      key={status}
                      className="flex items-center gap-4"
                    >

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          completed
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <p
                          className={`font-medium ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {status}
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* Continue Shopping */}

            <button
              onClick={() => navigate("/products")}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;