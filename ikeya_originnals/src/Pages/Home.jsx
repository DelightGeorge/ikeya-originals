import Layout from "../Shared/Layout/Layout";
import {
  Truck,
  ShieldCheck,
  Star,
  RefreshCw,
  Droplets, // Added for beauty context
  Sparkles,  // Added for beauty context
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const Home = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=70&w=1600",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=70&w=1600",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=70&w=1600",
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Signature Silk Dress",
      price: "₦45,000",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 2,
      name: "Adire Two-Piece Set",
      price: "₦32,000",
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 3,
      name: "Minimal Linen Wear",
      price: "₦38,000",
      img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 4,
      name: "Classic Evening Gown",
      price: "₦65,000",
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=75&w=1000",
    },
  ];

  // --- NEW BEAUTY PRODUCTS DATA ---
  const beautyProducts = [
    {
      id: 101,
      name: "Nourishing Growth Oil",
      price: "₦8,500",
      tag: "100% Organic",
      img: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 102,
      name: "Whipped Shea Hair Butter",
      price: "₦7,000",
      tag: "Moisture Rich",
      img: "https://images.unsplash.com/photo-1564277287253-934c868e54ea?auto=format&fit=crop&q=75&w=800",
    },
  ];

  const testimonials = [
    {
      name: "Amina O.",
      quote: "The quality is outstanding. The fit, the fabric, everything feels premium.",
    },
    {
      name: "Deborah K.",
      quote: "Ikeyà Originals feels like international fashion, but made for us.",
    },
    {
      name: "Tolu A.",
      quote: "Fast delivery and beautiful finishing. I keep getting compliments.",
    },
  ];

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70svh] md:h-[80vh] min-h-[520px] overflow-hidden bg-plum">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="absolute inset-0"
        >
          {heroImages.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt="Ikeyà Originals fashion editorial"
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-20 flex items-center px-6">
          <div className="max-w-7xl mx-auto text-white">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold">
              Ikeyà <span className="text-rosegold italic">Originals</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg opacity-90 max-w-md">
              Contemporary African Fashion & Beauty, Crafted with Elegance.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <div className="bg-plum py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-cream text-[11px] uppercase tracking-widest text-center">
          {[
            { icon: <Truck size={18} />, text: "Nationwide Delivery" },
            { icon: <ShieldCheck size={18} />, text: "Premium Quality" },
            { icon: <Star size={18} />, text: "Authentic Design" },
            { icon: <RefreshCw size={18} />, text: "Easy Returns" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3">
              <span className="text-rosegold">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ================= NEW ARRIVALS (FASHION) ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-display text-plum mb-12">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-plum">{p.name}</h3>
              <p className="text-rosegold">{p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BEAUTY SECTION (OIL & BUTTER) ================= */}
      <section className="py-24 bg-plum text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-rosegold uppercase tracking-[0.2em] text-xs font-bold mb-3 block">Self-Care Essentials</span>
              <h2 className="text-4xl font-display">Ikeyà Beauty</h2>
              <p className="text-cream/70 mt-4 text-lg">
                Introducing our botanical-infused hair care line. Designed to nourish your crown with the purest natural ingredients.
              </p>
            </div>
            <Link to="/shop/beauty" className="text-rosegold border-b border-rosegold pb-1 hover:text-white transition">
              View All Beauty
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {beautyProducts.map((p) => (
              <div key={p.id} className="group relative flex flex-col sm:flex-row bg-white/5 p-4 rounded-sm items-center gap-8 border border-white/10 hover:border-rosegold transition-colors">
                <div className="w-full sm:w-1/2 aspect-square overflow-hidden bg-white">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                </div>
                <div className="w-full sm:w-1/2 py-4">
                  <div className="flex items-center gap-2 text-rosegold mb-2">
                    <Sparkles size={14} />
                    <span className="text-[10px] uppercase tracking-tighter font-bold">{p.tag}</span>
                  </div>
                  <h3 className="text-2xl font-display mb-2">{p.name}</h3>
                  <p className="text-xl text-rosegold font-bold mb-6">{p.price}</p>
                  <button className="bg-rosegold text-plum px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition">
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALL PRODUCTS CTA ================= */}
      <section className="py-20 bg-beige text-center">
        <h2 className="text-3xl font-display text-plum mb-4">
          Explore the Full Collection
        </h2>
        <p className="text-plum/70 max-w-xl mx-auto mb-8">
          From signature silhouettes to nourishing essentials.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-plum text-cream px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-rosegold transition"
        >
          Shop Now
        </Link>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-display text-plum mb-12 text-center">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-plum/10 p-8 text-center bg-white">
              <p className="italic text-plum/80 mb-6">“{t.quote}”</p>
              <span className="font-bold text-plum">{t.name}</span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;