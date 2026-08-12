import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/products");

        const data = await response.json();

        console.log("PRODUCTS RESPONSE:", data);

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to fetch products");
          return;
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);

        setError(
          "Unable to connect to server. Please make sure backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>

              <p className="text-lg font-medium text-gray-600">
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mb-4 text-4xl">⚠️</div>

              <h2 className="mb-2 text-xl font-bold text-red-700">
                Something went wrong
              </h2>

              <p className="text-red-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Our Collection
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            All Products
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Explore our latest collection of premium shoes designed for comfort,
            performance and style.
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Product Count */}

        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* No Products */}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <div className="mb-4 text-5xl">👟</div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are currently no products available.
            </p>
          </div>
        ) : (
          /* Product Grid */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const hasDiscount =
                product.discountPrice &&
                Number(product.discountPrice) < Number(product.price);

              const displayPrice = hasDiscount
                ? product.discountPrice
                : product.price;

              const image =
                product.images?.[0] ||
                "https://via.placeholder.com/600x600?text=No+Image";

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* ================= IMAGE ================= */}

                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Sale Badge */}

                      {hasDiscount && (
                        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                          Sale
                        </span>
                      )}

                      {/* Featured Badge */}

                      {product.isFeatured && (
                        <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow">
                          Featured
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* ================= CONTENT ================= */}

                  <div className="p-5">
                    {/* Brand */}

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                      {product.brand}
                    </p>

                    {/* Name */}

                    <Link to={`/products/${product._id}`}>
                      <h2 className="mt-2 line-clamp-1 text-lg font-bold text-gray-900 transition hover:text-gray-600">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Description */}

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}

                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{displayPrice}
                      </span>

                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock */}

                    <div className="mt-3">
                      {Number(product.stock) > 0 ? (
                        <span className="text-xs font-medium text-green-600">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Button */}

                    <Link
                      to={`/products/${product._id}`}
                      className="mt-5 block w-full rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
