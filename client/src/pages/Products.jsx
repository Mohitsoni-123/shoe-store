import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  // Temporary products
  // Backend integration next step mein karenge
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      console.log("PRODUCTS RESPONSE:", data);

      if (!data.success) {
        setError(data.message || "Failed to fetch products");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">
            Shoe Store
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">All Products</h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Discover our latest collection of premium shoes, sneakers and sports
            footwear.
          </p>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Top Bar */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Shoes Collection
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} products available
            </p>
          </div>

          {/* Sort */}
          <select className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black">
            <option>Sort by</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-5 text-lg font-semibold">Filters</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Search</label>

              <input
                type="text"
                placeholder="Search shoes..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold">Category</h4>

              <div className="space-y-3 text-sm text-gray-600">
                <label className="flex items-center gap-3">
                  <input type="checkbox" />
                  Running
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" />
                  Sneakers
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" />
                  Sports
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" />
                  Casual
                </label>
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Price Range</h4>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />

                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Discount */}
                    <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      SALE
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {product.brand}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.discountPrice}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="mt-5 block w-full rounded-lg bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
