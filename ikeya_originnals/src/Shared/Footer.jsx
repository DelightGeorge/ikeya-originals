import { useState } from "react";
import {
  Instagram, Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

// Custom TikTok Icon (lucide-react doesn't have TikTok)
const TikTokIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// ─── Ikeyá SVG Logo — Light variant (for dark footer bg) ─────────────────────
const IkeyaLogoLight = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 260 72"
    className={className}
    aria-label="Ikeyá Originals"
    role="img"
  >
    <defs>
      <linearGradient id="footerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#fbbf24" />
        <stop offset="45%"  stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* "HOUSE OF" micro-label */}
    <text
      x="130" y="13"
      textAnchor="middle"
      fontFamily="'Cinzel', 'Optima', Georgia, serif"
      fontSize="6.5"
      fontWeight="400"
      fill="#b45309"
      letterSpacing="5"
    >
      HOUSE OF
    </text>

    {/* IKEY — cream/white */}
    <text
      x="19" y="50"
      fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif"
      fontSize="44"
      fontWeight="300"
      fill="#f5f0eb"
      letterSpacing="3"
    >
      IKEY
    </text>

    {/* Á — gold gradient */}
    <text
      x="162" y="50"
      fontFamily="'Cormorant Garamond', 'Didot', Georgia, serif"
      fontSize="44"
      fontWeight="300"
      fill="url(#footerGold)"
      letterSpacing="3"
    >
      Á
    </text>

    {/* Underline beneath Á */}
    <line x1="160" y1="55" x2="198" y2="55" stroke="url(#footerGold)" strokeWidth="1" />

    {/* Dot separator */}
    <circle cx="211" cy="35" r="1.2" fill="#d97706" opacity="0.7" />

    {/* ORIGINALS sub-label */}
    <text
      x="222" y="39"
      fontFamily="'Cinzel', Georgia, serif"
      fontSize="6"
      fontWeight="400"
      fill="#b45309"
      letterSpacing="3"
    >
      ORIGINALS
    </text>
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await api.post("/newsletter/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Something went wrong. Try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <footer className="bg-black text-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* ── Brand Column ── */}
          <div className="space-y-6">
            <Link to="/" className="block" aria-label="Ikeyá — Home">
              <IkeyaLogoLight className="h-12 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed opacity-70 font-light max-w-xs">
              Delivering exclusive fashion collections and premium natural hair
              care solutions across Nigeria. Crafted for the authentic you.
            </p>
            <div className="flex gap-5">
              <a
                href="https://www.instagram.com/ikeya_originals"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 rounded-full hover:bg-rosegold hover:border-rosegold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-white/10 rounded-full hover:bg-rosegold hover:border-rosegold transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* ── Navigation Column ── */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">
              Navigation
            </h3>
            <ul className="space-y-4 text-sm font-light opacity-70">
              <li><Link to="/fashion"  className="hover:text-rosegold transition-colors">Fashion Collection</Link></li>
              <li><Link to="/hair"     className="hover:text-rosegold transition-colors">Hair Care Essentials</Link></li>
              <li><Link to="/lookbook" className="hover:text-rosegold transition-colors">Editorial Lookbook</Link></li>
              <li><Link to="/about"    className="hover:text-rosegold transition-colors">Our Heritage</Link></li>
            </ul>
          </div>

          {/* ── Contact Column ── */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">
              Visit Us
            </h3>
            <ul className="space-y-6 text-sm font-light opacity-70">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="shrink-0 text-rosegold" />
                <span>Ketu, Lagos,<br />Nigeria</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="shrink-0 text-rosegold" />
                <span>+234 706 636 6337</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="shrink-0 text-rosegold" />
                <span>ikeyaoriginals@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* ── Newsletter Column ── */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">
              The Style Club
            </h3>
            <p className="text-xs mb-6 opacity-70 leading-relaxed">
              Join for early access to seasonal drops and professional hair tips.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-3 py-3 border-b border-green-500/40">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <p className="text-[10px] uppercase tracking-widest text-green-400 font-bold">
                  You're in — check your inbox!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  disabled={status === "loading"}
                  className="w-full bg-white/5 border-b border-white/20 py-3 pr-10 text-sm focus:outline-none focus:border-rosegold transition-colors font-light disabled:opacity-50 placeholder-white/30"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-rosegold hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  {status === "loading"
                    ? <Loader2 size={18} className="animate-spin" />
                    : <ArrowRight size={20} />
                  }
                </button>
                {status === "error" && (
                  <p className="text-[9px] text-red-400 uppercase tracking-widest mt-2 font-bold">
                    {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            © {currentYear} Ikeyá Originals. Crafted with authenticity.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest opacity-40">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;