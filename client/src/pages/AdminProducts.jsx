import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
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

    if (!confirmDelete) return;

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

        alert("Product deleted successfully");
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      alert("Failed to delete product");
    }
  };

  // =========================
  // CATEGORIES
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
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>⌛</div>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Products</h1>

          <p style={styles.subtitle}>Manage your ShoeStore products</p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          style={styles.addButton}
        >
          + Add Product
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && <div style={styles.error}>⚠️ {error}</div>}

      {/* ================= STATISTICS ================= */}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👟</div>

          <div>
            <p style={styles.statTitle}>Total Products</p>

            <h2 style={styles.statValue}>{products.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔎</div>

          <div>
            <p style={styles.statTitle}>Search Results</p>

            <h2 style={styles.statValue}>{filteredProducts.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📂</div>

          <div>
            <p style={styles.statTitle}>Categories</p>

            <h2 style={styles.statValue}>{categories.length - 1}</h2>
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div style={styles.filterBox}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>

          <input
            type="text"
            placeholder="Search by product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setCategory("All");
          }}
          style={styles.clearButton}
        >
          Clear
        </button>
      </div>

      {/* ================= RESULT COUNT ================= */}

      <div style={styles.resultHeader}>
        <p>
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </p>
      </div>

      {/* ================= PRODUCTS ================= */}

      {filteredProducts.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📦</div>

          <h2>No Products Found</h2>

          <p>Try changing your search or category filter.</p>
        </div>
      ) : (
        <div style={styles.productGrid}>
          {filteredProducts.map((product) => {
            const finalPrice = product.discountPrice || product.price || 0;

            return (
              <div key={product._id} style={styles.productCard}>
                {/* IMAGE */}

                <div style={styles.imageContainer}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={styles.productImage}
                    />
                  ) : (
                    <div style={styles.noImage}>👟</div>
                  )}

                  {product.discountPrice &&
                    product.price > product.discountPrice && (
                      <span style={styles.discountBadge}>SALE</span>
                    )}
                </div>

                {/* PRODUCT INFO */}

                <div style={styles.productInfo}>
                  <span style={styles.categoryBadge}>
                    {product.category || "General"}
                  </span>

                  <h2 style={styles.productName}>{product.name}</h2>

                  <p style={styles.brand}>{product.brand || "Unknown Brand"}</p>

                  {/* PRICE */}

                  <div style={styles.priceRow}>
                    <strong style={styles.price}>₹{finalPrice}</strong>

                    {product.discountPrice &&
                      product.price > product.discountPrice && (
                        <span style={styles.oldPrice}>₹{product.price}</span>
                      )}
                  </div>

                  {/* STOCK */}

                  <div style={styles.stockRow}>
                    <span>Stock</span>

                    <strong
                      style={{
                        color: product.stock > 0 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {product.stock || 0}
                    </strong>
                  </div>

                  {/* ACTIONS */}

                  <div style={styles.actions}>
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      style={styles.editButton}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      style={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= BACK ================= */}

      <div style={styles.backContainer}>
        <button onClick={() => navigate("/admin")} style={styles.backButton}>
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: "35px",
    boxSizing: "border-box",
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },

  loader: {
    fontSize: "40px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  addButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "7px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  statIcon: {
    fontSize: "30px",
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  statValue: {
    margin: "5px 0 0",
    color: "#111827",
  },

  filterBox: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  searchWrapper: {
    position: "relative",
    flex: 1,
    minWidth: "250px",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "10px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px 11px 38px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    outline: "none",
  },

  select: {
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    minWidth: "150px",
  },

  clearButton: {
    padding: "10px 18px",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
  },

  resultHeader: {
    color: "#6b7280",
    marginBottom: "15px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  productCard: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
  },

  imageContainer: {
    height: "230px",
    background: "#f9fafb",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
  },

  discountBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#dc2626",
    color: "white",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  productInfo: {
    padding: "18px",
  },

  categoryBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
  },

  productName: {
    fontSize: "20px",
    margin: "12px 0 5px",
  },

  brand: {
    color: "#6b7280",
    margin: 0,
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
  },

  price: {
    fontSize: "20px",
  },

  oldPrice: {
    color: "#9ca3af",
    textDecoration: "line-through",
  },

  stockRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    paddingTop: "12px",
    borderTop: "1px solid #eee",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  editButton: {
    flex: 1,
    padding: "9px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteButton: {
    flex: 1,
    padding: "9px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  empty: {
    background: "white",
    padding: "60px",
    textAlign: "center",
    borderRadius: "10px",
  },

  emptyIcon: {
    fontSize: "50px",
  },

  backContainer: {
    marginTop: "30px",
  },

  backButton: {
    padding: "11px 18px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminProducts;
