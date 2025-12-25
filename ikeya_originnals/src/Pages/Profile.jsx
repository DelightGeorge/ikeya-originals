import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.email) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabs = [
    { id: "overview", label: "Account Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* LEFT SIDE: NAVIGATION */}
          <div className="w-full md:w-64 space-y-1">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-1">Welcome back,</p>
              <h2 className="text-2xl font-display uppercase font-bold tracking-tighter">{user.name || "Guest"}</h2>
            </div>
            
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id 
                  ? "bg-black text-white" 
                  : "bg-transparent text-black hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                  {tab.label}
                </div>
                <ChevronRight size={12} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>

          {/* RIGHT SIDE: CONTENT AREA */}
          <div className="flex-1 bg-white border border-neutral-100 p-8 min-h-[400px]">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-4 mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400">Full Name</label>
                      <p className="text-sm font-medium mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400">Email Address</label>
                      <p className="text-sm font-medium mt-1">{user.email}</p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="border border-neutral-100 p-6 flex items-start gap-4">
                        <MapPin size={18} className="text-amber-900" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Shipping Address</p>
                            <p className="text-xs text-neutral-500 leading-relaxed">No address saved yet. Update in settings.</p>
                        </div>
                    </div>
                    <div className="border border-neutral-100 p-6 flex items-start gap-4">
                        <CreditCard size={18} className="text-amber-900" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-xs text-neutral-500 leading-relaxed">Mastercard ending in **** 4242</p>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-4 mb-6">Recent Orders</h3>
                
                {/* Example Order Card */}
                <div className="border border-neutral-100 p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-amber-900 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-20 bg-neutral-100"></div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-900">Order #IK-9921</p>
                      <p className="text-xs font-bold mt-1">2 Items — ₦45,000</p>
                      <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">Delivered on Dec 12, 2024</p>
                    </div>
                  </div>
                  <button className="text-[9px] uppercase font-bold tracking-[0.2em] border border-black px-6 py-2 hover:bg-black hover:text-white transition-all w-full md:w-auto">
                    View Details
                  </button>
                </div>

                <div className="text-center py-12">
                   <p className="text-[10px] uppercase tracking-widest text-neutral-300 italic">End of order history</p>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-4 mb-6">Account Settings</h3>
                <form className="max-w-md space-y-4">
                    <div>
                        <label className="text-[9px] uppercase tracking-widest font-bold">Change Password</label>
                        <input type="password" placeholder="Current Password" className="w-full border-b border-neutral-200 py-2 text-sm outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                        <input type="password" placeholder="New Password" className="w-full border-b border-neutral-200 py-2 text-sm outline-none focus:border-black transition-colors" />
                    </div>
                    <button className="bg-black text-white text-[10px] uppercase font-bold tracking-widest py-4 px-10 mt-4 hover:bg-neutral-800 transition-all">
                        Update Security
                    </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;