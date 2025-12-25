import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Lookbook", path: "/lookbook" },
  { name: "About", path: "/about" },
];

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
        <Link to="/" onClick={() => setMenuOpen(false)} className="font-display text-2xl font-bold text-black tracking-tighter uppercase">
          Ikeyà
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={({ isActive }) => `text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${isActive ? "text-amber-900" : "text-black/50 hover:text-black"}`}>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS & AUTH */}
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => {setSearchOpen(!searchOpen); setMenuOpen(false)}} className="hover:text-amber-900 transition-colors">
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* AUTH SECTION */}
          <div className="flex items-center gap-4 border-x border-neutral-100 px-4 md:px-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <User size={18} strokeWidth={1.5} className="group-hover:text-amber-900 transition-colors" />
                  <span className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-black">
                    {user.name?.split(' ')[0]}
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
            
            {user?.role === "ADMIN" && (
              <Link to="/admin/dashboard" className="text-amber-900 ml-2" title="Admin">
                <LayoutDashboard size={18} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          <NavLink to="/cart" className="relative hover:text-amber-900 transition-colors">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[7px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </NavLink>

          <button className="lg:hidden flex items-center gap-2" onClick={() => {setMenuOpen(!menuOpen); setSearchOpen(false)}}>
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* SEARCH & MOBILE MENU LOGIC STAYS THE SAME... */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-20 left-0 w-full bg-white border-b border-neutral-100 p-6 z-[105] shadow-sm">
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-20 bg-white z-[100] lg:hidden flex flex-col overflow-y-auto">
            <div className="flex flex-col p-8 pt-12 gap-8">
              {navLinks.map((link, i) => (
                <NavLink key={link.name} to={link.path} onClick={() => setMenuOpen(false)} className="group flex items-end gap-4">
                  <span className="text-neutral-300 text-xs font-bold mb-2">0{i + 1}</span>
                  <span className="text-4xl font-display uppercase tracking-tighter text-black group-hover:italic group-hover:text-amber-900 transition-all">{link.name}</span>
                </NavLink>
              ))}
              
              {/* Added Profile/Logout to Mobile Menu for accessibility */}
              <div className="mt-10 border-t border-neutral-100 pt-10 flex flex-col gap-6">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest">My Account</Link>
                    <button onClick={handleLogout} className="text-xs uppercase font-bold tracking-widest text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest">Sign In</Link>
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