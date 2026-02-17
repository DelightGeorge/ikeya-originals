import { useState, useEffect } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

// WhatsApp SVG icon (official shape)
const WhatsAppIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Layout = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fade in after a short delay so it doesn't distract on page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Close expanded panel when clicking outside
  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (!e.target.closest("#whatsapp-widget")) setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  return (
    <div className="relative">
      <Navbar />

      {children}

      {/* ── WhatsApp Widget ─────────────────────────────────────────── */}
      <div
        id="whatsapp-widget"
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Expanded panel — shown on hover/click */}
        <div
          className={`transition-all duration-300 origin-bottom-right ${
            expanded
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <a
            href="https://wa.me/+2349161270548"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border border-neutral-100 shadow-2xl px-5 py-4 group hover:bg-neutral-50 transition-colors"
            style={{ minWidth: "220px" }}
          >
            {/* Green dot + icon */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center text-white">
                <WhatsAppIcon size={18} />
              </div>
              {/* Online indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                Chat with us
              </p>
              <p className="text-[9px] text-neutral-400 mt-0.5 uppercase tracking-widest">
                Typically replies instantly
              </p>
            </div>

            {/* Arrow */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-neutral-300 group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Brand label */}
          <div className="bg-neutral-900 px-5 py-2.5">
            <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
              Ikeyá Naturals & Fashion
            </p>
          </div>
        </div>

        {/* Main floating button */}
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label="Contact us on WhatsApp"
          className={`group relative flex items-center gap-3 shadow-2xl transition-all duration-300 overflow-hidden ${
            expanded
              ? "bg-neutral-900 pr-5 pl-4 py-3.5"
              : "bg-[#25D366] hover:bg-[#20ba5a] pr-5 pl-4 py-3.5"
          }`}
        >
          {/* Pulse ring — only when collapsed */}
          {!expanded && (
            <span className="absolute inset-0 rounded-none animate-ping bg-[#25D366] opacity-20 pointer-events-none" />
          )}

          <WhatsAppIcon size={18} />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white whitespace-nowrap">
            {expanded ? "Close" : "WhatsApp Us"}
          </span>

          {/* X icon when expanded */}
          {expanded && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-neutral-400 ml-1"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
      {/* ────────────────────────────────────────────────────────────── */}

      <Footer />
    </div>
  );
};

export default Layout;
