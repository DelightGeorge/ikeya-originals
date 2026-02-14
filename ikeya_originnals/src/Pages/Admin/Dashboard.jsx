import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Shared/Layout/Layout";
import {
  Plus, Package, Users, ShoppingCart, TrendingUp,
  LayoutDashboard, Loader2, Trash2, ChevronDown,
  CheckCircle2, Clock, Truck, XCircle, RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import { deleteProduct as deleteProductService } from "../../services/productService";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatPrice = (kobo) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format((kobo || 0) / 100);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
  });

// ─── Order Status Config ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    icon: RefreshCw,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-violet-600 bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600 bg-green-50 border-green-200",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-500 bg-red-50 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const STATUS_FLOW = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-none ${cfg.color}`}>
      <Icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
};

// ─── StatusDropdown ───────────────────────────────────────────────────────────

const StatusDropdown = ({ orderId, current, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (newStatus) => {
    if (newStatus === current) { setOpen(false); return; }
    setUpdating(true);
    setOpen(false);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      onUpdate(orderId, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={updating}
        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors border border-neutral-200 px-2.5 py-1.5 hover:border-black"
      >
        {updating ? <Loader2 size={10} className="animate-spin" /> : <ChevronDown size={10} />}
        Change
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 shadow-lg z-50 min-w-[140px]">
          {STATUS_FLOW.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors ${
                  s === current ? "text-amber-900 bg-amber-50/50" : "text-neutral-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── OrderRow ─────────────────────────────────────────────────────────────────

const OrderRow = ({ order, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black">
            #IKY-{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-[9px] text-neutral-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </td>
        <td className="px-4 py-4">
          <p className="text-[10px] font-bold text-black uppercase tracking-tight">
            {order.user?.name || "—"}
          </p>
          <p className="text-[9px] text-neutral-400">{order.phone}</p>
        </td>
        <td className="px-4 py-4">
          <p className="text-[10px] text-neutral-600 max-w-[160px] truncate">{order.address}</p>
        </td>
        <td className="px-4 py-4">
          <p className="text-[10px] font-bold text-black">{formatPrice(order.totalAmount)}</p>
        </td>
        <td className="px-4 py-4">
          {order.paystackReference ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-600">
              <CheckCircle2 size={10} /> Paid
            </span>
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              Unpaid
            </span>
          )}
        </td>
        <td className="px-4 py-4">
          <StatusBadge status={order.status} />
        </td>
        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
          <StatusDropdown orderId={order.id} current={order.status} onUpdate={onUpdate} />
        </td>
      </tr>

      {/* Expanded items row */}
      {expanded && (
        <tr className="bg-neutral-50 border-b border-neutral-100">
          <td colSpan={7} className="px-8 py-4">
            <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 mb-3">
              Order Items
            </p>
            <div className="flex flex-wrap gap-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white border border-neutral-100 px-3 py-2">
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover bg-neutral-100"
                    />
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight">
                      {item.product?.name}
                    </p>
                    <p className="text-[9px] text-neutral-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {order.paystackReference && (
              <p className="text-[9px] text-neutral-400 mt-3">
                Paystack Ref: <span className="font-mono text-neutral-600">{order.paystackReference}</span>
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, paid: 0 });
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // ── Fetch products ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/recentProducts");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRecentProducts(data);
        setStats((prev) => ({ ...prev, products: data.length }));
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Fetch orders ──
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get("/orders/all");
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
      setStats((prev) => ({
        ...prev,
        orders: data.length,
        revenue: data.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        paid: data.filter((o) => o.paystackReference).length,
      }));
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Handle status update from child ──
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // ── Delete product with improved error handling ──
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setDeletingProductId(id);
    setDeleteError(null);

    try {
      // Use the service function
      await deleteProductService(id);
      
      // Update local state
      const updated = recentProducts.filter((p) => p.id !== id);
      setRecentProducts(updated);
      setStats((prev) => ({ ...prev, products: updated.length }));
      
      console.log("Product deleted successfully");
    } catch (err) {
      console.error("Delete product error:", err);
      
      // Extract error message
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Failed to delete product. Please try again.";
      
      setDeleteError(errorMessage);
      
      // Show error to user
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-display uppercase tracking-tighter text-black font-bold">
                Admin <span className="text-amber-900 italic">Console</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2">
                Managing Ikeyá Naturals & Fashion
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-amber-900 transition-all duration-500"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Error Alert */}
          {deleteError && (
            <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded flex items-start gap-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900 mb-1">Delete Failed</p>
                <p className="text-xs text-red-700">{deleteError}</p>
              </div>
              <button
                onClick={() => setDeleteError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Revenue", value: formatPrice(stats.revenue), icon: TrendingUp },
              { label: "Products", value: stats.products, icon: Package },
              { label: "Total Orders", value: stats.orders, icon: ShoppingCart },
              { label: "Paid Orders", value: stats.paid, icon: CheckCircle2 },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 border border-neutral-100 shadow-sm flex flex-col justify-between h-36 transition-transform hover:scale-[1.02]"
              >
                <stat.icon size={18} className="text-amber-900" strokeWidth={1.5} />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-display font-bold text-black">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tab Nav ── */}
          <div className="flex gap-0 mb-8 border-b border-neutral-200">
            {[
              { key: "orders", label: "Live Orders", icon: ShoppingCart },
              { key: "products", label: "Products", icon: Package },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-amber-900 text-amber-900"
                    : "border-transparent text-neutral-400 hover:text-black"
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
                {tab.key === "orders" && orders.length > 0 && (
                  <span className="bg-amber-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
            {activeTab === "orders" && (
              <button
                onClick={fetchOrders}
                className="ml-auto flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black px-4 transition-colors"
              >
                <RefreshCw size={10} /> Refresh
              </button>
            )}
          </div>

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
              {loadingOrders ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 className="animate-spin text-amber-900" size={24} />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24">
                  <ShoppingCart size={32} className="mx-auto text-neutral-200 mb-4" strokeWidth={1} />
                  <p className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50">
                        {["Order", "Customer", "Address", "Amount", "Payment", "Status", "Action"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          onUpdate={handleStatusUpdate}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Products Tab ── */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-neutral-100 p-8 min-h-[400px]">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                  <LayoutDashboard size={14} /> Recent Products
                </h3>
                {loadingProducts ? (
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
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=?"; }}
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
                              {formatPrice(product.price)}
                            </p>
                            <p className="text-[9px] text-green-600 uppercase font-bold tracking-tighter">
                              In Stock
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingProductId === product.id}
                            className="text-neutral-300 hover:text-red-600 transition-all p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Delete product"
                          >
                            {deletingProductId === product.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
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

              {/* Inventory Alerts */}
              <div className="bg-black text-white p-8 flex flex-col">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-8 text-amber-500">
                  Inventory Alerts
                </h3>
                <div className="space-y-6 flex-grow">
                  {recentProducts.length === 0 ? (
                    <p className="text-xs font-light leading-relaxed text-neutral-400">
                      Your digital gallery is currently empty. Start by adding products.
                    </p>
                  ) : (
                    <div className="p-4 border border-neutral-800 bg-neutral-900/50">
                      <p className="text-[10px] uppercase text-amber-500 font-bold mb-1">
                        Status Report
                      </p>
                      <p className="text-xs text-neutral-300 font-light">
                        All systems operational. {recentProducts.length} items live in the shop.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-8 border-t border-neutral-800">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                    Ikeyá Admin v1.0.5
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
