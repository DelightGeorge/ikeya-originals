import { useState } from "react";
import Layout from "../Shared/Layout/Layout";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-neutral-50">
        <div className="max-w-5xl w-full bg-white flex flex-col md:flex-row shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden min-h-[650px]">
          
          {/* --- LEFT SIDE: BRAND PROMO (AMBER/BROWN OVERLAY) --- */}
          <div className="md:w-1/2 relative hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover grayscale-[20%]"
              alt="Ikeyà Fashion"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col justify-end p-12 text-white">
              <span className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Membership</span>
              <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-6">
                {isLogin ? "Welcome Back to Originality." : "Start Your Style Journey."}
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-sm">
                Join the Ikeyà Style Club for exclusive drops, organic hair care secrets, and early access to our seasonal collections.
              </p>
              <div className="mt-8 w-12 h-[1px] bg-amber-600"></div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE FORM (MINIMALIST WHITE) --- */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl font-display text-black font-bold uppercase tracking-tighter mb-3">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-neutral-400 text-xs uppercase tracking-widest font-medium">
                {isLogin ? "Access your digital wardrobe" : "Join the house of Ikeyà"}
              </p>
            </div>

            <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-900" size={16} strokeWidth={1.5} />
                    <input 
                      type="text" 
                      className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                      placeholder="Enter your name" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-900" size={16} strokeWidth={1.5} />
                  <input 
                    type="email" 
                    className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                    placeholder="name@email.com" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Password</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] text-amber-900 font-bold uppercase tracking-widest hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-900" size={16} strokeWidth={1.5} />
                  <input 
                    type="password" 
                    className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button className="w-full bg-black text-white py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 group mt-10">
                {isLogin ? "Sign In" : "Register Now"} 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-neutral-400 tracking-wide font-light">
                {isLogin ? "New to the brand?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-black font-bold uppercase tracking-tighter border-b border-black hover:text-amber-900 hover:border-amber-900 transition-colors"
                >
                  {isLogin ? "Create Account" : "Login"}
                </button>
              </p>
            </div>

            {/* --- DIVIDER --- */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] text-neutral-300">
                <span className="bg-white px-4">Social Access</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button className="flex items-center justify-center gap-3 border border-neutral-200 py-4 text-[10px] font-bold text-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all duration-300">
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