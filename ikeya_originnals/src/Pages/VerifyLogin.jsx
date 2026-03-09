import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api";

const VerifyLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        // 1. Store the token immediately so the profile request can use it
        localStorage.setItem("token", token);

        // 2. Fetch the full user profile to get the role
        const response = await api.get("/users/profile");
        const user = response.data;
        
        // 3. Store user data
        localStorage.setItem("user", JSON.stringify(user));
        
        // Trigger a storage event so the Navbar/Layout updates immediately
        window.dispatchEvent(new Event("storage"));

        setStatus("success");

        // 4. Role-based Redirection
        setTimeout(() => {
          if (user.role === "ADMIN") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop");
          }
        }, 2000);
      } catch (err) {
        console.error("Verification failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full text-center">
        {/* --- LOADING STATE --- */}
        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto animate-spin text-amber-900" size={40} />
            <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-black">
              Authenticating Credentials
            </h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
              Securing your session with Ikeyà...
            </p>
          </div>
        )}

        {/* --- SUCCESS STATE --- */}
        {status === "success" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-700">
            <CheckCircle2 className="mx-auto text-green-600" size={40} strokeWidth={1.5} />
            <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-black">
              Access Granted
            </h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
              Identity verified. Preparing your dashboard...
            </p>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {status === "error" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <XCircle className="mx-auto text-red-500" size={40} strokeWidth={1.5} />
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-black mb-2">
                Verification Failed
              </h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
                This link is invalid or has expired for security reasons.
              </p>
            </div>
            
            <button 
              onClick={() => navigate("/login")}
              className="mt-4 px-8 py-3 bg-black text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-amber-900 transition-all duration-300"
            >
              Request New Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyLogin;