import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  // Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/cart");

        const result = response.data;

        console.log("CHECKOUT CART RESPONSE:", result);

        if (!result.success) {
          setError(result.message || "Failed to load cart");
          return;
        }

        setCart(result.cart);
      } catch (error) {
        console.error("CHECKOUT CART ERROR:", error);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce((total, item) => {
      const price =
        item.product?.discountPrice ||
        item.product?.price ||
        0;

      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    setError("");

    if (
      !address.fullName ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setError("Please fill all address details");
      return;
    }

    console.log("ORDER ADDRESS:", address);
    console.log("ORDER TOTAL:", total);

    alert("Checkout details validated successfully!");

    // Next step mein yahan Place Order API connect karenge.
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading checkout...
        </p>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>

          <button
            onClick={() => navigate("/cart")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
          <h1 className="text-2xl font-bold mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mb-6">
            Add some products before checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Secure Checkout
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your order details below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* Shipping Address */}
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-2">
                Shipping Address
              </h2>

              <p className="text-gray-500 mb-6">
                Enter the address where you want your order delivered.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5">
                  {error}
                </div>
              )}

              <form
                onSubmit={handlePlaceOrder}
                className="space-y-5"
              >
                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleChange}
                      placeholder="Mohit Soni"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="House no, street, area..."
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* City + State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Jaipur"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="Rajasthan"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="302001"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Mobile button */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>

            {/* Products */}
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Order Items
              </h2>

              <div className="space-y-5">
                {cart.items.map((item) => {
                  const product = item.product;

                  const price =
                    product?.discountPrice ||
                    product?.price ||
                    0;

                  const image =
                    product?.images?.[0] || "";

                  return (
                    <div
                      key={`${product?._id}-${item.size}`}
                      className="flex gap-5 border-b pb-5 last:border-b-0"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          {product?.brand}
                        </p>

                        <h3 className="font-semibold text-lg mt-1">
                          {product?.name}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Size: {item.size}
                        </p>

                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="font-bold">
                        ₹{price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="bg-white border rounded-2xl p-6 sticky top-6">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    FREE
                  </span>
                </div>

                <div className="border-t pt-5 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

              </div>

              <button
                onClick={handlePlaceOrder}
                className="hidden lg:block w-full bg-black text-white py-4 rounded-xl font-semibold mt-6 hover:bg-gray-800 transition"
              >
                Place Order
              </button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Secure checkout • Free shipping
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;