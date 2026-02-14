import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { useCart } from "../Context/CartContext";

import { formatPrice } from "../utils/formatters";
import { MAX_FEATURED_PRODUCTS } from "../constants/products";
import {
  Truck,
  ShieldCheck,
  Star,
  RefreshCw,
  Sparkles,
  Heart,
  Scissors,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import LoadingScreen from "../Components/LoadingScreen";

const Home = () => {
  const [fashionProducts, setFashionProducts] = useState([]);
  const [beautyProducts, setBeautyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ fashion: false, beauty: false });
  const { addToBag } = useCart();
  const navigate = useNavigate();

  // Each hero image has a custom object-position so the subject is always
  // well-framed on both mobile and desktop viewports.
  // ─────────────────────────────────────────────────────────────────────────────
  // Each slide has its own inline style so you can fine-tune per image.
  // objectPosition controls WHAT part of the photo stays visible in the frame.
  //   "center center"  → centres the image (landscape / full-body shots)
  //   "top center"     → anchors to the top (keeps faces / heads in frame)
  //   "50% 20%"        → focal point sits 20% from top (slightly below top)
  //
  // If any image still looks off after deploying, just change its objectPosition.
  const heroImages = [
    "https://res.cloudinary.com/dk8uaekik/image/upload/v1770764193/ikeya/products/slrji7iim9uagvjq79c3.jpg",
    "https://res.cloudinary.com/dk8uaekik/image/upload/v1770573948/ikeya/products/joel6urttprrzpm5acmb.jpg",
    "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya11_bsl0lo.jpg",
    "https://res.cloudinary.com/dk8uaekik/image/upload/v1770814973/ikeya2_jhyfca.jpg",
    "https://res.cloudinary.com/dk8uaekik/image/upload/v1771080034/ikeya12_otjnko.jpg"
  ];

  const trustFeatures = useMemo(
    () => [
      { icon: <Truck size={18} />, text: "Nationwide" },
      { icon: <ShieldCheck size={18} />, text: "Premium" },
      { icon: <Star size={18} />, text: "Authentic" },
      { icon: <RefreshCw size={18} />, text: "Returns" },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Amina O.",
        quote:
          "Ikeyá Designs is where I find pieces that represent my culture and my ambition.",
      },
      {
        name: "Deborah K.",
        quote:
          "The Naturals growth oil is a staple in my routine. Organic, effective, and beautiful.",
      },
      {
        name: "Tolu A.",
        quote:
          "The perfect synergy of fashion and wellness. This is the future of luxury.",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const fashionRes = await api.get("/products/type/FASHION");
        const fashionData = Array.isArray(fashionRes.data)
          ? fashionRes.data
          : fashionRes.data?.content ?? fashionRes.data?.products ?? [];
        setFashionProducts(fashionData.slice(0, MAX_FEATURED_PRODUCTS));
      } catch (err) {
        console.error("Fashion fetch error:", err);
        setError((prev) => ({ ...prev, fashion: true }));
      }

      try {
        const beautyRes = await api.get("/products/type/BEAUTY");
        const beautyData = Array.isArray(beautyRes.data)
          ? beautyRes.data
          : beautyRes.data?.content ?? beautyRes.data?.products ?? [];
        setBeautyProducts(beautyData.slice(0, MAX_FEATURED_PRODUCTS));
      } catch (err) {
        console.error("Beauty fetch error:", err);
        setError((prev) => ({ ...prev, beauty: true }));
      }

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <LoadingScreen message="Entering the House of Ikeyá" />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[85svh] md:h-screen overflow-hidden bg-black">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="absolute inset-0 w-full h-full"
        >
          {heroImages.map((image, i) => (
            <SwiperSlide key={i} className="w-full h-full">
              <img
                src={image}
                alt="Ikeyá Originals Brand Hero"
                className="w-full h-full object-cover object-center brightness-[0.72]"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight">
              Ikeyá{" "}
              <span className="text-white italic font-light underline decoration-amber-800 underline-offset-8">
                Originals
              </span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-light tracking-[0.15em] uppercase">
              Designs <span className="mx-2 text-amber-700">•</span> Naturals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-white text-black px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-800 hover:text-white transition-all duration-500"
              >
                Explore Designs
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-transparent border border-white text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black transition-all duration-500"
              >
                Explore Naturals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <div className="bg-black py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-6 text-white text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-center">
          {trustFeatures.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center justify-center gap-3"
            >
              <span className="text-amber-700">{item.icon}</span> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ================= FASHION: IKEYÀ DESIGNS ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">
              Sub-Brand 01
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-black font-bold uppercase tracking-tighter">
              Style X Ikeyá
            </h2>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-2 text-black font-bold text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-amber-800 hover:border-amber-800 transition-all"
          >
            The Collection{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {error.fashion ? (
          <div className="py-16 text-center">
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-4">
              Unable to load fashion collection
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-amber-800 text-xs uppercase tracking-widest font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : fashionProducts.length === 0 ? (
          <div className="py-16 text-center text-neutral-300 text-xs uppercase tracking-widest">
            Collection coming soon
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {fashionProducts.map((p) => (
              <div key={p.id} className="group flex flex-col h-full">
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-5">
                  <img
                    onClick={() => navigate(`/product/${p.id}`)}
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 cursor-pointer"
                  />
                  <button
                    onClick={() => addToBag(p)}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1 hover:text-amber-800 transition-colors">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-amber-900 font-medium text-sm">
                  {formatPrice(p.price)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= BEAUTY: IKEYÀ NATURALS ================= */}
      <section className="py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-amber-800 pl-8">
            <div className="max-w-2xl">
              <span className="text-amber-600 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">
                Sub-Brand 02
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-6 text-white">
                Ikeyá Naturals
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed font-light">
                Premium botanical hair care. Formulated with earth-derived
                ingredients to restore the strength and majesty of your natural
                crown.
              </p>
            </div>
            <Link
              to="/shop"
              className="bg-amber-800 text-white px-8 py-4 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all"
            >
              Shop Naturals
            </Link>
          </div>

          {error.beauty ? (
            <div className="py-16 text-center">
              <p className="text-neutral-500 text-xs uppercase tracking-widest mb-4">
                Unable to load beauty products
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-amber-600 text-xs uppercase tracking-widest font-bold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : beautyProducts.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 text-xs uppercase tracking-widest">
              Products coming soon
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              {beautyProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col sm:flex-row bg-white/5 p-4 rounded-none items-center gap-10 border border-white/5 hover:border-amber-800/50 transition-all duration-700"
                >
                  <div
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="w-full sm:w-1/2 aspect-square overflow-hidden transition-all duration-700 cursor-pointer"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 pr-4 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-600 mb-3">
                      <Sparkles size={14} />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                        {p.category?.name || "Organic"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2 uppercase tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-xl text-white font-light mb-6 italic">
                      {formatPrice(p.price)}
                    </p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => addToBag(p)}
                        className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-800 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                      <Link
                        to={`/product/${p.id}`}
                        className="block w-full text-center border border-white/30 text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-white transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= BRAND PHILOSOPHY ================= */}
      <section className="py-32 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 items-start">
            <div className="md:col-span-1">
              <h2 className="text-5xl font-display text-black font-bold uppercase leading-[0.9]">
                The
                <br />
                Brand
                <br />
                <span className="text-amber-800 italic font-light lowercase text-4xl leading-none">
                  Essence
                </span>
              </h2>
            </div>
            <div className="space-y-10 md:col-span-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-amber-900">
                  <Scissors size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-black">
                    Ikeyá Designs
                  </h3>
                </div>
                <p className="text-neutral-500 text-lg leading-relaxed border-l-2 border-neutral-100 pl-6">
                  Contemporary fashion rooted in African heritage. We blend
                  structured silhouettes with traditional textiles to create
                  timeless pieces for the modern visionary.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-amber-900">
                  <Heart size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-black">
                    Ikeyá Naturals
                  </h3>
                </div>
                <p className="text-neutral-500 text-lg leading-relaxed border-l-2 border-neutral-100 pl-6">
                  Honest hair care. We believe that what you put on your body is
                  as important as what you put in it. Pure, brown-earth
                  botanicals for ultimate nourishment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="py-24 bg-amber-900 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8">
            Elevate Your Existence
          </h2>
          <Link
            to="/shop"
            className="inline-block bg-white text-black px-16 py-5 uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-500"
          >
            Shop Entire House
          </Link>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-28 px-6 max-w-7xl mx-auto bg-white">
        <div className="grid md:grid-cols-3 gap-16">
          {testimonials.map((t, i) => (
            <div key={i} className="text-left space-y-6">
              <p className="text-2xl font-display italic text-black leading-snug">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-amber-800"></div>
                <span className="font-bold text-black tracking-[0.2em] uppercase text-[10px]">
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
