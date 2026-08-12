import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddProduct.css";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    sizes: [],
    colors: [],
    stock: "",
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // ADD SIZE
  // =========================

  const addSize = () => {
    const size = sizeInput.trim();

    if (!size) return;

    if (formData.sizes.includes(size)) {
      setSizeInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size],
    }));

    setSizeInput("");
  };

  // =========================
  // REMOVE SIZE
  // =========================

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  // =========================
  // ADD COLOR
  // =========================

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    if (formData.colors.includes(color)) {
      setColorInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, color],
    }));

    setColorInput("");
  };

  // =========================
  // REMOVE COLOR
  // =========================

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    setImages(selectedImages);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Validate sizes
      if (formData.sizes.length === 0) {
        setError("Please add at least one size.");
        setLoading(false);
        return;
      }

      // Validate colors
      if (formData.colors.length === 0) {
        setError("Please add at least one color.");
        setLoading(false);
        return;
      }

      // Validate images
      if (images.length === 0) {
        setError("Please select at least one product image.");
        setLoading(false);
        return;
      }

      // =========================
      // FORM DATA
      // =========================

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("category", formData.category);

      data.append("sizes", JSON.stringify(formData.sizes));
      data.append("colors", JSON.stringify(formData.colors));

      data.append("stock", formData.stock);
      data.append("isFeatured", formData.isFeatured);

      // Images
      images.forEach((image) => {
        data.append("images", image);
      });

      // =========================
      // API REQUEST
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      console.log("CREATE PRODUCT RESPONSE:", result);

      if (!response.ok || !result.success) {
        setError(
          result.message || "Failed to create product."
        );
        return;
      }

      alert("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      {/* ================= HEADER ================= */}

      <div className="add-product-header">

        <div>
          <div className="breadcrumb">
            <span onClick={() => navigate("/admin/dashboard")}>
              Admin Dashboard
            </span>

            <span>/</span>

            <span onClick={() => navigate("/admin/products")}>
              Products
            </span>

            <span>/</span>

            <strong>Add Product</strong>
          </div>

          <h1>Add New Product</h1>

          <p>
            Add a new shoe product to your store.
          </p>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/admin/products")}
        >
          ← Back to Products
        </button>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="error-box">
          <span>⚠</span>
          {error}
        </div>
      )}

      {/* ================= FORM ================= */}

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        {/* ================= BASIC INFORMATION ================= */}

        <section className="form-card">

          <div className="section-header">
            <div className="section-icon">
              📦
            </div>

            <div>
              <h2>Basic Information</h2>

              <p>
                Enter the basic details of your product.
              </p>
            </div>
          </div>

          <div className="form-grid">

            {/* Product Name */}

            <div className="form-group full-width">
              <label>
                Product Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nike Air Max"
                required
              />
            </div>

            {/* Brand */}

            <div className="form-group">
              <label>
                Brand
                <span>*</span>
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Nike"
                required
              />
            </div>

            {/* Category */}

            <div className="form-group">
              <label>
                Category
                <span>*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select category
                </option>

                <option value="Running">
                  Running
                </option>

                <option value="Casual">
                  Casual
                </option>

                <option value="Sports">
                  Sports
                </option>

                <option value="Sneakers">
                  Sneakers
                </option>

                <option value="Formal">
                  Formal
                </option>

                <option value="Boots">
                  Boots
                </option>
              </select>
            </div>

            {/* Stock */}

            <div className="form-group">
              <label>
                Stock
                <span>*</span>
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                min="0"
                required
              />
            </div>

            {/* Description */}

            <div className="form-group full-width">

              <label>
                Description
                <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="5"
                required
              />

            </div>

          </div>

        </section>

        {/* ================= PRICING ================= */}

        <section className="form-card">

          <div className="section-header">

            <div className="section-icon">
              ₹
            </div>

            <div>
              <h2>Pricing</h2>

              <p>
                Set the original and discounted price.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* Original Price */}

            <div className="form-group">

              <label>
                Original Price
                <span>*</span>
              </label>

              <div className="price-input">

                <span>₹</span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="8999"
                  min="0"
                  required
                />

              </div>

            </div>

            {/* Discount Price */}

            <div className="form-group">

              <label>
                Discount Price
              </label>

              <div className="price-input">

                <span>₹</span>

                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="6999"
                  min="0"
                />

              </div>

            </div>

          </div>

        </section>

        {/* ================= VARIANTS ================= */}

        <section className="form-card">

          <div className="section-header">

            <div className="section-icon">
              🎨
            </div>

            <div>
              <h2>Product Variants</h2>

              <p>
                Add available sizes and colors.
              </p>
            </div>

          </div>

          <div className="variant-grid">

            {/* Sizes */}

            <div className="variant-box">

              <label>
                Available Sizes
              </label>

              <div className="add-item">

                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) =>
                    setSizeInput(e.target.value)
                  }
                  placeholder="Example: 9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSize();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addSize}
                >
                  + Add
                </button>

              </div>

              <div className="tags">

                {formData.sizes.map((size) => (
                  <div
                    className="tag"
                    key={size}
                  >
                    <span>{size}</span>

                    <button
                      type="button"
                      onClick={() =>
                        removeSize(size)
                      }
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

            </div>

            {/* Colors */}

            <div className="variant-box">

              <label>
                Available Colors
              </label>

              <div className="add-item">

                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) =>
                    setColorInput(e.target.value)
                  }
                  placeholder="Example: Black"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addColor}
                >
                  + Add
                </button>

              </div>

              <div className="tags">

                {formData.colors.map((color) => (
                  <div
                    className="tag color-tag"
                    key={color}
                  >
                    <span>{color}</span>

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(color)
                      }
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>

        {/* ================= IMAGES ================= */}

        <section className="form-card">

          <div className="section-header">

            <div className="section-icon">
              🖼️
            </div>

            <div>
              <h2>Product Images</h2>

              <p>
                Upload product images.
              </p>
            </div>

          </div>

          <label className="upload-area">

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            <div className="upload-icon">
              ⬆
            </div>

            <h3>
              Click to upload images
            </h3>

            <p>
              PNG, JPG, JPEG up to 5MB each
            </p>

          </label>

          {images.length > 0 && (

            <div className="selected-images">

              <h3>
                Selected Images ({images.length})
              </h3>

              <div className="image-list">

                {images.map((image, index) => (

                  <div
                    className="image-item"
                    key={index}
                  >

                    <span>
                      🖼️
                    </span>

                    <div>
                      <strong>
                        {image.name}
                      </strong>

                      <small>
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </small>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

        {/* ================= FEATURED ================= */}

        <section className="form-card featured-card">

          <div>

            <h2>
              Featured Product
            </h2>

            <p>
              Show this product in the featured section.
            </p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            <span className="slider"></span>

          </label>

        </section>

        {/* ================= ACTIONS ================= */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Product...
              </>
            ) : (
              <>
                + Create Product
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminAddProduct;