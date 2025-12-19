import Layout from "../Shared/Layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="pt-32 pb-20">
        <section className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rosegold uppercase tracking-[0.3em] text-xs font-bold">Get In Touch</span>
            <h1 className="text-5xl font-display text-plum mt-4">Join the Style Club</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* --- CONTACT INFO --- */}
            <div className="lg:col-span-1 space-y-10">
              <div className="bg-beige p-8 space-y-8">
                <div className="flex gap-4">
                  <MapPin className="text-rosegold shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-plum text-sm uppercase tracking-widest mb-1">Location</h4>
                    <p className="text-plum/70 text-sm">Ikeyà Originals, Ketu, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-rosegold shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-plum text-sm uppercase tracking-widest mb-1">Phone</h4>
                    <p className="text-plum/70 text-sm">+234-7066366337</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-rosegold shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-plum text-sm uppercase tracking-widest mb-1">Email</h4>
                    <p className="text-plum/70 text-sm">ikeyaoriginals@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-rosegold shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-plum text-sm uppercase tracking-widest mb-1">Hours</h4>
                    <p className="text-plum/70 text-sm">Mon–Sat: 09:00 – 18:00</p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP CTA */}
              <a 
                href="https://wa.me/2347066366337" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:opacity-90 transition"
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
            </div>

            {/* --- CONTACT FORM --- */}
            <div className="lg:col-span-2">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-plum/5 p-8 shadow-sm">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Full Name</label>
                  <input type="text" className="w-full border-b border-plum/10 py-3 focus:border-rosegold outline-none transition" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Email Address</label>
                  <input type="email" className="w-full border-b border-plum/10 py-3 focus:border-rosegold outline-none transition" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Subject</label>
                  <select className="w-full border-b border-plum/10 py-3 focus:border-rosegold outline-none transition bg-transparent">
                    <option>Custom Outfit Inquiry</option>
                    <option>Hair Care Consultation</option>
                    <option>Order Support</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Message</label>
                  <textarea rows="4" className="w-full border-b border-plum/10 py-3 focus:border-rosegold outline-none transition resize-none" placeholder="How can we help you stay original?"></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="bg-plum text-cream w-full py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-rosegold transition-colors">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;