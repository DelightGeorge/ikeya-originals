import Layout from "../Shared/Layout/Layout";
import {
  Truck,
  ShieldCheck,
  Star,
  RefreshCw,
  Sparkles,
  Heart,
  Scissors,
  ArrowRight
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const Home = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
  ];

  const featuredProducts = [
    { id: 1, name: "Signature Silk Dress", price: "₦45,000", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=75&w=1000" },
    { id: 2, name: "Adire Two-Piece Set", price: "₦32,000", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=75&w=1000" },
    { id: 3, name: "Minimal Linen Wear", price: "₦38,000", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=75&w=1000" },
    { id: 4, name: "Classic Evening Gown", price: "₦65,000", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=75&w=1000" },
  ];

  const beautyProducts = [
    { id: 101, name: "Nourishing Growth Oil", price: "₦8,500", tag: "100% Organic", img: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=75&w=800" },
    { id: 102, name: "Whipped Shea Hair Butter", price: "₦7,000", tag: "Moisture Rich", img: "https://images.unsplash.com/photo-1564277287253-934c868e54ea?auto=format&fit=crop&q=75&w=800" },
  ];

  return (
    <Layout>
      {/* ================= HERO (BLACK & WHITE OVERLAY) ================= */}
      <section className="relative w-full h-[85svh] md:h-screen overflow-hidden bg-black">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="absolute inset-0 w-full h-full"
        >
          {heroImages.map((src, i) => (
            <SwiperSlide key={i} className="w-full h-full">
              <img 
                src={src} 
                alt="Ikeyà Originals Brand Hero" 
                className="w-full h-full object-cover object-top md:object-center grayscale-[30%] brightness-75" 
                loading={i === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight">
              Ikeyà <span className="text-white italic font-light underline decoration-amber-800 underline-offset-8">Originals</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-light tracking-[0.15em] uppercase">
              Designs <span className="mx-2 text-amber-700">•</span> Naturals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop/fashion" className="w-full sm:w-auto bg-white text-black px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-800 hover:text-white transition-all duration-500">
                Explore Designs
              </Link>
              <Link to="/shop/beauty" className="w-full sm:w-auto bg-transparent border border-white text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black transition-all duration-500">
                Explore Naturals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR (BLACK) ================= */}
      <div className="bg-black py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-6 text-white text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-center">
          {[
            { icon: <Truck size={18} />, text: "Nationwide" },
            { icon: <ShieldCheck size={18} />, text: "Premium" },
            { icon: <Star size={18} />, text: "Authentic" },
            { icon: <RefreshCw size={18} />, text: "Returns" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center justify-center gap-3">
              <span className="text-amber-700">{item.icon}</span> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ================= FASHION: IKEYÀ DESIGNS (WHITE & BLACK) ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
                <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">Sub-Brand 01</span>
                <h2 className="text-4xl md:text-5xl font-display text-black font-bold uppercase tracking-tighter">Ikeyà Designs</h2>
            </div>
            <Link to="/shop/fashion" className="group flex items-center gap-2 text-black font-bold text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-amber-800 hover:border-amber-800 transition-all">
              The Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-5">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1">{p.name}</h3>
              <p className="text-amber-900 font-medium text-sm">{p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BEAUTY: IKEYÀ NATURALS (BROWN/EARTH) ================= */}
      <section className="py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-amber-800 pl-8">
            <div className="max-w-2xl">
              <span className="text-amber-600 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Sub-Brand 02</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-6 text-white">Ikeyà Naturals</h2>
              <p className="text-neutral-400 text-lg leading-relaxed font-light">
                Premium botanical hair care. Formulated with earth-derived ingredients to restore the strength and majesty of your natural crown.
              </p>
            </div>
            <Link to="/shop/beauty" className="bg-amber-800 text-white px-8 py-4 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all">
              Shop Naturals
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {beautyProducts.map((p) => (
              <div key={p.id} className="group flex flex-col sm:flex-row bg-white/5 p-4 rounded-none items-center gap-10 border border-white/5 hover:border-amber-800/50 transition-all duration-700">
                <div className="w-full sm:w-1/2 aspect-square overflow-hidden grayscale-[40%] group-hover:grayscale-0 transition-all duration-700">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full sm:w-1/2 pr-4 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-600 mb-3">
                    <Sparkles size={14} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{p.tag}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2 uppercase tracking-tight">{p.name}</h3>
                  <p className="text-xl text-white font-light mb-8 italic">{p.price}</p>
                  <button className="w-full border border-white text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRAND PHILOSOPHY (WHITE & BROWN) ================= */}
      <section className="py-32 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 items-start">
            <div className="md:col-span-1">
               <h2 className="text-5xl font-display text-black font-bold uppercase leading-[0.9]">The<br/>Brand<br/><span className="text-amber-800 italic font-light lowercase text-4xl leading-none">Essence</span></h2>
            </div>
            <div className="space-y-10 md:col-span-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-amber-900">
                  <Scissors size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-black">Ikeyà Designs</h3>
                </div>
                <p className="text-neutral-500 text-lg leading-relaxed border-l-2 border-neutral-100 pl-6">
                  Contemporary fashion rooted in African heritage. We blend structured silhouettes with traditional textiles to create timeless pieces for the modern visionary.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-amber-900">
                  <Heart size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-black">Ikeyà Naturals</h3>
                </div>
                <p className="text-neutral-500 text-lg leading-relaxed border-l-2 border-neutral-100 pl-6">
                  Honest hair care. We believe that what you put on your body is as important as what you put in it. Pure, brown-earth botanicals for ultimate nourishment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION (BROWN BACKGROUND) ================= */}
      <section className="py-24 bg-amber-900 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8">Elevate Your Existence</h2>
          <Link
            to="/shop"
            className="inline-block bg-white text-black px-16 py-5 uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-500"
          >
            Shop Entire House
          </Link>
        </div>
      </section>

      {/* ================= TESTIMONIALS (MINIMALIST) ================= */}
      <section className="py-28 px-6 max-w-7xl mx-auto bg-white">
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { name: "Amina O.", quote: "Ikeyà Designs is where I find pieces that represent my culture and my ambition." },
            { name: "Deborah K.", quote: "The Naturals growth oil is a staple in my routine. Organic, effective, and beautiful." },
            { name: "Tolu A.", quote: "The perfect synergy of fashion and wellness. This is the future of luxury." }
          ].map((t, i) => (
            <div key={i} className="text-left space-y-6">
              <p className="text-2xl font-display italic text-black leading-snug">“{t.quote}”</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-amber-800"></div>
                <span className="font-bold text-black tracking-[0.2em] uppercase text-[10px]">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;