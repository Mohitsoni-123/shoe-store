import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Category filter
  const [category, setCategory] = useState("All");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/products");

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id),
        );
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert("Failed to delete product");
    }
  };

  // =========================
  // GET UNIQUE CATEGORIES
  // =========================

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.brand?.toLowerCase().includes(searchText);

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Manage Products</h1>

        <button onClick={() => navigate("/admin/products/add")}>
          + Add Product
        </button>
      </div>

      {/* Error */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search + Filter */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {/* Search */}

        <input
          type="text"
          placeholder="Search product or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {/* Category */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Clear */}

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setCategory("All");
          }}
        >
          Clear
        </button>
      </div>

      {/* Result Count */}

      <p>
        Showing <strong>{filteredProducts.length}</strong> of{" "}
        <strong>{products.length}</strong> products
      </p>

      {/* Products */}

      {filteredProducts.length === 0 ? (
        <h3>No products found.</h3>
      ) : (
        <div>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                {/* Image */}

                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Product Info */}

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <h2>{product.name}</h2>

                  <p>Brand: {product.brand}</p>

                  <p>Category: {product.category}</p>

                  <p>Price: ₹{product.discountPrice || product.price}</p>

                  <p>Stock: {product.stock}</p>
                </div>

                {/* Actions */}

                <div>
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      color: "red",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back */}

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <button onClick={() => navigate("/admin")}>
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminProducts;
