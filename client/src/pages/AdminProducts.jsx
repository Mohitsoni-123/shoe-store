import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== id
          )
        );
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Manage Products</h1>

        <button
          onClick={() => navigate("/admin/products/add")}
        >
          + Add Product
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <h3>No products found</h3>
      ) : (
        <div>
          {products.map((product) => (
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

                <div style={{ flex: 1 }}>
                  <h2>{product.name}</h2>

                  <p>
                    Brand: {product.brand}
                  </p>

                  <p>
                    Category: {product.category}
                  </p>

                  <p>
                    Price: ₹
                    {product.discountPrice ||
                      product.price}
                  </p>

                  <p>
                    Stock: {product.stock}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/products/edit/${product._id}`
                      )
                    }
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
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
    </div>
  );
};

export default AdminProducts;