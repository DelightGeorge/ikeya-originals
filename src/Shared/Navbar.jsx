import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Lookbook", path: "/lookbook" },
  { name: "About", path: "/about" },
];

// ─── Ikeyá SVG Logo Component ────────────────────────────────────────────────
const IkeyaLogo = ({ variant = "dark", className = "" }) => {
  // variant: "dark" = black text (for white navbar), "light" = white text (for dark bg)
  const textColor   = variant === "light" ? "#f5f0eb" : "#0a0a0a";
  const accentStart = "#fbbf24";
  const accentMid   = "#d97706";
  const accentEnd   = "#92400e";
  const labelColor  = variant === "light" ? "#b45309" : "#b45309";

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

      {/* "HOUSE OF" micro-label */}
      <text
        x="130" y="13"
        textAnchor="middle"
        fontFamily="'Cinzel', 'Optima', Georgia, serif"
        fontSize="6.5"
        fontWeight="400"
        fill={labelColor}
        letterSpacing="5"
      >
        HOUSE OF
      </text>

      {/* Main wordmark — IKEY */}
      <text
        x="19" y="50"
        fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif"
        fontSize="44"
        fontWeight="300"
        fill={textColor}
        letterSpacing="3"
      >
        IKEY
      </text>

      {/* Á — gold accent */}
      <text
        x="162" y="50"
        fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif"
        fontSize="44"
        fontWeight="300"
        fill="url(#navGold)"
        letterSpacing="3"
      >
        Á
      </text>

      {/* Thin amber underline beneath the Á */}
      <line x1="160" y1="55" x2="198" y2="55" stroke="url(#navGold)" strokeWidth="1" />

      {/* Divider dots */}
      <circle cx="211" cy="35" r="1.2" fill={accentMid} opacity="0.7" />

      {/* "ORIGINALS" sub-label */}
      <text
        x="222" y="39"
        fontFamily="'Cinzel', Georgia, serif"
        fontSize="6"
        fontWeight="400"
        fill={labelColor}
        letterSpacing="3"
      >
        ORIGINALS
      </text>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cartCount } = useCart();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between bg-white relative z-[110]">

        {/* ── LOGO ── */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex-shrink-0"
          aria-label="Ikeyá — Home"
        >
          <IkeyaLogo variant="dark" className="h-12 w-auto" />
        </Link>

        {/* ── DESKTOP NAV ── */}
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

        {/* ── ACTIONS & AUTH ── */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
            className="hover:text-amber-900 transition-colors"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* Auth section */}
          <div className="flex items-center gap-4 border-x border-neutral-100 px-4 md:px-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <User size={18} strokeWidth={1.5} className="group-hover:text-amber-900 transition-colors" />
                  <span className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-black">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-black hover:text-amber-900 transition-colors">
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}

            {/* Admin links — Desktop */}
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
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-neutral-100 p-6 z-[105] shadow-sm"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-4">
              <input
                autoFocus
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full text-center text-sm font-bold tracking-widest uppercase outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="hidden">Search</button>
            </form>
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

              {/* Mobile logo — centered, light on dark not needed here; reuse dark variant */}
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

              {/* User section */}
              <div className="mt-10 border-t border-neutral-100 pt-10 flex flex-col gap-6">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest">
                      My Account
                    </Link>

                    {/* Admin links — Mobile */}
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
