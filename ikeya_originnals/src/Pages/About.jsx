import Layout from "../Shared/Layout/Layout";
import { Target, Eye, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="pt-32 pb-20">
        {/* --- STORY SECTION --- */}
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-rosegold uppercase tracking-[0.3em] text-xs font-bold">Our Story</span>
              <h1 className="text-5xl font-display text-plum mt-4 mb-6">
                Where Fashion Meets <span className="italic">Authenticity</span>.
              </h1>
              <p className="text-plum/70 text-lg leading-relaxed mb-6">
                Based in the heart of Ketu, Lagos, Ikeyà Originals was born from a simple yet powerful vision: to provide a home for the modern individual who refuses to compromise on quality or cultural identity.
              </p>
              <p className="text-plum/70 text-lg leading-relaxed">
                We bridge the gap between contemporary fashion design and premium natural hair care. Every stitch in our garments and every drop in our oils is crafted with a customer-first mindset, ensuring that "originality" isn't just a name—it's a lifestyle.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" 
                alt="Ikeyà Studio" 
                className="w-full h-[500px] object-cover rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-rosegold text-cream p-8 hidden md:block">
                <p className="text-3xl font-display">Est. 2024</p>
                <p className="text-xs uppercase tracking-widest">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MISSION & VISION --- */}
        <section className="bg-plum py-24 px-6 text-cream">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="flex gap-6">
              <div className="bg-rosegold/20 p-4 h-fit rounded-full">
                <Target className="text-rosegold" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-display mb-4 italic">Our Mission</h2>
                <p className="text-cream/70 leading-relaxed">
                  To deliver exclusive fashion collections and premium hair care solutions that empower our clients to express their authentic selves with confidence and elegance.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-rosegold/20 p-4 h-fit rounded-full">
                <Eye className="text-rosegold" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-display mb-4 italic">Our Vision</h2>
                <p className="text-cream/70 leading-relaxed">
                  To become Nigeria's leading lifestyle brand where creativity, beauty-driven innovation, and African heritage converge for the future-focused individual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CORE VALUES --- */}
        <section className="py-24 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-display text-plum mb-16">The Ikeyà Pillars</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Heart />, title: "Authenticity", desc: "True to our roots and your style." },
              { icon: <Award />, title: "Premium Quality", desc: "Rigorous testing for every product." },
              { icon: <Target />, title: "Creativity", desc: "Exclusive designs you won't find elsewhere." },
              { icon: <Award />, title: "Service", desc: "Your satisfaction is our primary focus." },
            ].map((v, i) => (
              <div key={i} className="space-y-4">
                <div className="text-rosegold flex justify-center">{v.icon}</div>
                <h4 className="font-bold text-plum uppercase text-xs tracking-widest">{v.title}</h4>
                <p className="text-plum/60 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;