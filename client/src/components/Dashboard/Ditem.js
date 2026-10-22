import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";
import "./Ditem.css";

function Ditem() {
  const [Name, setName] = useState("");
  const [Description, setDescrition] = useState("");
  const [Rate, setRate] = useState("");
  const [File, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [Id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Handle local file selection and create immediate image preview
  const handleFile = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      setFile(selected);
      const previewUrl = URL.createObjectURL(selected);
      setFilePreview(previewUrl);
    }
  };

  // Fetch all fruit products from server
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}/item`);
      if (Array.isArray(resp.data)) {
        setData(resp.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Fetch Items Error:", err);
      toast.error("Could not fetch inventory items", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle creation of new fruit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Data.length >= 15) {
      toast.error("Maximum 15 items allowed in catalog", {
        autoClose: 2500,
        position: "bottom-center",
      });
      return;
    }

    if (!Name.trim() || !Description.trim() || !Rate || !File) {
      toast.error("Please fill all fields and upload a fruit image", {
        position: "bottom-center",
        autoClose: 2500,
      });
      return;
    }

    try {
      setSubmitting(true);

      // 1. Upload Image to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", File);
      cloudData.append("upload_preset", "lucky-shop");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dbi2w9wjw/image/upload",
        cloudData
      );

      // 2. Prepare payload
      const formData = {
        name: Name.trim(),
        description: Description.trim(),
        rate: Rate,
        image: cloudRes.data.secure_url,
      };

      // 3. Post to backend
      await axios.post(`${process.env.REACT_APP_API_URL}/item`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Fruit product published successfully! 🍎", {
        position: "bottom-center",
        autoClose: 2000,
      });

      handleCancelEdit();
      getData();
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Failed to add product. Please try again.", {
        position: "bottom-center",
        autoClose: 2500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle updating an existing fruit product
  const handleUpdate = async () => {
    if (!Name.trim() || !Description.trim() || !Rate) {
      toast.error("Please fill all required fields", {
        autoClose: 2000,
        position: "bottom-center",
      });
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = existingImage;

      // If user uploaded a new replacement photo
      if (File) {
        const cloudData = new FormData();
        cloudData.append("file", File);
        cloudData.append("upload_preset", "lucky-shop");

        const cloudRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dbi2w9wjw/image/upload",
          cloudData
        );
        imageUrl = cloudRes.data.secure_url;
      }

      const payload = {
        name: Name.trim(),
        description: Description.trim(),
        rate: Rate,
        image: imageUrl,
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL}/edititem/${Id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product updated successfully! ✨", {
        position: "bottom-center",
        autoClose: 2000,
      });

      handleCancelEdit();
      getData();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update item", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Switch form into Edit Mode for a given fruit
  const handleEdit = (item) => {
    setName(item.name || "");
    setDescrition(item.description || "");
    setRate(item.rate || "");
    setId(item._id);
    setExistingImage(item.image || "");
    setFile(null);
    setFilePreview(null);
    setIsEditing(true);

    // Smooth scroll to editor
    const anchor = document.getElementById("lucky-item-form-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Cancel Edit Mode and restore blank form
  const handleCancelEdit = () => {
    setIsEditing(false);
    setId(null);
    setName("");
    setDescrition("");
    setRate("");
    setFile(null);
    setFilePreview(null);
    setExistingImage("");
  };

  // Delete product confirmation & execution
  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`Are you sure you want to remove "${itemName || "this fruit"}" from the catalog?`)) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteitem/${id}`);
      toast.success("Item deleted from catalog 🗑️", {
        position: "bottom-center",
        autoClose: 2000,
      });
      if (Id === id) {
        handleCancelEdit();
      }
      getData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete item", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  // Filtered and sorted catalog items
  const filteredData = useMemo(() => {
    let result = [...Data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const pA = parseFloat(String(a.rate).replace(/[^0-9.]/g, "")) || 0;
        const pB = parseFloat(String(b.rate).replace(/[^0-9.]/g, "")) || 0;
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const pA = parseFloat(String(a.rate).replace(/[^0-9.]/g, "")) || 0;
        const pB = parseFloat(String(b.rate).replace(/[^0-9.]/g, "")) || 0;
        return pB - pA;
      });
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [Data, searchQuery, sortBy]);

  useEffect(() => {
    getData();
  }, []);

  // Active display image in preview box
  const currentPreview = filePreview || (isEditing ? existingImage : null);

  return (
    <div className="container-fluid py-4 px-3 px-md-4 lucky-ditem-page dashboard-main">
      <div id="lucky-item-form-anchor"></div>

      {/* Hero Header Banner */}
      <div className="lucky-ditem-hero">
        <h1 className="lucky-ditem-hero-title">
          <i className="fa-solid fa-apple-whole text-emerald"></i>
          Fruit Catalog <span>& Inventory</span>
        </h1>
        <p className="lucky-ditem-hero-desc">
          Manage fresh depot fruit varieties, live customer pricing, and storefront display imagery.
        </p>

        {/* Quick Metric Pills */}
        <div className="lucky-ditem-stats-row">
          <div className="lucky-stat-pill">
            <div className="lucky-stat-pill-icon">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <span>
              Catalog Slots: <strong className="lucky-stat-pill-val">{Data.length} / 15 Used</strong>
            </span>
          </div>

          <div className="lucky-stat-pill">
            <div className="lucky-stat-pill-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <span>
              Storefront Status: <strong className="lucky-stat-pill-val">Live & Active</strong>
            </span>
          </div>

          <div className="lucky-stat-pill">
            <div className="lucky-stat-pill-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <span>
              Depot: <strong className="lucky-stat-pill-val">Jalgaon Hub</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Product Form Card (Create & Edit Mode) */}
      <div className={`lucky-form-card ${isEditing ? "editing" : ""}`}>
        <div className="lucky-form-header">
          <h2 className="lucky-form-title">
            <i className={isEditing ? "fa-solid fa-pen-to-square" : "fa-solid fa-plus-circle"}></i>
            {isEditing ? `Edit Product: ${Name || "Fruit Item"}` : "Add New Fresh Fruit Variety"}
          </h2>
          <span className={`lucky-form-mode-badge ${isEditing ? "edit" : "create"}`}>
            {isEditing ? "Editing Mode" : "Creation Mode"}
          </span>
        </div>

        <div className="lucky-form-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Form Input Fields (Left Column) */}
              <div className="col-lg-7 col-md-12">
                {/* Product Name */}
                <div className="lucky-input-group">
                  <label htmlFor="name" className="lucky-form-label">
                    Fruit Name / Variety *
                  </label>
                  <i className="fa-solid fa-tag lucky-input-icon"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="lucky-form-control"
                    placeholder="e.g. Ratnagiri Alphonso Mango, Kashmiri Red Apple"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Rate / Unit Price */}
                <div className="lucky-input-group">
                  <label htmlFor="rate" className="lucky-form-label">
                    Rate / Unit Price *
                  </label>
                  <i className="fa-solid fa-indian-rupee-sign lucky-input-icon"></i>
                  <input
                    type="text"
                    id="rate"
                    name="rate"
                    className="lucky-form-control"
                    placeholder="e.g. 180 / Dozen, 120 / kg, 50 / Piece"
                    value={Rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="lucky-input-group">
                  <div className="lucky-form-label">
                    <span>Freshness Details & Description *</span>
                    <span className="lucky-char-count">{Description.length} / 200</span>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    className="lucky-form-control lucky-form-textarea"
                    placeholder="Brief description about sweetness, origin, harvest season, or packaging..."
                    maxLength={200}
                    rows="3"
                    value={Description}
                    onChange={(e) => setDescrition(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Photo Uploader (Right Column) */}
              <div className="col-lg-5 col-md-12">
                <label className="lucky-form-label">
                  High-Resolution Photo *
                </label>
                <div className="lucky-image-upload-box">
                  {currentPreview ? (
                    <div className="lucky-image-preview-wrapper">
                      <img
                        src={currentPreview}
                        alt="Product Preview"
                        className="lucky-image-preview-img"
                      />
                      <span className="lucky-image-change-pill">
                        <i className="fa-solid fa-camera me-1"></i>
                        Click to change photo
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="lucky-upload-prompt-icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                      <div className="lucky-upload-btn-label">
                        <i className="fa-solid fa-image"></i>
                        Select Fruit Photo
                      </div>
                      <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                        PNG, JPG, or WebP (max 5MB)
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="lucky-upload-native-input"
                    onChange={handleFile}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lucky-form-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="lucky-btn-update"
                    onClick={handleUpdate}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Updating Details...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check-double"></i>
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="lucky-btn-cancel"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                  >
                    <i className="fa-solid fa-xmark"></i>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="lucky-btn-submit"
                  disabled={submitting || Data.length >= 15}
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Uploading & Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      Publish Fruit to Store
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Records & Catalog List Section */}
      <div className="lucky-records-header">
        <div className="lucky-records-title-area">
          <h2 className="lucky-records-heading">
            Live Fruit Catalog
          </h2>
          <span className="lucky-records-count-badge">
            {filteredData.length} of {Data.length} Items
          </span>
        </div>

        {/* Live Filter & Sort Strip */}
        <div className="lucky-filter-bar">
          <div className="lucky-search-box">
            <i className="fa-solid fa-magnifying-glass lucky-search-icon"></i>
            <input
              type="text"
              className="lucky-search-input"
              placeholder="Search fruit name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="lucky-search-clear"
                onClick={() => setSearchQuery("")}
                title="Clear Search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <select
            className="lucky-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default Order</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading inventory...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">Loading fruit inventory...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="lucky-empty-catalog">
          <div className="lucky-empty-icon">
            <i className="fa-solid fa-basket-shopping"></i>
          </div>
          <h3 className="lucky-empty-heading">No fruit products found</h3>
          <p className="lucky-empty-text">
            {searchQuery
              ? `No catalog items matched "${searchQuery}". Try a different keyword.`
              : "Your catalog is currently empty. Use the form above to add fresh fruits."}
          </p>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-outline-success rounded-pill px-4"
              onClick={() => setSearchQuery("")}
            >
              Reset Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="lucky-product-grid">
          {filteredData.map((item) => {
            const isCardActive = Id === item._id;

            return (
              <div
                className={`lucky-fruit-card ${isCardActive ? "is-active-edit" : ""}`}
                key={item._id}
              >
                {/* Image Frame with Floating Badges */}
                <div className="lucky-card-img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="lucky-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80";
                    }}
                  />
                  <div className="lucky-card-rate-pill">
                    <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: "0.75rem" }}></i>
                    <span>{item.rate}</span>
                  </div>
                  <div className="lucky-card-status-pill">
                    <span className="lucky-pulse-beacon" style={{ width: "6px", height: "6px" }}></span>
                    <span>Fresh</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="lucky-card-content">
                  <h3 className="lucky-card-name" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="lucky-card-desc" title={item.description}>
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="lucky-card-actions">
                    <button
                      type="button"
                      className="lucky-action-edit-btn"
                      onClick={() => handleEdit(item)}
                      title="Edit this fruit product"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      Edit Item
                    </button>

                    <button
                      type="button"
                      className="lucky-action-del-btn"
                      onClick={() => handleDelete(item._id, item.name)}
                      title="Delete this fruit product"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Ditem;
