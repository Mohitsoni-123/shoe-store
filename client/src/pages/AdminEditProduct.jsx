import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    sizes: "",
    colors: "",
    featured: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      console.log("EDIT PRODUCT RESPONSE:", response.data);

      const product = response.data.product;

      if (!product) {
        setError("Product not found");
        return;
      }

      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        category: product.category || "",
        stock: product.stock || "",
        sizes: Array.isArray(product.sizes)
          ? product.sizes.join(", ")
          : product.sizes || "",
        colors: Array.isArray(product.colors)
          ? product.colors.join(", ")
          : product.colors || "",
        featured: Boolean(product.featured),
      });

      setExistingImages(
        product.images || (product.image ? [product.image] : []),
      );
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error);

      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

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
  // HANDLE IMAGES
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    setNewImages(files);
  };

  // =========================
  // REMOVE EXISTING IMAGE
  // =========================

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name.trim()) {
        setError("Product name is required");
        return;
      }

      if (!formData.brand.trim()) {
        setError("Brand is required");
        return;
      }

      if (!formData.price) {
        setError("Price is required");
        return;
      }

      if (!formData.category) {
        setError("Category is required");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("featured", formData.featured);

      // Convert comma separated values into arrays
      const sizesArray = formData.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      const colorsArray = formData.colors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean);

      data.append("sizes", JSON.stringify(sizesArray));
      data.append("colors", JSON.stringify(colorsArray));

      // Existing images
      data.append("existingImages", JSON.stringify(existingImages));

      // New images
      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPDATE PRODUCT RESPONSE:", response.data);

      setSuccess("Product updated successfully");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      setError(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate("/admin/products")}
            className="text-sm text-gray-500 hover:text-black mb-5"
          >
            ← Back to Products
          </button>

          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Admin Panel
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Edit Product
          </h1>

          <p className="text-gray-500 mt-2">
            Update product information and inventory.
          </p>
        </div>
      </section>

      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}

            <div className="lg:col-span-2 space-y-6">
              {/* BASIC INFORMATION */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  {/* NAME */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                      placeholder="Nike Air Max"
                    />
                  </div>

                  {/* BRAND */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                      placeholder="Nike"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black bg-white"
                    >
                      <option value="">Select Category</option>

                      <option value="Sneakers">Sneakers</option>

                      <option value="Sports">Sports</option>

                      <option value="Casual">Casual</option>

                      <option value="Formal">Formal</option>

                      <option value="Running">Running</option>
                    </select>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black resize-none"
                      placeholder="Product description..."
                    />
                  </div>
                </div>
              </div>

              {/* PRICING */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price
                    </label>

                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* SIZES / COLORS */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900">Variants</h2>

                <div className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sizes
                    </label>

                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                      placeholder="7, 8, 9, 10, 11"
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      Separate sizes with commas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colors
                    </label>

                    <input
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                      placeholder="Black, White, Red"
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      Separate colors with commas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">
              {/* IMAGES */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Product Images
                </h2>

                {/* Existing */}

                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    {existingImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                      >
                        <img
                          src={image}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload */}

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                  />

                  {newImages.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {newImages.length} new image
                      {newImages.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              </div>

              {/* FEATURED */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Featured Product
                    </p>

                    <p className="text-sm text-gray-500">
                      Show this product as featured.
                    </p>
                  </div>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving ? "Updating Product..." : "Update Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminEditProduct;
