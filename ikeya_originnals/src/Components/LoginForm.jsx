import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { Mail, Lock, LogIn } from "lucide-react";

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pass mergeGuestCart function to login
      const result = await login(formData.email, formData.password, mergeGuestCart);
      
      if (result.success) {
        // Check if there was a redirect from cart
        const from = location.state?.from || "/";
        navigate(from);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-10 border border-neutral-100">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tighter mb-2">
          Welcome Back
        </h2>
        <p className="text-neutral-500 text-sm">
          Login to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-neutral-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-amber-900 focus:outline-none text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-neutral-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-amber-900 focus:outline-none text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-amber-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn size={14} />
              Login
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 text-center text-sm text-neutral-500">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-amber-900 font-bold hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
