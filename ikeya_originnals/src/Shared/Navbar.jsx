import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut, Users, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";
import { getProducts } from "../services/productService";
import { formatPrice } from "../utils/formatters";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Lookbook", path: "/lookbook" },
  { name: "About", path: "/about" },
];

// ─── Debounce utility ─────────────────────────────────────────────────────────
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ─── Ikeyá SVG Logo ───────────────────────────────────────────────────────────
const IkeyaLogo = ({ variant = "dark", className = "" }) => {
  const textColor   = variant === "light" ? "#f5f0eb" : "#0a0a0a";
  const accentStart = "#fbbf24";
  const accentMid   = "#d97706";
  const accentEnd   = "#92400e";
  const labelColor  = "#b45309";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 72"
      className={className}
      aria-label="Ikeyá Originals"
      role="img"
    >
      <defs>
        <linearGradient id="navGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={accentStart} />
          <stop offset="45%"  stopColor={accentMid}   />
          <stop offset="100%" stopColor={accentEnd}   />
        </linearGradient>
      </defs>
      <text x="130" y="13" textAnchor="middle" fontFamily="'Cinzel', 'Optima', Georgia, serif" fontSize="6.5" fontWeight="400" fill={labelColor} letterSpacing="5">HOUSE OF</text>
      <text x="19" y="50" fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif" fontSize="44" fontWeight="300" fill={textColor} letterSpacing="3">IKEY</text>
      <text x="162" y="50" fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif" fontSize="44" fontWeight="300" fill="url(#navGold)" letterSpacing="3">Á</text>
      <line x1="160" y1="55" x2="198" y2="55" stroke="url(#navGold)" strokeWidth="1" />
      <circle cx="211" cy="35" r="1.2" fill={accentMid} opacity="0.7" />
      <text x="222" y="39" fontFamily="'Cinzel', Georgia, serif" fontSize="6" fontWeight="400" fill={labelColor} letterSpacing="3">ORIGINALS</text>
    </svg>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]             = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [displayQuery, setDisplayQuery]     = useState(""); // instant — shown in input
  const [searchQuery, setSearchQuery]       = useState(""); // debounced — used for filtering
  const [allProducts, setAllProducts]       = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const { cartCount } = useCart();
  const searchRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ── Debounced setter (300ms) ──
  const debouncedSetSearch = useCallback(
    debounce((val) => setSearchQuery(val), 300),
    []
  );

  // ── Fetch all products once on first search open ──
  useEffect(() => {
    if (searchOpen && !productsLoaded) {
      getProducts()
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data?.content ?? res.data?.products ?? [];
          setAllProducts(data);
          setProductsLoaded(true);
        })
        .catch(() => setProductsLoaded(true));
    }
  }, [searchOpen, productsLoaded]);

  // ── Close on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Close on Escape ──
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") closeSearch(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setDisplayQuery("");
    setSearchQuery("");
  };

  const handleInputChange = (e) => {
    setDisplayQuery(e.target.value);        // input updates instantly
    debouncedSetSearch(e.target.value);     // filter waits 300ms after typing stops
  };

  // ── Filter results against debounced query ──
  const results = searchQuery.trim().length >= 1
    ? allProducts
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (displayQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(displayQuery.trim())}`);
      closeSearch();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    closeSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  const getWhatsAppUrl = (product) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in *${product.name}*. Could you help me with sizing, availability, and how to place an order?`
    );
    return `https://wa.me/+2349161270548?text=${msg}`;
  };

  // ── Highlight matching text ──
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-amber-100 text-amber-900 not-italic">{part}</mark>
        : part
    );
  };

  const showDropdown = searchOpen && displayQuery.trim().length >= 1;

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between bg-white relative z-[110]">

        {/* LOGO */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex-shrink-0" aria-label="Ikeyá — Home">
          <IkeyaLogo variant="dark" className="h-12 w-auto" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${
                  isActive ? "text-amber-900" : "text-black/50 hover:text-black"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
              setDisplayQuery("");
              setSearchQuery("");
            }}
            className="hover:text-amber-900 transition-colors"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* Auth */}
          <div className="flex items-center gap-4 border-x border-neutral-100 px-4 md:px-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <User size={18} strokeWidth={1.5} className="group-hover:text-amber-900 transition-colors" />
                  <span className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-black">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="text-neutral-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-black hover:text-amber-900 transition-colors">
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/admin/dashboard" className="text-amber-900 hover:text-amber-700 transition-colors" title="Dashboard">
                  <LayoutDashboard size={18} strokeWidth={1.5} />
                </Link>
                <Link to="/admin/users" className="text-amber-900 hover:text-amber-700 transition-colors" title="View All Users">
                  <Users size={18} strokeWidth={1.5} />
                </Link>
              </div>
            )}
          </div>

          {/* Cart */}
          <NavLink to="/cart" className="relative hover:text-amber-900 transition-colors" aria-label="Shopping bag">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[7px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center gap-2"
            onClick={() => { setMenuOpen(!menuOpen); closeSearch(); }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR + LIVE DROPDOWN ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-neutral-100 z-[105] shadow-sm"
          >
            {/* Input row */}
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-5">
              <Search size={16} className="text-neutral-300 flex-shrink-0" strokeWidth={1.5} />
              <input
                autoFocus
                placeholder="SEARCH PRODUCTS..."
                className="w-full text-sm font-bold tracking-widest uppercase outline-none placeholder:text-neutral-300 placeholder:font-normal text-black bg-transparent"
                value={displayQuery}
                onChange={handleInputChange}
              />
              {displayQuery && (
                <button
                  type="button"
                  onClick={() => { setDisplayQuery(""); setSearchQuery(""); }}
                  className="text-neutral-300 hover:text-black transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Live results */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border-t border-neutral-100 max-w-3xl mx-auto"
                >
                  {results.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                        No products found for "{displayQuery}"
                      </p>
                    </div>
                  ) : (
                    <>
                      {results.map((p, i) => {
                        const outOfStock = typeof p.stock === "number" && p.stock <= 0;
                        const isFashion  = p.type === "FASHION";

                        return (
                          <div
                            key={p.id}
                            className={`flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 transition-colors cursor-pointer group ${
                              i !== results.length - 1 ? "border-b border-neutral-50" : ""
                            }`}
                            onClick={() => handleProductClick(p.id)}
                          >
                            {/* Thumbnail */}
                            <div className="w-14 h-14 flex-shrink-0 bg-neutral-100 overflow-hidden">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                                  outOfStock ? "grayscale opacity-50" : ""
                                }`}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] uppercase tracking-[0.25em] text-amber-800 font-bold mb-0.5">
                                {p.type}{p.category?.name ? ` / ${p.category.name}` : ""}
                              </p>
                              <h4 className="text-sm font-bold uppercase tracking-tight text-black truncate">
                                {highlightMatch(p.name, searchQuery)}
                              </h4>
                              <p className="text-xs text-neutral-400 mt-0.5">
                                {outOfStock
                                  ? <span className="text-red-400 font-bold uppercase text-[9px] tracking-widest">Out of Stock</span>
                                  : formatPrice(p.price)
                                }
                              </p>
                            </div>

                            {/* CTA — stops propagation so row click still goes to product page */}
                            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              {!outOfStock && isFashion ? (
                                <a
                                  href={getWhatsAppUrl(p)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-2 text-[9px] uppercase font-bold tracking-widest hover:bg-green-600 transition-colors whitespace-nowrap"
                                >
                                  <MessageCircle size={11} /> WhatsApp
                                </a>
                              ) : (
                                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-neutral-400 group-hover:text-amber-800 transition-colors">
                                  View <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* See all footer */}
                      <div
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                        onClick={handleSearchSubmit}
                      >
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                          See all results for "{displayQuery}"
                        </span>
                        <ArrowRight size={14} className="text-amber-800" />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-20 bg-white z-[100] lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col p-8 pt-12 gap-8">
              <div className="flex justify-center mb-4">
                <IkeyaLogo variant="dark" className="h-10 w-auto opacity-20" />
              </div>

              {navLinks.map((link, i) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-end gap-4"
                >
                  <span className="text-neutral-300 text-xs font-bold mb-2">0{i + 1}</span>
                  <span className="text-4xl font-display uppercase tracking-tighter text-black group-hover:italic group-hover:text-amber-900 transition-all">
                    {link.name}
                  </span>
                </NavLink>
              ))}

              <div className="mt-10 border-t border-neutral-100 pt-10 flex flex-col gap-6">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest">
                      My Account
                    </Link>
                    {user.role === "ADMIN" && (
                      <div className="flex flex-col gap-4 pl-4 border-l-2 border-amber-800">
                        <span className="text-[8px] uppercase tracking-[0.3em] text-amber-800 font-bold">Admin</span>
                        <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-black hover:text-amber-900">
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                        <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-black hover:text-amber-900">
                          <Users size={14} /> All Users
                        </Link>
                      </div>
                    )}
                    <button onClick={handleLogout} className="text-xs uppercase font-bold tracking-widest text-red-500 text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;