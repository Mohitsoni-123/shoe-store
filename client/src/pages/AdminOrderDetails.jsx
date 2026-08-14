import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const statuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // =========================
  // FETCH ORDER
  // =========================

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/admin/orders/${id}`);

      console.log("ADMIN ORDER DETAILS:", response.data);

      setOrder(response.data.order);
    } catch (error) {
      console.error("ADMIN ORDER DETAILS ERROR:", error);

      setError(error.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const response = await api.put(`/admin/orders/${id}/status`, {
        status,
      });

      console.log("ORDER STATUS UPDATED:", response.data);

      setOrder(response.data.order);
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      setError(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-5">⚠️</div>

          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>

          <p className="text-gray-500 mt-2">
            {error || "Unable to find this order."}
          </p>

          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =========================
          HEADER
      ========================= */}

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-sm text-gray-500 hover:text-black mb-5"
          >
            ← Back to Orders
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                Admin Panel
              </p>

              <h1 className="text-4xl font-bold text-gray-900 mt-2">
                Order Details
              </h1>

              <p className="text-gray-500 mt-2 break-all">Order #{order._id}</p>
            </div>

            <span
              className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                order.status,
              )}`}
            >
              {order.status || "Pending"}
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          MAIN
      ========================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =========================
              LEFT
          ========================= */}

          <div className="lg:col-span-2 space-y-6">
            {/* ORDER ITEMS */}

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Ordered Products
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {order.items?.length || 0} product
                  {order.items?.length === 1 ? "" : "s"} in this order
                </p>
              </div>

              <div className="p-6 space-y-5">
                {order.items?.map((item, index) => {
                  const product = item.product;

                  const productName = item.name || product?.name || "Product";

                  const price = Number(
                    item.price || product?.discountPrice || product?.price || 0,
                  );

                  const quantity = Number(item.quantity || 1);

                  const subtotal = price * quantity;

                  const image = product?.images?.[0] || product?.image;

                  return (
                    <div
                      key={item._id || index}
                      className="flex flex-col sm:flex-row gap-5 border-b last:border-b-0 pb-5 last:pb-0"
                    >
                      {/* IMAGE */}

                      <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* INFO */}

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {productName}
                        </h3>

                        {product?.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-5 mt-4 text-sm">
                          <span className="text-gray-500">
                            Size:{" "}
                            <strong className="text-gray-900">
                              {item.size || "N/A"}
                            </strong>
                          </span>

                          <span className="text-gray-500">
                            Quantity:{" "}
                            <strong className="text-gray-900">
                              {quantity}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Price
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                          ₹{price.toLocaleString("en-IN")}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Subtotal: ₹{subtotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TOTAL */}

              <div className="bg-gray-50 border-t px-6 py-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Amount</span>

                  <span className="text-2xl font-bold text-gray-900">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* SHIPPING */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Name
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.name || order.user?.name || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.phone || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Address
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.address || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    City
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.city || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    State
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.state || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Pincode
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {order.shippingAddress?.pincode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              RIGHT
          ========================= */}

          <div className="space-y-6">
            {/* CUSTOMER */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900">Customer</h2>

              <div className="mt-5">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
                  {(order.user?.name || order.shippingAddress?.name || "C")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3 className="font-bold text-gray-900 mt-4">
                  {order.user?.name ||
                    order.shippingAddress?.name ||
                    "Customer"}
                </h3>

                <p className="text-sm text-gray-500 mt-1 break-all">
                  {order.user?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>

              <div className="space-y-4 mt-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Method
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {order.paymentMethod || "COD"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Payment Status
                  </p>

                  <p className="font-semibold text-gray-900 mt-1 capitalize">
                    {order.paymentStatus || "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Order Date
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* UPDATE STATUS */}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900">Update Order</h2>

              <p className="text-sm text-gray-500 mt-1">
                Change the current order status.
              </p>

              <div className="space-y-2 mt-5">
                {statuses.map((status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => updateStatus(status)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                      order.status === status
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-black"
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {updating && (
                <p className="text-sm text-gray-500 mt-4">
                  Updating order status...
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetails;
