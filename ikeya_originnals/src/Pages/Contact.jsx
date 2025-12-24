import Layout from "../Shared/Layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="pt-32 pb-20 bg-white">
        <section className="px-6 max-w-7xl mx-auto">
          {/* --- HEADER --- */}
          <div className="text-center mb-20">
            <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Connect With Us</span>
            <h1 className="text-5xl md:text-7xl font-display text-black uppercase tracking-tighter font-bold">
              Join the Style <span className="italic font-light text-amber-900">Club</span>
            </h1>
            <div className="w-20 h-[1px] bg-neutral-200 mx-auto mt-8"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* --- CONTACT INFO (BLACK CARD) --- */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-black text-white p-10 space-y-10 shadow-2xl">
                <div className="flex gap-5">
                  <MapPin className="text-amber-600 shrink-0" size={22} strokeWidth={1.5} />
                  <div>
                    <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.3em] mb-2">Location</h4>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed">
                      Ikeyà Originals, Ketu,<br /> Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <Phone className="text-amber-600 shrink-0" size={22} strokeWidth={1.5} />
                  <div>
                    <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.3em] mb-2">Phone</h4>
                    <p className="text-neutral-400 text-sm font-light">+234-7066366337</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <Mail className="text-amber-600 shrink-0" size={22} strokeWidth={1.5} />
                  <div>
                    <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.3em] mb-2">Email</h4>
                    <p className="text-neutral-400 text-sm font-light">ikeyaoriginals@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <Clock className="text-amber-600 shrink-0" size={22} strokeWidth={1.5} />
                  <div>
                    <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.3em] mb-2">Hours</h4>
                    <p className="text-neutral-400 text-sm font-light uppercase tracking-widest text-xs">
                      Mon–Sat: 09:00 – 18:00
                    </p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP CTA (BROWN THEME) */}
              <a 
                href="https://wa.me/2347066366337" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-4 bg-amber-900 text-white py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-black transition-all duration-500 shadow-lg"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>

            {/* --- CONTACT FORM --- */}
            <div className="lg:col-span-2">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-2 md:p-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-neutral-200 py-3 focus:border-amber-800 outline-none transition-colors bg-transparent text-sm font-light" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full border-b border-neutral-200 py-3 focus:border-amber-800 outline-none transition-colors bg-transparent text-sm font-light" 
                    placeholder="Enter your email" 
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Subject</label>
                  <select className="w-full border-b border-neutral-200 py-3 focus:border-amber-800 outline-none transition bg-transparent text-sm font-light cursor-pointer">
                    <option>Custom Outfit Inquiry</option>
                    <option>Hair Care Consultation</option>
                    <option>Order Support</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full border-b border-neutral-200 py-3 focus:border-amber-800 outline-none transition resize-none bg-transparent text-sm font-light leading-relaxed" 
                    placeholder="How can we help you stay original?"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-6">
                  <button className="bg-black text-white w-full py-5 uppercase text-[10px] font-bold tracking-[0.4em] hover:bg-amber-900 transition-all duration-500">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* --- MAP PLACEHOLDER / DECORATION --- */}
        <section className="mt-32 h-[400px] w-full bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-1000">
           {/* You can embed a Google Maps iframe here */}
           <div className="w-full h-full flex items-center justify-center text-neutral-400 uppercase tracking-[0.5em] text-[10px]">
              Location Map Integration
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;