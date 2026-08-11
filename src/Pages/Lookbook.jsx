import Layout from "../Shared/Layout/Layout";
import { ArrowRight, Instagram, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Lookbook = () => {
  const collections = [
    {
      id: 1,
      title: "The Heritage Bloom",
      theme: "Cultural Elegance × Hair Wellness",
      description:
        "Ikeyá Originals is born from the names Ikeyemi + Ayomide — a celebration of joy, heritage, and self-love. Our StyleXIkeya Adire-inspired fashion pairs with Ikeya Naturals' BotaniButter Growth Oil, so your style moves like art — and your hair thrives.",
      mainImage:
        "https://res.cloudinary.com/dk8uaekik/image/upload/f_auto,q_auto,w_1400/v1770814975/ikeya1_hszczi.jpg",
      featuredProducts: ["Adire Two-Piece", "BotaniButter Growth Oil"],
      testimonial:
        "The way the fabric moves is magical, and my hair has never felt healthier.",
      client: "Sarah J., Lagos",
    },
    {
      id: 2,
      title: "Urban Crown",
      theme: "Everyday Luxe × Haircare Confidence",
      description:
        "Ikeyá Originals is for the modern woman on the move: effortless style, nourished hair, and confidence in every step. StyleXIkeya's Minimal Linen meets Ikeya Naturals' growth oils, combining everyday luxury with haircare rooted in culture and care.",
      mainImage:
        "https://res.cloudinary.com/dk8uaekik/image/upload/f_auto,q_auto,w_1400/v1770814973/ikeya2_jhyfca.jpg",
      featuredProducts: ["Minimal Linen Blazer", "Satin Bonnet", "Growth Oil"],
      testimonial: "Finally, a brand that understands my hair and my style.",
      client: "Bisi A., Abuja",
    },
  ];

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = "/ikeya-lookbook-2025.pdf";
    link.download = "Ikeya-Lookbook-2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="pt-32 pb-20 bg-white">
        {/* --- HEADER --- */}
        <section className="px-6 max-w-7xl mx-auto mb-28 text-center">
          <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold">
            The Archive
          </span>
          <h1 className="text-5xl md:text-8xl font-display text-black mt-6 mb-8 uppercase tracking-tighter font-bold">
            Styled{" "}
            <span className="italic font-light text-amber-900 border-b-2 border-amber-900 pb-2">
              Shoots
            </span>
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Explore the synergy of Ikeyá Fashion and Hair Care. Each look is a
            testament to authenticity, blending modern luxury with African roots.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-3 border border-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
            >
              <Download size={14} /> Download Lookbook PDF
            </button>
          </div>
        </section>

        {/* --- COLLECTIONS LIST --- */}
        <div className="space-y-40">
          {collections.map((item, index) => (
            <section
              key={item.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-16 items-center max-w-7xl mx-auto px-6`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-3/5 relative group overflow-hidden bg-neutral-100">
                <img
                  src={item.mainImage}
                  alt={item.title}
                  className="w-full h-[500px] md:h-[750px] object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 bg-white px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                    <span className="text-amber-800 mr-2">/</span> Theme:{" "}
                    {item.theme}
                  </p>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-2/5 space-y-10">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display text-black mb-6 uppercase tracking-tighter font-bold">
                    {item.title}
                  </h2>
                  <p className="text-neutral-500 leading-relaxed text-lg font-light">
                    {item.description}
                  </p>
                </div>

                <div className="bg-neutral-50 p-10 border-l-4 border-amber-900">
                  <p className="italic text-black/80 text-xl font-display mb-6 leading-snug">
                    "{item.testimonial}"
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900">
                    — {item.client}
                  </span>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
                    Product Details:
                  </h4>
                  <ul className="grid grid-cols-2 gap-4">
                    {item.featuredProducts.map((prod, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-600"
                      >
                        <div className="w-1 h-1 rounded-full bg-amber-800" />{" "}
                        {prod}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all group"
                >
                  Shop the Look{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* --- SHOP CATEGORIES INTRO BLOCK --- */}
        <section className="mt-40 py-24 bg-neutral-50 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
            {/* Fashion */}
            <div className="border-l-4 border-amber-800 pl-8 space-y-4">
              <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold block">
                StyleXIkeya
              </span>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tighter text-black">
                Heritage Meets Modern
              </h3>
              <p className="text-neutral-500 text-base leading-relaxed font-light">
                Explore our Adire-inspired pieces and Minimalist Linen designs.
                Every outfit celebrates culture, confidence, and effortless
                elegance — designed for the woman who moves through life with
                purpose and style.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-amber-800 hover:border-amber-800 transition-all"
              >
                Browse Fashion →
              </Link>
            </div>

            {/* Haircare */}
            <div className="border-l-4 border-amber-800 pl-8 space-y-4">
              <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold block">
                Ikeya Naturals
              </span>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tighter text-black">
                Nurture Your Crown
              </h3>
              <p className="text-neutral-500 text-base leading-relaxed font-light">
                Discover our BotaniButter Growth Oils, moisturisers, and
                protective haircare solutions. Designed to nourish, strengthen,
                and celebrate your natural hair — because self-care starts at
                the roots.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-amber-800 hover:border-amber-800 transition-all"
              >
                Browse Haircare →
              </Link>
            </div>
          </div>
        </section>

        {/* --- CLIENT SHOWCASE GRID (BLACK THEME) --- */}
        <section className="mt-0 bg-black py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-amber-600 uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">
                Community
              </span>
              <h2 className="text-4xl md:text-6xl font-display text-white mb-6 uppercase tracking-tighter">
                Ikeyá Women
              </h2>
              <div className="w-20 h-[1px] bg-amber-800 mx-auto opacity-50"></div>
            </div>

            {/* --- LUXURY AUTO SLIDER --- */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll gap-8 w-max">
                {[
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900663/ikeya4_xzxndl.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya5_hhmpvq.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya6_rdnka6.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya7_phznct.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya9_zqtzfv.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya10_d0u6zy.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya11_bsl0lo.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901095/ikeya8_icc4qy.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1771080035/ikeya13_pyzgvp.jpg",
                  // Duplicate for seamless infinite effect
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900663/ikeya4_xzxndl.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya5_hhmpvq.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya6_rdnka6.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770900662/ikeya7_phznct.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya9_zqtzfv.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya10_d0u6zy.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya11_bsl0lo.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1770901095/ikeya8_icc4qy.jpg",
                  "https://res.cloudinary.com/dk8uaekik/image/upload/v1771080035/ikeya13_pyzgvp.jpg",
                ].map((image, i) => (
                  <a
                    key={i}
                    href="https://www.instagram.com/ikeya_originals?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group w-[250px] md:w-[300px] aspect-[4/5] overflow-hidden"
                  >
                    <img
                      src={image}
                      alt="Ikeyà Community"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl">
                        <Instagram
                          size={18}
                          className="text-black"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-20 text-center">
              <p className="text-neutral-400 mb-10 tracking-[0.1em] font-light">
                Tag us{" "}
                <span className="text-white font-bold">@IkeyaOriginals</span> to
                be featured
              </p>
              <button className="bg-white text-black px-12 py-5 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-amber-800 hover:text-white transition-all duration-500 shadow-2xl">
                Join the Style Club
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Lookbook;