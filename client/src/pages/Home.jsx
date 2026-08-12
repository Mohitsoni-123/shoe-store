import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 4);

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products.slice(0, 4);

  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 mb-5">
                Step Into Style
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="block">
                  Perfect Pair.
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg leading-8 max-w-xl">
                Discover premium shoes designed for comfort,
                performance and everyday style.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <Link
                  to="/products"
                  className="bg-black text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Shop Now
                </Link>

                <Link
                  to="/products"
                  className="border border-gray-300 bg-white text-gray-900 px-7 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Explore Collection
                </Link>

              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-black rounded-3xl h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">

                <div className="text-center text-white px-8">
                  <p className="text-gray-400 uppercase tracking-[0.3em] text-sm mb-4">
                    New Collection
                  </p>

                  <h2 className="text-4xl md:text-5xl font-bold">
                    Walk Different.
                  </h2>

                  <p className="text-gray-400 mt-4">
                    Premium footwear for every journey.
                  </p>
                </div>

              </div>

              <div className="absolute -bottom-5 -left-5 bg-white shadow-xl rounded-2xl px-6 py-4">
                <p className="text-xs text-gray-500">
                  Premium Quality
                </p>

                <p className="font-bold text-gray-900">
                  Built For Comfort
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Explore
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Shop By Category
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden sm:block text-sm font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {[
            {
              name: "Running",
              description: "Lightweight performance",
              query: "Running",
            },
            {
              name: "Sports",
              description: "Made for movement",
              query: "Sports",
            },
            {
              name: "Casual",
              description: "Everyday comfort",
              query: "Casual",
            },
            {
              name: "Formal",
              description: "Classic & elegant",
              query: "Formal",
            },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.query}`}
              className="group bg-gray-100 rounded-2xl p-7 min-h-[180px] flex flex-col justify-end hover:bg-black hover:text-white transition duration-300"
            >
              <p className="text-sm opacity-60 mb-2">
                Collection
              </p>

              <h3 className="text-2xl font-bold">
                {category.name}
              </h3>

              <p className="text-sm opacity-60 mt-2">
                {category.description}
              </p>
            </Link>
          ))}

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Our Picks
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:block font-semibold text-sm hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl h-96 animate-pulse"
                />
              ))}

            </div>
          ) : displayProducts.length === 0 ? (

            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-500">
                No products available yet.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {displayProducts.map((product) => (

                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300"
                >

                  <div className="h-64 bg-gray-100 overflow-hidden">

                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {product.brand}
                    </p>

                    <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-3">

                      <span className="font-bold text-gray-900">
                        ₹{product.discountPrice || product.price}
                      </span>

                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* ================= PROMO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="bg-black text-white rounded-3xl px-8 py-14 md:px-14 md:py-20">

          <div className="max-w-2xl">

            <p className="text-gray-400 uppercase tracking-widest text-sm">
              Limited Time
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Upgrade Your
              <span className="block">
                Shoe Collection.
              </span>
            </h2>

            <p className="text-gray-400 mt-5 leading-7">
              Find your next favorite pair from our latest
              collection.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-white text-black px-7 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Shop Collection
            </Link>

          </div>

        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="text-center mb-12">

          <p className="text-sm uppercase tracking-widest text-gray-500">
            Why ShoeStore
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Built Around You
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="text-3xl mb-5">
              ✓
            </div>

            <h3 className="text-xl font-bold">
              Premium Quality
            </h3>

            <p className="text-gray-500 mt-3 leading-7">
              Carefully selected products made for lasting
              comfort and performance.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="text-3xl mb-5">
              🚚
            </div>

            <h3 className="text-xl font-bold">
              Fast Delivery
            </h3>

            <p className="text-gray-500 mt-3 leading-7">
              Get your favorite shoes delivered quickly and
              safely to your doorstep.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="text-3xl mb-5">
              ↩
            </div>

            <h3 className="text-xl font-bold">
              Easy Returns
            </h3>

            <p className="text-gray-500 mt-3 leading-7">
              Shop confidently with a simple and convenient
              return experience.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;