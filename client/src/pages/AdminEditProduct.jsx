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

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

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

        if (!data.success) {
          setError(data.message || "Failed to fetch product");
          return;
        }

        const product = data.product;

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          description: product.description || "",
          price: product.price || "",
          discountPrice: product.discountPrice || "",
          category: product.category || "",
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : product.sizes || "",
          colors: Array.isArray(product.colors)
            ? product.colors.join(", ")
            : product.colors || "",
          stock: product.stock || "",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const body = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        price: Number(formData.price),
        discountPrice:
          formData.discountPrice === ""
            ? ""
            : Number(formData.discountPrice),
        category: formData.category,
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

      if (!data.success) {
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

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <h1>Edit Product</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Product Name</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Brand</label>
          <br />

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Price</label>
          <br />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Discount Price</label>
          <br />

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Category</label>
          <br />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Sizes</label>
          <br />

          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="7, 8, 9, 10"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Colors</label>
          <br />

          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Black, White, Red"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Stock</label>
          <br />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

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

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;