import Footer from "../Footer";
import Navbar from "../Navbar";

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <Navbar />

      {children}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/+2349161270548"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform z-50"
      >
        WhatsApp Us
      </a>

      <Footer />
    </div>
  );
};

export default Layout;
