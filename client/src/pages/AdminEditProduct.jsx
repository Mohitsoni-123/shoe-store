import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    sizes: "",
    colors: "",
    stock: "",
    isFeatured: false,
  });

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("PRODUCT RESPONSE:", data);

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to fetch product");
          return;
        }

        const product = data.product;

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          category: product.category || "",

          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : product.sizes || "",

          colors: Array.isArray(product.colors)
            ? product.colors.join(", ")
            : product.colors || "",

          stock: product.stock ?? "",
          isFeatured: product.isFeatured || false,
        });
      } catch (error) {
        console.error("FETCH PRODUCT ERROR:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const body = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        description: formData.description.trim(),

        price: Number(formData.price),

        discountPrice:
          formData.discountPrice === ""
            ? null
            : Number(formData.discountPrice),

        category: formData.category.trim(),

        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        colors: formData.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        stock: Number(formData.stock),

        isFeatured: formData.isFeatured,
      };

      console.log("UPDATE PRODUCT BODY:", body);

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      console.log("UPDATE PRODUCT RESPONSE:", data);

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to update product");
        return;
      }

      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1>Edit Product</h1>

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* NAME */}

        <div style={{ marginBottom: "15px" }}>
          <label>Product Name</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        {/* BRAND */}

        <div style={{ marginBottom: "15px" }}>
          <label>Brand</label>
          <br />

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        {/* DESCRIPTION */}

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* PRICE */}

        <div style={{ marginBottom: "15px" }}>
          <label>Price</label>
          <br />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* DISCOUNT PRICE */}

        <div style={{ marginBottom: "15px" }}>
          <label>Discount Price</label>
          <br />

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            min="0"
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* CATEGORY */}

        <div style={{ marginBottom: "15px" }}>
          <label>Category</label>
          <br />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* SIZES */}

        <div style={{ marginBottom: "15px" }}>
          <label>Sizes</label>
          <br />

          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="7, 8, 9, 10"
            required
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <small>
            Enter sizes separated by commas.
          </small>
        </div>

        {/* COLORS */}

        <div style={{ marginBottom: "15px" }}>
          <label>Colors</label>
          <br />

          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Black, White, Red"
            required
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <small>
            Enter colors separated by commas.
          </small>
        </div>

        {/* STOCK */}

        <div style={{ marginBottom: "15px" }}>
          <label>Stock</label>
          <br />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* FEATURED */}

        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            {" "}Featured Product
          </label>
        </div>

        {/* BUTTONS */}

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          disabled={saving}
          style={{
            marginLeft: "10px",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;