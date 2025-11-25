import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import BackButton from "../components/BackButton";
import "../signin.css";

const ONLINE_IMAGE_LIBRARY = [
  {
    label: "Fresh Tomatoes",
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Golden Wheat",
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Organic Greens",
    url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Farm Milk",
    url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Fresh Strawberries",
    url: "https://images.unsplash.com/photo-1464968161540-a7212f60da72?auto=format&fit=crop&w=800&q=70",
  },
  {
    label: "Mixed Vegetables",
    url: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=70",
  },
];

const createInitialFormState = () => ({
  name: "",
  category: "Vegetables",
  price: "",
  quantity: "",
  image: "",
  description: "",
  freshness: "",
  dateOfHarvest: "",
});

export default function Farmer() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(createInitialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageMode, setImageMode] = useState("upload");
  const [remoteImageUrl, setRemoteImageUrl] = useState("");

  useEffect(() => {
    if (user?.userId) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getFarmerProducts();
      if (Array.isArray(data)) {
        setProducts(data);
        setError("");
      } else {
        setProducts([]);
        setError("No products found or invalid response format.");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      if (err.status === 401 || err.status === 403) {
        setError("Access denied. Please sign in again to manage your products.");
      } else {
        setError(err.message || "Failed to load products. Please try again.");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoteImageUrl("");
    setImageMode("upload");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoteImageInput = (value) => {
    setImageFile(null);
    setImageMode("url");
    setRemoteImageUrl(value);
    setFormData((prev) => ({ ...prev, image: value }));
    setImagePreview(value);
  };

  const handleLibrarySelect = (url) => {
    setImageFile(null);
    setImageMode("library");
    setRemoteImageUrl(url);
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const isLibraryImage = (value) => ONLINE_IMAGE_LIBRARY.some((option) => option.url === value);

  const resolveImageMode = (value) => {
    if (!value) return "upload";
    if (value.startsWith("data:")) {
      return "upload";
    }
    if (isLibraryImage(value)) {
      return "library";
    }
    return "url";
  };

  const handleImageModeToggle = (mode) => {
    if (mode === imageMode) return;
    setImageMode(mode);
    if (mode === "upload") {
      setRemoteImageUrl("");
      setImageFile(null);
      setImagePreview("");
      setFormData((prev) => ({ ...prev, image: "" }));
      return;
    }

    setImageFile(null);
    if (mode === "url") {
      setImagePreview(remoteImageUrl);
      setFormData((prev) => ({ ...prev, image: remoteImageUrl }));
    }
    if (mode === "library" && isLibraryImage(remoteImageUrl)) {
      setImagePreview(remoteImageUrl);
      setFormData((prev) => ({ ...prev, image: remoteImageUrl }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageMode("upload");
      setRemoteImageUrl("");
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result || "";
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.quantity) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const normalizedImage = formData.image?.trim();
      const productPayload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: normalizedImage || "/category-vegetables.jpg",
        freshness: formData.freshness ? parseFloat(formData.freshness) : null,
        dateOfHarvest: formData.dateOfHarvest || null,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.productId, productPayload);
      } else {
        await api.createProduct(productPayload);
      }

      setFormData(createInitialFormState());
      clearImageSelection();
      setEditingProduct(null);
      setShowForm(false);
      await loadProducts();
      setError("");
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.status === 401 || err.status === 403) {
        setError("Access denied. Please sign in again to continue.");
      } else {
        setError(err.message || "Failed to save product. Please try again.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "Vegetables",
      price: product.price?.toString() || "",
      quantity: product.quantity?.toString() || "",
      image: product.image || "",
      description: product.description || "",
      freshness: product.freshness?.toString() || "",
      dateOfHarvest: product.dateOfHarvest ? new Date(product.dateOfHarvest).toISOString().split("T")[0] : "",
    });
    const existingImage = product.image || "";
    const mode = resolveImageMode(existingImage);
    setImageMode(mode);
    setRemoteImageUrl(mode === "upload" ? "" : existingImage);
    setImagePreview(existingImage);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(createInitialFormState());
    clearImageSelection();
    setEditingProduct(null);
    setShowForm(false);
    setError("");
  };

  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2>Farmer Portal</h2>
            <p className="subtitle">Manage your products and inventory</p>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Add Product
            </button>
          )}
        </div>

        {error && <div style={{ color: "red", marginBottom: "1rem", padding: "0.75rem", background: "#fee", borderRadius: "4px" }}>{error}</div>}

        {showForm && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div className="card-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains">Grains</option>
                  <option value="Spices">Spices</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="99.00"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.4rem" }}>
                  Upload a picture, paste a URL, or pick one from our online gallery.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {[
                    { key: "upload", label: "Upload" },
                    { key: "url", label: "Paste URL" },
                    { key: "library", label: "Pick Online" },
                  ].map((option) => (
                    <label key={option.key} style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="imageMode"
                        value={option.key}
                        checked={imageMode === option.key}
                        onChange={() => handleImageModeToggle(option.key)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>

                {imageMode === "upload" && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ marginBottom: "0.35rem" }}
                    />
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>Supports JPG or PNG up to 2 MB.</div>
                  </>
                )}

                {imageMode === "url" && (
                  <input
                    type="url"
                    placeholder="https://images.example.com/organic-tomatoes.jpg"
                    value={remoteImageUrl}
                    onChange={(e) => handleRemoteImageInput(e.target.value)}
                  />
                )}

                {imageMode === "library" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {ONLINE_IMAGE_LIBRARY.map((option) => {
                      const isSelected = remoteImageUrl === option.url;
                      return (
                        <button
                          key={option.url}
                          type="button"
                          onClick={() => handleLibrarySelect(option.url)}
                          style={{
                            border: isSelected ? "2px solid #2e7d32" : "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "0.35rem",
                            background: isSelected ? "rgba(46,125,50,0.08)" : "white",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={option.url}
                            alt={option.label}
                            style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.35rem" }}
                          />
                          <span style={{ fontSize: "0.85rem" }}>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {imagePreview && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      style={{ maxWidth: "220px", maxHeight: "220px", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={clearImageSelection}
                        style={{ marginTop: "0.5rem", background: "none", border: "none", color: "#d32f2f", cursor: "pointer" }}
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Freshness (%)</label>
                  <input
                    type="number"
                    name="freshness"
                    value={formData.freshness}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="95"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Harvest</label>
                  <input
                    type="date"
                    name="dateOfHarvest"
                    value={formData.dateOfHarvest}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button type="button" className="btn-outline" onClick={handleCancel} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
            <p>No products yet. Add your first product to get started!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {products.map((product) => (
              <div key={product.productId} className="card" style={{ position: "relative" }}>
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                  <img
                    src={product.image || "/category-vegetables.jpg"}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {product.category}
                  </span>
                </div>
                <h3 style={{ marginBottom: "0.5rem" }}>{product.name}</h3>
                <div style={{ marginBottom: "0.5rem", color: "#666" }}>
                  <strong>₹{product.price}</strong> • Qty: {product.quantity}
                </div>
                {product.freshness && (
                  <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
                    Freshness: {product.freshness}%
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    className="btn-outline"
                    onClick={() => handleEdit(product)}
                    style={{ flex: 1, fontSize: "0.875rem" }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => handleDelete(product.productId)}
                    style={{ flex: 1, fontSize: "0.875rem", color: "#d32f2f", borderColor: "#d32f2f" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
