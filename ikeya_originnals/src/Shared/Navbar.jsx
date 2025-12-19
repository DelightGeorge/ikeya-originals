import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Lookbook", path: "/lookbook" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-plum/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="font-display text-2xl font-bold text-plum tracking-wide"
        >
          Ikeyà
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium transition-colors
                 ${isActive ? "text-rosegold" : "text-plum hover:text-rosegold"}`
              }
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-rosegold transition-all group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5">
          {/* SEARCH TOGGLE */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-plum hover:text-rosegold transition"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* LOGIN */}
          <NavLink to="/login" className="flex items-center gap-1 text-plum hover:text-rosegold transition hover:cursor-pointer">
            <User size={20} />
            <span className="hidden sm:inline text-sm">Login</span>
          </NavLink>

          {/* CART */}
          <NavLink to="/cart" className="relative text-plum hover:text-rosegold transition hover:cursor-pointer" aria-label="Cart">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-rosegold text-white text-[10px] rounded-full px-1.5">
              0
            </span>
          </NavLink>

          {/* MOBILE MENU */}
          <button
            className="md:hidden text-plum"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR (OPEN / CLOSE) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="border-t border-plum/10 bg-cream px-6 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto py-4 flex items-center gap-3">
              <Search size={18} className="text-plum/60" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search fashion, wigs, oils..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-plum/40"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-sm text-rosegold"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:hidden bg-cream border-t border-plum/10 px-6 py-6 space-y-6"
          >
            <nav className="flex flex-col gap-4 text-plum font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-rosegold transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex gap-4">
              <button className="flex-1 border border-plum py-3 text-plum uppercase tracking-widest text-xs">
                Login
              </button>
              <button className="flex-1 bg-plum text-white py-3 uppercase tracking-widest text-xs">
                Register
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
