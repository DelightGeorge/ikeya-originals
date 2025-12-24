import Layout from "../Shared/Layout/Layout";
import { ArrowRight, Instagram, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Lookbook = () => {
  const collections = [
    {
      id: 1,
      title: "The Heritage Bloom",
      theme: "Cultural Elegance x Modern Silhouettes",
      description: "A celebration of Adire fabrics paired with our signature growth oil for a healthy, glowing aesthetic.",
      mainImage: "https://images.unsplash.com/photo-1539109132381-31a15b22e8c0?auto=format&fit=crop&q=80&w=1200",
      featuredProducts: ["Adire Two-Piece", "Growth Oil"],
      testimonial: "The way the fabric moves is magical. It feels like art.",
      client: "Sarah J., Lagos"
    },
    {
      id: 2,
      title: "Urban Crown",
      theme: "Protective Styling & Street Luxe",
      description: "Showcasing our premium wigs and the Minimal Linen wear line for the woman on the go.",
      mainImage: "https://images.unsplash.com/photo-1492633397843-92adffad3d1c?auto=format&fit=crop&q=80&w=1200",
      featuredProducts: ["Linen Wear", "Satin Bonnet"],
      testimonial: "Finally, a brand that understands my hair and my style.",
      client: "Bisi A., Abuja"
    }
  ];

  return (
    <Layout>
      <div className="pt-32 pb-20 bg-white">
        {/* --- HEADER --- */}
        <section className="px-6 max-w-7xl mx-auto mb-28 text-center">
          <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold">The Archive</span>
          <h1 className="text-5xl md:text-8xl font-display text-black mt-6 mb-8 uppercase tracking-tighter font-bold">
            Styled <span className="italic font-light text-amber-900 border-b-2 border-amber-900 pb-2">Shoots</span>
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Explore the synergy of Ikeyà Fashion and Hair Care. Each look is a testament to authenticity, 
            blending modern luxury with African roots.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <button className="flex items-center gap-3 border border-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500">
              <Download size={14} /> Download Lookbook PDF
            </button>
          </div>
        </section>

        {/* --- COLLECTIONS LIST --- */}
        <div className="space-y-40">
          {collections.map((item, index) => (
            <section 
              key={item.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center max-w-7xl mx-auto px-6`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-3/5 relative group overflow-hidden bg-neutral-100">
                <img 
                  src={item.mainImage} 
                  alt={item.title} 
                  className="w-full h-[500px] md:h-[750px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 bg-white px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                    <span className="text-amber-800 mr-2">/</span> Theme: {item.theme}
                  </p>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-2/5 space-y-10">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display text-black mb-6 uppercase tracking-tighter font-bold">{item.title}</h2>
                  <p className="text-neutral-500 leading-relaxed text-lg font-light">{item.description}</p>
                </div>

                <div className="bg-neutral-50 p-10 border-l-4 border-amber-900">
                  <p className="italic text-black/80 text-xl font-display mb-6 leading-snug">“{item.testimonial}”</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900">— {item.client}</span>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Product Details:</h4>
                  <ul className="grid grid-cols-2 gap-4">
                    {item.featuredProducts.map((prod, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-600">
                        <div className="w-1 h-1 rounded-full bg-amber-800" /> {prod}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all group"
                >
                  Shop the Look <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* --- CLIENT SHOWCASE GRID (BLACK THEME) --- */}
        <section className="mt-48 bg-black py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-amber-600 uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Community</span>
              <h2 className="text-4xl md:text-6xl font-display text-white mb-6 uppercase tracking-tighter">Ikeyà Women</h2>
              <div className="w-20 h-[1px] bg-amber-800 mx-auto opacity-50"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] bg-neutral-900 relative group overflow-hidden">
                   <img 
                    src={`https://images.unsplash.com/photo-1523944339743-0fe06f079939?auto=format&fit=crop&q=80&w=600&sig=${i}`} 
                    alt="Client Showcase" 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                    <Instagram className="text-white" size={20} strokeWidth={1.5} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <p className="text-neutral-400 mb-10 tracking-[0.1em] font-light">Tag us <span className="text-white font-bold">@IkeyaOriginals</span> to be featured</p>
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