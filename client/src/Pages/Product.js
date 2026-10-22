import axios from "axios";
import { useEffect, useState, useContext, useMemo } from "react";
import "./Product.css";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
  { id: "all", label: "All Harvest", icon: "fa-solid fa-border-all" },
  { id: "coconut", label: "Green Coconuts", icon: "fa-solid fa-bottle-water" },
  { id: "apple", label: "Apples & Pears", icon: "fa-solid fa-apple-whole" },
  { id: "mango", label: "Mangoes", icon: "fa-solid fa-lemon" },
  { id: "citrus", label: "Citrus & Oranges", icon: "fa-solid fa-sun" },
  { id: "exotic", label: "Exotic & Berries", icon: "fa-solid fa-seedling" },
];

function Product() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const { setCount } = useContext(AuthContext);

  // Cart state
  const [item, setItem] = useState(
    JSON.parse(localStorage.getItem("Items")) || []
  );

  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/item`)
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const text = `${name} ${desc}`;

        if (selectedCategory === "coconut") {
          return text.includes("coconut") || text.includes("nariyal") || text.includes("tender");
        }
        if (selectedCategory === "apple") {
          return text.includes("apple") || text.includes("pear") || text.includes("seb");
        }
        if (selectedCategory === "mango") {
          return text.includes("mango") || text.includes("aam") || text.includes("alphonso");
        }
        if (selectedCategory === "citrus") {
          return text.includes("orange") || text.includes("citrus") || text.includes("lemon") || text.includes("mosambi");
        }
        if (selectedCategory === "exotic") {
          return (
            text.includes("berry") ||
            text.includes("kiwi") ||
            text.includes("dragon") ||
            text.includes("pineapple") ||
            text.includes("pomegranate") ||
            text.includes("anar")
          );
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.rate) || 0) - (Number(b.rate) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.rate) || 0) - (Number(a.rate) || 0));
    } else if (sortBy === "name-az") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [data, searchTerm, selectedCategory, sortBy]);

  // Reset to first page when search/category/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const scrollTop = () => {
    window.scrollTo({
      top: 150,
      behavior: "smooth",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    scrollTop();
  };

  const isInCart = (productName) => {
    return item.some(
      (cartItem) => cartItem.name?.toLowerCase() === productName?.toLowerCase()
    );
  };

  // Add to Cart Handler
  const handleCard = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    let cartItems = JSON.parse(localStorage.getItem("Items")) || [];
    const itemArray = cartItems.map((cartItem) => cartItem.name?.toLowerCase());

    if (itemArray.includes(value.name?.toLowerCase())) {
      toast.warn(`${value.name} is already in your cart`, {
        position: "bottom-center",
        autoClose: 1200,
      });
      return;
    }

    let cart = {
      name: value.name,
      description: value.description,
      rate: value.rate,
      image: value.image,
      count: 1,
    };

    const updatedCart = [...cartItems, cart];

    setItem(updatedCart);
    localStorage.setItem("Items", JSON.stringify(updatedCart));
    setCount(updatedCart.length);

    toast.success(`Added ${value.name} to Cart`, {
      position: "bottom-center",
      autoClose: 1200,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("featured");
  };

  return (
    <div className="lucky-product-page">
      <div className="lucky-product-container">
        {/* Hero Header */}
        <header className="lucky-product-hero">
          <div className="lucky-hero-badge">
            <i className="fa-solid fa-leaf"></i>
            <span>Orchard-Direct Selection</span>
          </div>

          <h1 className="lucky-product-hero-title">
            Fresh Seasonal Fruits & <br />
            <span className="text-emerald">Pure Coconuts</span>
          </h1>

          <p className="lucky-product-hero-subtitle">
            Naturally ripened, chemical-free, and hand-sorted daily. 
            Enjoy fast, doorstep delivery across Jalgaon.
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="lucky-filter-bar">
          <div className="lucky-search-row">
            <div className="lucky-search-box">
              <i className="fa-solid fa-magnifying-glass lucky-search-icon"></i>
              <input
                type="text"
                placeholder="Search fresh fruits, green coconuts, mangoes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lucky-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="lucky-search-clear-btn"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="lucky-sort-select"
              aria-label="Sort products by"
            >
              <option value="featured">Featured Harvest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
            </select>
          </div>

          {/* Category Filter Pills */}
          <div className="lucky-category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`lucky-category-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / Loading / Empty States */}
        {loading ? (
          <div className="lucky-product-empty">
            <i className="fa-solid fa-spinner fa-spin lucky-empty-icon"></i>
            <h3 className="lucky-empty-heading">Fetching Fresh Harvest...</h3>
            <p className="lucky-empty-text">Loading delicious fruits from our local store inventory.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="lucky-product-empty">
            <i className="fa-solid fa-seedling lucky-empty-icon"></i>
            <h3 className="lucky-empty-heading">No Fruits Found</h3>
            <p className="lucky-empty-text">
              We couldn't find any fruits matching your search or selected filter.
            </p>
            <button
              type="button"
              className="lucky-reset-filters-btn"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="lucky-product-grid">
              {currentItems.map((itemValue, index) => {
                const inCart = isInCart(itemValue.name);

                return (
                  <div key={index} className="lucky-product-card">
                    <div className="lucky-product-image-box">
                      <img
                        src={itemValue.image}
                        alt={itemValue.name || "Fresh Fruit"}
                        className="lucky-product-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <span className="lucky-fresh-tag">
                        <i className="fa-solid fa-sparkles" style={{ color: "#10b981" }}></i>
                        100% Farm Fresh
                      </span>
                    </div>

                    <div className="lucky-product-card-body">
                      <h3 className="lucky-product-name" title={itemValue.name}>
                        {itemValue.name}
                      </h3>
                      <p className="lucky-product-desc">
                        {itemValue.description || "Fresh, naturally ripened fruit hand-picked for premium sweetness and texture."}
                      </p>

                      <div className="lucky-product-price-row">
                        <span className="lucky-product-price">₹ {itemValue.rate}</span>
                        <span className="lucky-stock-badge">In Stock</span>
                      </div>

                      <button
                        type="button"
                        className={`lucky-add-cart-btn ${inCart ? "btn-in-cart" : "btn-ready"}`}
                        onClick={() => handleCard(itemValue)}
                      >
                        {inCart ? (
                          <>
                            <i className="fa-solid fa-check"></i>
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-cart-plus"></i>
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="lucky-pagination-container">
                <button
                  type="button"
                  className="lucky-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                  <span>Prev</span>
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`lucky-page-number-pill ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="lucky-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span>Next</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Product;
