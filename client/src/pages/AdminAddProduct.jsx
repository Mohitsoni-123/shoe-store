import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  const categories = [
    "Sneakers",
    "Running",
    "Sports",
    "Casual",
    "Formal",
    "Boots",
    "Sandals",
  ];

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
      setSizeInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, size],
    }));

    setSizeInput("");
  };

  const removeSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((item) => item !== size),
    }));
  };

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

  const removeColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    setImages(selectedImages);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        setError("Please add at least one size.");
        setLoading(false);
        return;
      }

      if (formData.colors.length === 0) {
        setError("Please add at least one color.");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        setError("Please select at least one product image.");
        setLoading(false);
        return;
      }

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

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.post("/products", data);

      const result = response.data;

      console.log("CREATE PRODUCT RESPONSE:", result);

      if (!result.success) {
        setError(result.message || "Failed to create product.");
        return;
      }

      alert("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Add New Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new shoe product to your store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Back to Products
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-2">

              {/* Basic Information */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nike Air Max 270"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Nike"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description..."
                      rows="5"
                      required
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="8999"
                        required
                        className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Discount Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        placeholder="6999"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="50"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  Available Sizes
                </h2>

                <p className="mb-5 text-sm text-gray-500">
                  Add all available shoe sizes.
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                    placeholder="Example: 8"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={addSize}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    + Add
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      <span>{size}</span>

                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-blue-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  Available Colors
                </h2>

                <p className="mb-5 text-sm text-gray-500">
                  Add all available product colors.
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="Example: Black"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={addColor}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    + Add
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700"
                    >
                      <span>{color}</span>

                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-purple-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">

              {/* Images */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  Product Images
                </h2>

                <p className="mb-5 text-sm text-gray-500">
                  Upload high-quality product images.
                </p>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <div className="mb-3 text-4xl">
                    📷
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload images
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-medium text-gray-700">
                      Selected Images ({images.length})
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {images.map((image, index) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="relative overflow-hidden rounded-lg border bg-gray-50"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            className="h-28 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Featured */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Featured Product
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Show this product on homepage.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating Product..."
                    : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;