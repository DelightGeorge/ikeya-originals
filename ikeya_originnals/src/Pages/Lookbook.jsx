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
      <div className="pt-32 pb-20">
        {/* --- HEADER --- */}
        <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
          <span className="text-rosegold uppercase tracking-[0.3em] text-xs font-bold">Portfolio</span>
          <h1 className="text-5xl md:text-7xl font-display text-plum mt-4 mb-6">
            Styled <span className="italic">Shoots</span>
          </h1>
          <p className="text-plum/60 max-w-2xl mx-auto text-lg">
            Explore the synergy of Ikeyà Fashion and Hair Care. Each look is a testament to authenticity and African creativity.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="flex items-center gap-2 border border-plum px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-plum hover:text-white transition">
              <Download size={16} /> Download PDF Lookbook
            </button>
          </div>
        </section>

        {/* --- COLLECTIONS LIST --- */}
        <div className="space-y-32">
          {collections.map((item, index) => (
            <section key={item.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center max-w-7xl mx-auto px-6`}>
              {/* Image Side */}
              <div className="w-full lg:w-3/5 relative group overflow-hidden">
                <img 
                  src={item.mainImage} 
                  alt={item.title} 
                  className="w-full h-[500px] md:h-[700px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-plum">Theme: {item.theme}</p>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-2/5 space-y-8">
                <div>
                  <h2 className="text-4xl font-display text-plum mb-4">{item.title}</h2>
                  <p className="text-plum/70 leading-relaxed text-lg">{item.description}</p>
                </div>

                <div className="bg-beige p-8 border-l-4 border-rosegold">
                  <p className="italic text-plum/80 mb-4">“{item.testimonial}”</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-plum">— {item.client}</span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rosegold">Featured in this look:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {item.featuredProducts.map((prod, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-plum">
                        <div className="w-1.5 h-1.5 rounded-full bg-rosegold" /> {prod}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-3 bg-plum text-cream px-8 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-rosegold transition-colors group"
                >
                  Shop the Look <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* --- CLIENT SHOWCASE GRID --- */}
        <section className="mt-40 bg-plum py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display text-cream mb-4">Ikeyà Women</h2>
              <p className="text-cream/60 uppercase tracking-widest text-xs">Real Clients. Authentic Style.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/10 relative group overflow-hidden">
                   <img 
                    src={`https://images.unsplash.com/photo-1523944339743-0fe06f079939?auto=format&fit=crop&q=80&w=600&sig=${i}`} 
                    alt="Client Showcase" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Instagram className="text-white" size={24} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-cream/80 mb-6">Tag us @IkeyaOriginals to be featured</p>
              <button className="bg-rosegold text-plum px-10 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition">
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