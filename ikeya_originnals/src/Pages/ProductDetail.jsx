import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Layout from "../Shared/Layout/Layout";
import { useCart } from "../Context/CartContext";
import {
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Truck,
  RefreshCw,
  MessageCircle,
  X,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToBag } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const formatPrice = (priceInKobo) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(priceInKobo / 100);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
            Revealing Details
          </p>
        </div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-display mb-4 uppercase">
            Product Not Found
          </h2>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Return to Shop
          </Link>
        </div>
      </Layout>
    );

  const isFashion = product.type === "FASHION";
  const isOutOfStock = typeof product.stock === "number" && product.stock === 0;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in *${product.name}*. Could you help me with sizing, availability, and how to place an order?`
  );
  const whatsappUrl = `https://wa.me/+2349161270548?text=${whatsappMessage}`;

  return (
    <Layout>
      {/* ── WhatsApp Modal ── */}
      {showWhatsAppModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          onClick={() => setShowWhatsAppModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 flex items-center justify-center">
                <MessageCircle size={20} color="white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-800 font-bold">
                  Style X Ikeyá
                </p>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight">
                  Order via WhatsApp
                </h3>
              </div>
            </div>

            <p className="text-neutral-500 text-sm leading-relaxed mb-2">
              Our fashion pieces are made-to-order and tailored to you. You'll be
              redirected to WhatsApp to enquire about sizing, customisation, and
              delivery directly with our team.
            </p>

            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-8">
              You're enquiring about:{" "}
              <span className="text-black font-bold">{product.name}</span>
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 text-white py-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-green-600 transition-all mb-3"
            >
              Open WhatsApp
            </a>

            <a
              href={`mailto:hello@ikeyaoriginnals.site?subject=Enquiry: ${product.name}`}
              className="block w-full border border-neutral-200 text-black py-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] hover:border-black transition-all"
            >
              Email Us Instead
            </a>
          </div>
        </div>
      )}

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-12">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight size={10} />
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isOutOfStock ? "opacity-50 grayscale" : ""
                }`}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-3">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            <span className="text-amber-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
              {product.type} / {product.category?.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-black mb-6">
              {product.name}
            </h1>
            <p className="text-2xl text-black font-light mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="h-[1px] bg-neutral-100 w-full mb-8" />

            {/* Out of Stock Notice */}
            {isOutOfStock && (
              <div className="bg-neutral-100 border border-neutral-300 px-5 py-4 mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-700 font-bold mb-1">
                  Currently Unavailable
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  This item is out of stock. Check back soon or browse our other pieces.
                </p>
              </div>
            )}

            {/* Fashion enquiry notice — only when in stock */}
            {isFashion && !isOutOfStock && (
              <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-bold mb-1">
                  Made-to-Order
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This piece is crafted specially for you. Tap below to enquire
                  about sizing and availability via WhatsApp.
                </p>
              </div>
            )}

            {/* Quantity Selector — only for Beauty, only when in stock */}
            {!isFashion && !isOutOfStock && (
              <div className="flex flex-col gap-4 mb-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-200 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isOutOfStock ? (
                <button
                  disabled
                  className="grow bg-neutral-200 text-neutral-400 py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 cursor-not-allowed"
                >
                  <ShoppingBag size={16} /> Out of Stock
                </button>
              ) : isFashion ? (
                <button
                  onClick={() => setShowWhatsAppModal(true)}
                  className="grow bg-black text-white py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-green-600 transition-all duration-500"
                >
                  <MessageCircle size={16} /> Enquire on WhatsApp
                </button>
              ) : (
                <button
                  onClick={() => addToBag({ productId: product.id, quantity, product })}
                  className="grow bg-black text-white py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-900 transition-all duration-500"
                >
                  <ShoppingBag size={16} /> Add to Bag
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-12 py-6 border-y border-neutral-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">
                  Fast Delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">
                  Authentic
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">
                  Easy Returns
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex gap-8 border-b border-neutral-100">
                {["description", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
                      activeTab === tab
                        ? "border-b-2 border-black text-black"
                        : "text-neutral-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-neutral-500 text-sm leading-relaxed min-h-[100px]">
                {activeTab === "description" ? (
                  <p>
                    {product.description ||
                      "No description available for this premium piece."}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    <li>• Sustainably Sourced</li>
                    <li>• Handcrafted Details</li>
                    <li>• Signature House Style</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;