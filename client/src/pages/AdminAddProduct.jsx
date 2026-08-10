import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSize = () => {
    const size = sizeInput.trim();

    if (!size) return;

    if (formData.sizes.includes(size)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size],
    }));

    setSizeInput("");
  };

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(
        (size) => size !== sizeToRemove
      ),
    }));
  };

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    if (formData.colors.includes(color)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, color],
    }));

    setColorInput("");
  };

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color !== colorToRemove
      ),
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

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

      if (formData.sizes.length === 0) {
        setError("Please add at least one size");
        return;
      }

      if (formData.colors.length === 0) {
        setError("Please add at least one color");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append(
        "discountPrice",
        formData.discountPrice
      );
      data.append("category", formData.category);

      data.append(
        "sizes",
        JSON.stringify(formData.sizes)
      );

      data.append(
        "colors",
        JSON.stringify(formData.colors)
      );

      data.append("stock", formData.stock);
      data.append(
        "isFeatured",
        formData.isFeatured
      );

      images.forEach((image) => {
        data.append("images", image);
      });

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

      if (!result.success) {
        setError(
          result.message || "Failed to create product"
        );
        return;
      }

      alert("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Add Product</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px",
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: "15px" }}>
          <label>Product Name</label>

          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Brand */}
        <div style={{ marginBottom: "15px" }}>
          <label>Brand</label>

          <br />

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Nike"
            required
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>

          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="5"
            required
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: "15px" }}>
          <label>Price</label>

          <br />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="8999"
            required
          />
        </div>

        {/* Discount Price */}
        <div style={{ marginBottom: "15px" }}>
          <label>Discount Price</label>

          <br />

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="6999"
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: "15px" }}>
          <label>Category</label>

          <br />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Running"
            required
          />
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: "15px" }}>
          <label>Sizes</label>

          <br />

          <input
            type="text"
            value={sizeInput}
            onChange={(e) =>
              setSizeInput(e.target.value)
            }
            placeholder="Enter size"
          />

          <button
            type="button"
            onClick={addSize}
            style={{ marginLeft: "10px" }}
          >
            Add Size
          </button>

          <div style={{ marginTop: "10px" }}>
            {formData.sizes.map((size) => (
              <span
                key={size}
                style={{
                  marginRight: "10px",
                }}
              >
                {size}

                <button
                  type="button"
                  onClick={() =>
                    removeSize(size)
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: "15px" }}>
          <label>Colors</label>

          <br />

          <input
            type="text"
            value={colorInput}
            onChange={(e) =>
              setColorInput(e.target.value)
            }
            placeholder="Black"
          />

          <button
            type="button"
            onClick={addColor}
            style={{ marginLeft: "10px" }}
          >
            Add Color
          </button>

          <div style={{ marginTop: "10px" }}>
            {formData.colors.map((color) => (
              <span
                key={color}
                style={{
                  marginRight: "10px",
                }}
              >
                {color}

                <button
                  type="button"
                  onClick={() =>
                    removeColor(color)
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div style={{ marginBottom: "15px" }}>
          <label>Stock</label>

          <br />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="50"
            required
          />
        </div>

        {/* Featured */}
        <div style={{ marginBottom: "15px" }}>
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

        {/* Images */}
        <div style={{ marginBottom: "20px" }}>
          <label>Product Images</label>

          <br />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <p>
              {images.length} image(s) selected
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Product..."
            : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;