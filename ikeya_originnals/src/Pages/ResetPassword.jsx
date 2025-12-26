import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

import { toast } from "react-hot-toast";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.password, formData.confirmPassword);
      toast.success("Password updated! Please sign in.");
      navigate("/auth"); // Redirect to login
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 flex items-center justify-center bg-neutral-50 px-6">
        <div className="max-w-md w-full bg-white p-12 shadow-sm border border-neutral-100">
          <h1 className="text-3xl font-display font-bold uppercase tracking-tighter mb-2">New Password</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-10">Define your new access credentials</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* New Password */}
            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em]">New Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" size={16} strokeWidth={1.5} />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  className="w-full border-b border-neutral-200 py-3 pl-8 pr-10 focus:border-black outline-none transition text-sm"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em]">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" size={16} strokeWidth={1.5} />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  className="w-full border-b border-neutral-200 py-3 pl-8 pr-10 focus:border-black outline-none transition text-sm"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-300">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all flex items-center justify-center gap-3 disabled:bg-neutral-200"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>Reset Password <ArrowRight size={14} /></>}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;