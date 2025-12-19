import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-plum text-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <h2 className="text-2xl font-display font-bold tracking-[0.2em] text-white uppercase">
                Ikeyà <span className="text-rosegold italic">Originals</span>
              </h2>
            </Link>
            <p className="text-sm leading-relaxed opacity-70 font-light max-w-xs">
              Delivering exclusive fashion collections and premium natural hair care solutions across Nigeria. Crafted for the authentic you.
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 border border-white/10 rounded-full hover:bg-rosegold hover:border-rosegold transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">Navigation</h3>
            <ul className="space-y-4 text-sm font-light opacity-70">
              <li><Link to="/fashion" className="hover:text-rosegold transition-colors">Fashion Collection</Link></li>
              <li><Link to="/hair" className="hover:text-rosegold transition-colors">Hair Care Essentials</Link></li>
              <li><Link to="/lookbook" className="hover:text-rosegold transition-colors">Editorial Lookbook</Link></li>
              <li><Link to="/about" className="hover:text-rosegold transition-colors">Our Heritage</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">Visit Us</h3>
            <ul className="space-y-6 text-sm font-light opacity-70">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="shrink-0 text-rosegold" />
                <span>Ketu, Lagos, <br />Nigeria</span>
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

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-rosegold">The Style Club</h3>
            <p className="text-xs mb-6 opacity-70 leading-relaxed">Join for early access to seasonal drops and professional hair tips.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border-b border-white/20 py-3 text-sm focus:outline-none focus:border-rosegold transition-colors font-light"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-rosegold hover:text-white transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            © {currentYear} Ikeyà Originals. Crafted with authenticity.
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