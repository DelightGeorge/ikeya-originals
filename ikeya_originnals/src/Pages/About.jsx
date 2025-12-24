import Layout from "../Shared/Layout/Layout";
import { Target, Eye, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="pt-32 pb-20 bg-white">
        {/* --- STORY SECTION --- */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Our Heritage</span>
              <h1 className="text-5xl md:text-7xl font-display text-black mb-8 uppercase tracking-tighter font-bold leading-none">
                Fashion Meets <br />
                <span className="italic font-light text-amber-900">Authenticity</span>.
              </h1>
              <div className="space-y-6">
                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                  Based in the heart of Ketu, Lagos, Ikeyà Originals was born from a simple yet powerful vision: to provide a home for the modern individual who refuses to compromise on quality or cultural identity.
                </p>
                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                  We bridge the gap between contemporary fashion design and premium natural hair care. Every stitch in our garments and every drop in our oils is crafted with a customer-first mindset, ensuring that "originality" isn't just a name—it's a lifestyle.
                </p>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="overflow-hidden bg-neutral-100">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Ikeyà Studio" 
                  className="w-full h-[550px] object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-black text-white p-10 hidden md:block shadow-2xl">
                <p className="text-4xl font-display font-bold tracking-tighter">Est. 2024</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-600 font-bold mt-2">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MISSION & VISION (DARK SECTION) --- */}
        <section className="bg-black py-32 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
            <div className="flex gap-8 items-start border-l border-amber-800/30 pl-8">
              <div className="text-amber-600 mt-1">
                <Target size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-widest font-bold">The Mission</h2>
                <p className="text-neutral-400 leading-relaxed text-lg font-light">
                  To deliver exclusive fashion collections and premium hair care solutions that empower our clients to express their authentic selves with confidence and elegance.
                </p>
              </div>
            </div>
            
            <div className="flex gap-8 items-start border-l border-amber-800/30 pl-8">
              <div className="text-amber-600 mt-1">
                <Eye size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-widest font-bold">The Vision</h2>
                <p className="text-neutral-400 leading-relaxed text-lg font-light">
                  To become Nigeria's leading lifestyle brand where creativity, beauty-driven innovation, and African heritage converge for the future-focused individual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CORE VALUES --- */}
        <section className="py-32 px-6 max-w-7xl mx-auto text-center">
          <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Values</span>
          <h2 className="text-4xl md:text-5xl font-display text-black mb-20 uppercase tracking-tighter font-bold">The Ikeyà Pillars</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { icon: <Heart size={24} />, title: "Authenticity", desc: "True to our roots and your unique style." },
              { icon: <Award size={24} />, title: "Premium Quality", desc: "Rigorous testing for every botanical drop." },
              { icon: <Target size={24} />, title: "Creativity", desc: "Exclusive designs crafted in-house." },
              { icon: <Award size={24} />, title: "Service", desc: "Your experience is our masterpiece." },
            ].map((v, i) => (
              <div key={i} className="group space-y-6">
                <div className="text-black flex justify-center group-hover:text-amber-800 transition-colors duration-500">
                  {v.icon}
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-black uppercase text-[11px] tracking-[0.3em]">{v.title}</h4>
                  <div className="w-8 h-[1px] bg-neutral-200 mx-auto group-hover:w-16 group-hover:bg-amber-800 transition-all duration-500"></div>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* --- RECOGNITION / CTA --- */}
        <section className="py-20 border-t border-neutral-100 max-w-4xl mx-auto px-6 text-center">
          <p className="text-black font-display text-2xl md:text-3xl italic leading-snug">
            "Originality is not just a name—it's a lifestyle."
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default About;