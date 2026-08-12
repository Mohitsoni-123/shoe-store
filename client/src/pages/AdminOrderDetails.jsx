import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =========================
  // FETCH ORDER DETAILS
  // =========================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/admin/orders/${id}`);

      console.log("ORDER DETAILS RESPONSE:", response.data);

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || "Failed to load order details");
      }
    } catch (error) {
      console.error("GET ORDER DETAILS ERROR:", error);

      setError(error.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      const response = await api.put(`/admin/orders/${id}/status`, {
        status: newStatus,
      });

      console.log("UPDATE ORDER STATUS RESPONSE:", response.data);

      if (response.data.success) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: newStatus,
        }));

        alert("Order status updated successfully");
      } else {
        alert(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("UPDATE ORDER STATUS ERROR:", error);

      alert(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Order Details...</h2>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h2 style={{ color: "red" }}>{error}</h2>

        <button onClick={() => navigate("/admin/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Order not found</h2>

        <button onClick={() => navigate("/admin/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  // =========================
  // TOTAL
  // =========================

  const totalAmount = Number(order.totalAmount || 0);

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <h1>Order Details</h1>

      <p>
        <strong>Order ID:</strong> {order._id}
      </p>

      <p>
        <strong>Order Date:</strong>{" "}
        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
      </p>

      {/* =========================
          CUSTOMER INFORMATION
      ========================= */}

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "25px",
          borderRadius: "8px",
        }}
      >
        <h2>Customer Information</h2>

        <p>
          <strong>Name:</strong> {order.user?.name || "Unknown"}
        </p>

        <p>
          <strong>Email:</strong> {order.user?.email || "N/A"}
        </p>
      </div>

      {/* =========================
          SHIPPING ADDRESS
      ========================= */}

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "25px",
          borderRadius: "8px",
        }}
      >
        <h2>Shipping Address</h2>

        {order.shippingAddress ? (
          <>
            <p>
              <strong>Name:</strong> {order.shippingAddress.name || "N/A"}
            </p>

            <p>
              <strong>Phone:</strong> {order.shippingAddress.phone || "N/A"}
            </p>

            <p>
              <strong>Address:</strong> {order.shippingAddress.address || "N/A"}
            </p>

            <p>
              <strong>City:</strong> {order.shippingAddress.city || "N/A"}
            </p>

            <p>
              <strong>State:</strong> {order.shippingAddress.state || "N/A"}
            </p>

            <p>
              <strong>PIN Code:</strong>{" "}
              {order.shippingAddress.pincode || "N/A"}
            </p>
          </>
        ) : (
          <p>Shipping address not available.</p>
        )}
      </div>

      {/* =========================
          ORDER ITEMS
      ========================= */}

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "25px",
          borderRadius: "8px",
        }}
      >
        <h2>Order Items</h2>

        {!order.items || order.items.length === 0 ? (
          <p>No products found.</p>
        ) : (
          order.items.map((item, index) => {
            const price = Number(
              item.price ??
                item.product?.discountPrice ??
                item.product?.price ??
                0,
            );

            const quantity = Number(item.quantity || 1);

            return (
              <div
                key={item._id || index}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "15px 0",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                {/* PRODUCT IMAGE */}

                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product?.name || "Product"}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}

                {/* PRODUCT INFO */}

                <div>
                  <h3>{item.product?.name || "Product"}</h3>

                  <p>
                    <strong>Size:</strong> {item.size || "N/A"}
                  </p>

                  <p>
                    <strong>Quantity:</strong> {quantity}
                  </p>

                  <p>
                    <strong>Price:</strong> ₹{price}
                  </p>

                  <p>
                    <strong>Subtotal:</strong> ₹{price * quantity}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================
          ORDER SUMMARY
      ========================= */}

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "25px",
          borderRadius: "8px",
        }}
      >
        <h2>Order Summary</h2>

        {/* STATUS */}

        <div>
          <strong>Status:</strong>

          <select
            value={order.status || "Pending"}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            style={{
              padding: "8px",
              marginLeft: "10px",
            }}
          >
            <option value="Pending">Pending</option>

            <option value="Confirmed">Confirmed</option>

            <option value="Shipped">Shipped</option>

            <option value="Delivered">Delivered</option>

            <option value="Cancelled">Cancelled</option>
          </select>

          {updatingStatus && (
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              Updating...
            </span>
          )}
        </div>

        {/* TOTAL */}

        <h2 style={{ marginTop: "20px" }}>Total Amount: ₹{totalAmount}</h2>
      </div>

      {/* =========================
          BUTTONS
      ========================= */}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button type="button" onClick={() => navigate("/admin/orders")}>
          Back to Orders
        </button>

        <button type="button" onClick={() => navigate("/admin")}>
          Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
