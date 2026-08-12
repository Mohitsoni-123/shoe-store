import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // =================================
  // FETCH PRODUCT
  // =================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const result = await response.json();

        console.log(
          "PRODUCT DETAILS RESPONSE:",
          result
        );

        if (!response.ok || !result.success) {
          setError(
            result.message ||
              "Failed to fetch product"
          );

          return;
        }

        setProduct(
          result.product || result.data
        );
      } catch (error) {
        console.error(
          "FETCH PRODUCT ERROR:",
          error
        );

        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =================================
  // ADD TO CART
  // =================================
  const handleAddToCart = async () => {
    try {
      if (!product) {
        return;
      }

      if (!selectedSize) {
        alert("Please select a size");
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      setAdding(true);

      const result = await addToCart(
        product._id,
        selectedSize,
        1
      );

      console.log(
        "ADD TO CART RESULT:",
        result
      );

      if (!result.success) {
        alert(
          result.message ||
            "Failed to add product"
        );

        return;
      }

      alert("Product added to cart successfully!");

    } catch (error) {
      console.error(
        "HANDLE ADD TO CART ERROR:",
        error
      );

      alert("Failed to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  // =================================
  // LOADING
  // =================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Loading product...</h2>
      </div>
    );
  }

  // =================================
  // ERROR
  // =================================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h2>{error}</h2>

          <button
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // =================================
  // PRODUCT NOT FOUND
  // =================================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ================= IMAGE ================= */}

          <div>
            {product.images &&
            product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}

          <div>

            <p className="text-sm text-gray-500 uppercase">
              {product.brand}
            </p>

            <h1 className="text-3xl font-bold mt-2">
              {product.name}
            </h1>

            <p className="text-gray-600 mt-5 leading-7">
              {product.description}
            </p>

            {/* PRICE */}

            <div className="mt-6">

              {product.discountPrice ? (
                <div className="flex items-center gap-4">

                  <span className="text-3xl font-bold text-black">
                    ₹{product.discountPrice}
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.price}
                  </span>

                </div>
              ) : (
                <span className="text-3xl font-bold">
                  ₹{product.price}
                </span>
              )}

            </div>

            {/* ================= SIZE ================= */}

            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.sizes?.map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`px-5 py-3 border rounded-lg font-medium transition ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* ================= STOCK ================= */}

            <div className="mt-6">

              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stock})
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  Out of Stock
                </p>
              )}

            </div>

            {/* ================= ADD TO CART ================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                adding ||
                product.stock <= 0
              }
              className="w-full mt-8 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
            >
              {adding
                ? "Adding..."
                : "Add to Cart"}
            </button>

            {/* ================= BUY NOW ================= */}

            <button
              type="button"
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size");
                  return;
                }

                alert(
                  "Buy Now functionality will be added next."
                );
              }}
              className="w-full mt-3 border border-black py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;