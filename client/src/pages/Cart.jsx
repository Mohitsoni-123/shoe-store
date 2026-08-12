import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const items = cart?.items || [];

  // ================= TOTAL =================

  const subtotal = items.reduce((total, item) => {
    const product = item.product;

    if (!product) return total;

    const price =
      product.discountPrice &&
      Number(product.discountPrice) < Number(product.price)
        ? Number(product.discountPrice)
        : Number(product.price);

    return total + price * Number(item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0;

  const total = subtotal + shipping;

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="text-lg font-medium text-gray-600">
              Loading cart...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ================= EMPTY CART =================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Your Cart
            </h1>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center">

            <div className="mb-6 text-6xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ================= CART =================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <section className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Your Cart
          </h1>

          <p className="mt-2 text-gray-500">
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ================= ITEMS ================= */}

          <div className="space-y-4 lg:col-span-2">

            {items.map((item) => {

              const product = item.product;

              if (!product) return null;

              const price =
                product.discountPrice &&
                Number(product.discountPrice) <
                  Number(product.price)
                  ? Number(product.discountPrice)
                  : Number(product.price);

              const itemTotal =
                price * Number(item.quantity);

              const image =
                product.images?.[0] ||
                "https://via.placeholder.com/300x300?text=No+Image";

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >

                  <div className="flex flex-col gap-5 sm:flex-row">

                    {/* IMAGE */}

                    <Link
                      to={`/products/${product._id}`}
                      className="shrink-0"
                    >
                      <div className="h-32 w-32 overflow-hidden rounded-xl bg-gray-100">

                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />

                      </div>
                    </Link>

                    {/* DETAILS */}

                    <div className="flex flex-1 flex-col">

                      <div className="flex flex-col justify-between gap-3 sm:flex-row">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                            {product.brand}
                          </p>

                          <Link
                            to={`/products/${product._id}`}
                          >
                            <h2 className="mt-1 text-lg font-bold text-gray-900 hover:text-gray-600">
                              {product.name}
                            </h2>
                          </Link>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">

                            {item.size && (
                              <span>
                                Size:{" "}
                                <span className="font-medium text-gray-900">
                                  {item.size}
                                </span>
                              </span>
                            )}

                            {item.color && (
                              <span>
                                Color:{" "}
                                <span className="font-medium capitalize text-gray-900">
                                  {item.color}
                                </span>
                              </span>
                            )}

                          </div>

                        </div>

                        {/* PRICE */}

                        <div className="text-left sm:text-right">

                          <p className="text-lg font-bold text-gray-900">
                            ₹{itemTotal}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₹{price} each
                          </p>

                        </div>

                      </div>

                      {/* BOTTOM */}

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                        {/* QUANTITY */}

                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Number(item.quantity) - 1
                              )
                            }
                            disabled={
                              Number(item.quantity) <= 1
                            }
                            className="px-4 py-2 font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Number(item.quantity) + 1
                              )
                            }
                            className="px-4 py-2 font-bold hover:bg-gray-100"
                          >
                            +
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="inline-flex items-center pt-3 text-sm font-semibold text-gray-700 hover:text-black"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* ================= SUMMARY ================= */}

          <div>

            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{subtotal}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-semibold text-green-600">
                    FREE
                  </span>

                </div>

                <div className="border-t border-gray-200 pt-4">

                  <div className="flex justify-between">

                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      ₹{total}
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Secure checkout • Free shipping
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Cart;