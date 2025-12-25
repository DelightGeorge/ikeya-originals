import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import Layout from "../Shared/Layout/Layout";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { login, register } from "../services/authService";
import { toast } from "react-hot-toast"; // Professional notifications

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // --- REDIRECT LOGIC ---
  // If the user was redirected here from a protected route, 
  // location.state.from will contain that path. Otherwise, go to /shop.
  const from = location.state?.from?.pathname || "/shop";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login({ email: formData.email, password: formData.password });
        
        if (response?.requiresVerification) {
          setEmailSent(true);
        } else {
          // Store user/token logic usually happens inside authService.login, 
          // but if it doesn't, ensure it's here before navigating.
          toast.success("Welcome back to the House.");
          navigate(from, { replace: true }); // Send them back to their intended page
        }
      } else {
        await register(formData);
        toast.success("Account created successfully.");
        setEmailSent(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-neutral-50 selection:bg-amber-900 selection:text-white">
        <div className="max-w-5xl w-full bg-white flex flex-col md:flex-row shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden min-h-[650px]">
          
          {/* --- LEFT SIDE: BRAND IMAGE --- */}
          <div className="md:w-1/2 relative hidden md:block overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110 grayscale-[20%]"
              alt="Ikeyà Fashion"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col justify-end p-12 text-white">
              <span className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Membership</span>
              <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-6 leading-none">
                {isLogin ? "Welcome Back to \nOriginality." : "Start Your \nStyle Journey."}
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-sm">
                Join the Ikeyà Style Club for exclusive drops, organic hair care secrets, and early access to our seasonal collections.
              </p>
              <div className="mt-8 w-12 h-[1px] bg-amber-600"></div>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
            
            {emailSent ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-neutral-50 flex items-center justify-center">
                    <Mail className="text-amber-900" size={32} strokeWidth={1} />
                  </div>
                </div>
                
                <h1 className="text-4xl font-display text-black font-bold uppercase tracking-tighter mb-4">
                  Check Your <span className="text-amber-900 italic">Inbox</span>
                </h1>
                
                <p className="text-xs text-neutral-500 leading-relaxed font-light mb-8 uppercase tracking-widest">
                  We have sent a secure link to <span className="text-black font-bold">{formData.email}</span>.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    <CheckCircle2 size={14} className="text-amber-900" />
                    Link expires in 24 hours
                  </div>
                  
                  <button 
                    onClick={() => {
                      setEmailSent(false);
                      setIsLogin(true);
                      setError("");
                    }}
                    className="mt-8 group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-1 hover:text-amber-900 hover:border-amber-900 transition-all"
                  >
                    Return to Sign In <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h1 className="text-4xl font-display text-black font-bold uppercase tracking-tighter mb-3">
                    {isLogin ? "Sign In" : "Register"}
                  </h1>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                    {isLogin ? "Access your digital wardrobe" : "Join the house of Ikeyà"}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-neutral-50 text-red-600 text-[10px] uppercase tracking-[0.2em] font-bold border-l border-red-600">
                    {error}
                  </div>
                )}

                <form className="space-y-7" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="space-y-1 group">
                      <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-amber-900 transition-colors" size={16} strokeWidth={1.5} />
                        <input 
                          name="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                          placeholder="Your Name" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 group">
                    <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-amber-900 transition-colors" size={16} strokeWidth={1.5} />
                      <input 
                        name="email"
                        type="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                        placeholder="email@houseofikeya.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1 group">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-black tracking-[0.2em]">Password</label>
                      {isLogin && (
                        <button type="button" className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest hover:text-black transition-colors">Forgot?</button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-amber-900 transition-colors" size={16} strokeWidth={1.5} />
                      <input 
                        name="password"
                        type="password" 
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border-b border-neutral-200 py-3 pl-8 focus:border-black outline-none transition bg-transparent text-sm font-light" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 group mt-10 disabled:bg-neutral-200 disabled:text-neutral-400"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"} 
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-10 pt-10 border-t border-neutral-50 text-center">
                  <p className="text-[10px] text-neutral-400 tracking-widest font-bold uppercase">
                    {isLogin ? "New to the brand?" : "Already a member?"}
                    <button 
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                      }}
                      className="ml-2 text-black border-b border-black hover:text-amber-900 hover:border-amber-900 transition-colors"
                    >
                      {isLogin ? "Register" : "Login"}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;