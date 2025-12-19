import { useState } from "react";
import Layout from "../Shared/Layout/Layout";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-beige/30">
        <div className="max-w-4xl w-full bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden min-h-[600px]">
          
          {/* --- LEFT SIDE: THE BRAND IMAGE/PROMO --- */}
          <div className="md:w-1/2 relative hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover"
              alt="Ikeyà Fashion"
            />
            <div className="absolute inset-0 bg-plum/60 backdrop-blur-[2px] flex flex-col justify-end p-12 text-cream">
              <h2 className="text-3xl font-display mb-4">
                {isLogin ? "Welcome Back to Originality." : "Start Your Style Journey."}
              </h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Join the Ikeyà Style Club for exclusive drops, hair care tips, and early access to our seasonal collections.
              </p>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE FORM --- */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-display text-plum mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-plum/50 text-sm">
                {isLogin ? "Enter your details to access your wardrobe." : "Fill in the details below to join us."}
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-rosegold" size={16} />
                    <input 
                      type="text" 
                      className="w-full border-b border-plum/10 py-3 pl-8 focus:border-rosegold outline-none transition bg-transparent" 
                      placeholder="Amina Tolu" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-rosegold" size={16} />
                  <input 
                    type="email" 
                    className="w-full border-b border-plum/10 py-3 pl-8 focus:border-rosegold outline-none transition bg-transparent" 
                    placeholder="hello@ikeya.com" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-plum/50 tracking-widest">Password</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] text-rosegold font-bold hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-rosegold" size={16} />
                  <input 
                    type="password" 
                    className="w-full border-b border-plum/10 py-3 pl-8 focus:border-rosegold outline-none transition bg-transparent" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button className="w-full bg-plum text-cream py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-rosegold transition-colors flex items-center justify-center gap-2 group mt-8">
                {isLogin ? "Login" : "Join the Club"} 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-plum/60">
                {isLogin ? "Don't have an account?" : "Already a member?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-rosegold font-bold hover:underline"
                >
                  {isLogin ? "Create One" : "Login Here"}
                </button>
              </p>
            </div>

            {/* --- OR DIVIDER --- */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-plum/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-plum/30">
                <span className="bg-white px-4 italic">Social Connect</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button className="flex items-center justify-center gap-3 border border-plum/10 py-3 text-xs font-bold text-plum hover:bg-beige transition">
                 <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
                 Continue with Google
               </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;