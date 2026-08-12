import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Status filter
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");

      console.log(
        "ADMIN ORDERS RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(
          response.data.message ||
            "Failed to load orders"
        );
      }
    } catch (error) {
      console.error(
        "GET ADMIN ORDERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      console.log(
        "UPDATE STATUS RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        alert(
          "Order status updated successfully"
        );
      }
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredOrders = orders.filter(
    (order) => {
      const searchText =
        search.toLowerCase().trim();

      const orderId =
        order._id?.toLowerCase() || "";

      const customerName =
        order.user?.name
          ?.toLowerCase() || "";

      const customerEmail =
        order.user?.email
          ?.toLowerCase() || "";

      const matchesSearch =
        orderId.includes(searchText) ||
        customerName.includes(searchText) ||
        customerEmail.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Manage Orders</h1>

      <p>
        Showing{" "}
        <strong>
          {filteredOrders.length}
        </strong>{" "}
        of{" "}
        <strong>{orders.length}</strong>{" "}
        orders
      </p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
          marginBottom: "30px",
          alignItems: "center",
        }}
      >
        {/* Search */}

        <input
          type="text"
          placeholder="Search by order ID, name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "10px",
            width: "320px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {/* Status Filter */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="All">
            All Status
          </option>

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

        {/* Clear */}

        <button
          type="button"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      {/* =========================
          EMPTY ORDERS
      ========================= */}

      {orders.length === 0 ? (
        <h3>No orders found.</h3>
      ) : filteredOrders.length === 0 ? (
        <h3>
          No orders match your search/filter.
        </h3>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              {/* ORDER ID */}

              <h2>
                Order #
                {order._id?.slice(-6)}
              </h2>

              {/* CUSTOMER */}

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {order.user?.name ||
                  "Unknown"}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {order.user?.email ||
                  "N/A"}
              </p>

              {/* AMOUNT */}

              <p>
                <strong>
                  Total Amount:
                </strong>{" "}
                ₹
                {order.totalAmount || 0}
              </p>

              {/* DATE */}

              <p>
                <strong>
                  Order Date:
                </strong>{" "}
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* STATUS */}

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <label>
                  <strong>
                    Status:
                  </strong>
                </label>

                <select
                  value={
                    order.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value
                    )
                  }
                  style={{
                    padding: "8px",
                    marginLeft: "10px",
                  }}
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

              {/* VIEW DETAILS */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/admin/orders/${order._id}`
                  )
                }
                style={{
                  marginTop: "15px",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          BACK BUTTON
      ========================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <button
          onClick={() =>
            navigate("/admin")
          }
        >
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;