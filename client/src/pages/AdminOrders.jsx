import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");

      console.log("ADMIN ORDERS RESPONSE:", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You are not authorized to access admin orders."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          status,
        }
      );

      console.log(
        "STATUS UPDATE RESPONSE:",
        response.data
      );

      const updatedOrder = response.data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // STATUS STYLE
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

          <p className="mt-4 text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <button
            onClick={() => navigate("/admin")}
            className="text-sm text-gray-500 hover:text-black mb-5"
          >
            ← Back to Dashboard
          </button>

          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Admin Panel
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-2">

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Orders
              </h1>

              <p className="text-gray-500 mt-2">
                Manage and track customer orders.
              </p>
            </div>

            <div className="bg-gray-100 px-5 py-3 rounded-xl">
              <span className="text-sm text-gray-500">
                Total Orders
              </span>

              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && orders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no customer orders.
            </p>

          </div>
        )}

        {/* DESKTOP TABLE */}

        {orders.length > 0 && (
          <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Order
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Items
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Payment
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {orders.map((order) => (

                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* ORDER */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-gray-900">
                          #{order._id.slice(-8)}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </p>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-5">

                        <p className="font-medium text-gray-900">
                          {order.user?.name ||
                            order.shippingAddress?.name ||
                            "Customer"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.user?.email || "N/A"}
                        </p>

                      </td>

                      {/* ITEMS */}

                      <td className="px-6 py-5">

                        <p className="font-medium text-gray-900">
                          {order.items?.length || 0} item
                          {order.items?.length === 1
                            ? ""
                            : "s"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {order.items
                            ?.map(
                              (item) =>
                                item.name ||
                                item.product?.name
                            )
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(", ") || "Products"}
                        </p>

                      </td>

                      {/* AMOUNT */}

                      <td className="px-6 py-5">

                        <p className="font-bold text-gray-900">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </td>

                      {/* PAYMENT */}

                      <td className="px-6 py-5">

                        <p className="font-medium text-gray-900">
                          {order.paymentMethod ||
                            "COD"}
                        </p>

                        <span className="text-xs text-gray-500 capitalize">
                          {order.paymentStatus ||
                            "Pending"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Pending"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">

                        <div className="flex flex-col gap-2">

                          <select
                            value={
                              order.status ||
                              "Pending"
                            }
                            disabled={
                              updatingId ===
                              order._id
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-black disabled:opacity-50"
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order._id}`
                              )
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium hover:border-black transition"
                          >
                            View Details
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* MOBILE CARDS */}

        {orders.length > 0 && (
          <div className="lg:hidden space-y-5">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl p-5"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Order
                    </p>

                    <p className="font-bold text-gray-900 mt-1">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status ||
                      "Pending"}
                  </span>

                </div>

                {/* CUSTOMER */}

                <div className="border-t mt-5 pt-5">

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Customer
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {order.user?.name ||
                      order.shippingAddress?.name ||
                      "Customer"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.user?.email ||
                      "N/A"}
                  </p>

                </div>

                {/* SUMMARY */}

                <div className="grid grid-cols-2 gap-4 border-t mt-5 pt-5">

                  <div>

                    <p className="text-xs text-gray-400 uppercase">
                      Items
                    </p>

                    <p className="font-semibold mt-1">
                      {order.items?.length || 0}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400 uppercase">
                      Total
                    </p>

                    <p className="font-bold mt-1">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

                {/* PAYMENT */}

                <div className="border-t mt-5 pt-5">

                  <p className="text-xs text-gray-400 uppercase">
                    Payment
                  </p>

                  <p className="font-medium mt-1">
                    {order.paymentMethod ||
                      "COD"}
                  </p>

                </div>

                {/* STATUS */}

                <div className="border-t mt-5 pt-5">

                  <label className="text-xs text-gray-400 uppercase">
                    Update Status
                  </label>

                  <select
                    value={
                      order.status ||
                      "Pending"
                    }
                    disabled={
                      updatingId ===
                      order._id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                    className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-3 bg-white outline-none focus:border-black disabled:opacity-50"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

                {/* DETAILS */}

                <button
                  onClick={() =>
                    navigate(
                      `/admin/orders/${order._id}`
                    )
                  }
                  className="w-full mt-4 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  View Order Details
                </button>

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default AdminOrders;