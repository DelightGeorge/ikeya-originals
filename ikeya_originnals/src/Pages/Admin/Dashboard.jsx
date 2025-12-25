import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Shared/Layout/Layout";
import {
  Plus,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: "₦0.00",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/recentProducts");
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setRecentProducts(fetchedProducts);
        setStats((prev) => ({
          ...prev,
          products: fetchedProducts.length,
        }));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        // Optimistic UI update
        const updatedProducts = recentProducts.filter((p) => p.id !== id);
        setRecentProducts(updatedProducts);
        setStats((prev) => ({ ...prev, products: updatedProducts.length }));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-display uppercase tracking-tighter text-black font-bold">
                Admin <span className="text-amber-900 italic">Console</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2">
                Managing Ikeyà Naturals & Fashion
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/add-product")}
              className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-amber-900 transition-all duration-500"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Revenue", value: stats.revenue, icon: TrendingUp },
              { label: "Products", value: stats.products, icon: Package },
              { label: "Orders", value: stats.orders, icon: ShoppingCart },
              { label: "Customers", value: stats.customers, icon: Users },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-8 border border-neutral-100 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]"
              >
                <stat.icon size={20} className="text-amber-900" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-display font-bold text-black">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-neutral-100 p-8 min-h-[400px]">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                <LayoutDashboard size={14} /> Recent Products
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-amber-900" size={24} />
                </div>
              ) : recentProducts.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-4 group hover:bg-neutral-50 px-2 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-14 h-14 object-cover border border-neutral-100 bg-neutral-50"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100?text=Product";
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-black uppercase tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                            {product.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-display font-bold text-black">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                          <p className="text-[9px] text-green-600 uppercase font-bold tracking-tighter">
                            In Stock
                          </p>
                        </div>
                        
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-neutral-300 hover:text-red-600 transition-all p-2"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-300 italic">
                    No products uploaded yet.
                  </p>
                </div>
              )}
            </div>

            {/* Side Alert Panel */}
            <div className="bg-black text-white p-8 flex flex-col">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-8 text-amber-500">
                Inventory Alerts
              </h3>
              <div className="space-y-6 flex-grow">
                {recentProducts.length === 0 ? (
                  <p className="text-xs font-light leading-relaxed text-neutral-400">
                    Your digital gallery is currently empty. Start by adding
                    products to see inventory analytics.
                  </p>
                ) : (
                  <div className="p-4 border border-neutral-800 bg-neutral-900/50">
                    <p className="text-[10px] uppercase text-amber-500 font-bold mb-1">
                      Status Report
                    </p>
                    <p className="text-xs text-neutral-300 font-light">
                      All systems operational. {recentProducts.length} items
                      currently live in the shop.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-800">
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                  Ikeyà Admin v1.0.4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;