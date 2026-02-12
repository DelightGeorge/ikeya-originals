import { useLocation, Link, Navigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { CheckCircle2, Package, MapPin, ArrowRight, Download } from "lucide-react";

const formatMoney = (kobo) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format((kobo || 0) / 100);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// ─── Download receipt as a clean HTML file the browser can print/save as PDF ─

const downloadReceipt = (order) => {
  const deliveryFee = 250000;
  const subtotal = order.totalAmount - deliveryFee;
  const orderId = `#IKY-${order.id.slice(-8).toUpperCase()}`;

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; font-size:13px;">${item.product?.name || "—"}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; font-size:13px; text-align:center;">×${item.quantity}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; font-size:13px; text-align:right;">${formatMoney(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Ikeyà Receipt — ${orderId}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #111; background: #fff; padding: 60px 40px; max-width: 640px; margin: auto; }
    h1 { text-transform: uppercase; letter-spacing: 8px; font-size: 28px; text-align: center; margin-bottom: 6px; }
    .tagline { text-transform: uppercase; font-size: 9px; letter-spacing: 3px; color: #92400e; text-align: center; margin-bottom: 40px; }
    .order-id { font-size: 18px; font-weight: bold; letter-spacing: 2px; }
    .label { text-transform: uppercase; font-size: 9px; letter-spacing: 2px; color: #aaa; margin-bottom: 4px; margin-top: 20px; }
    hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; padding-bottom: 8px; text-align: left; }
    th:last-child { text-align: right; }
    th:nth-child(2) { text-align: center; }
    .total-row td { font-size: 15px; font-weight: bold; padding-top: 14px; border-top: 1px solid #eee; }
    .ref { font-size: 10px; color: #aaa; text-align: center; margin-top: 32px; font-family: monospace; }
    .footer { text-align: center; margin-top: 48px; font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: #ccc; }
  </style>
</head>
<body>
  <h1>Ikeyà</h1>
  <p class="tagline">Originality is the only luxury</p>

  <div class="label">Order ID</div>
  <div class="order-id">${orderId}</div>

  <div class="label">Date</div>
  <div style="font-size:13px;">${formatDate(order.createdAt)}</div>

  <hr />

  <div class="label">Items</div>
  <table>
    <thead>
      <tr>
        <th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
      <tr>
        <td style="padding:8px 0; font-size:12px; color:#888;" colspan="2">Subtotal</td>
        <td style="padding:8px 0; font-size:12px; color:#888; text-align:right;">${formatMoney(subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-size:12px; color:#888;" colspan="2">Delivery</td>
        <td style="padding:8px 0; font-size:12px; color:#888; text-align:right;">${formatMoney(deliveryFee)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="2">Total Paid</td>
        <td style="text-align:right;">${formatMoney(order.totalAmount)}</td>
      </tr>
    </tbody>
  </table>

  <hr />

  <div class="label">Shipping To</div>
  <div style="font-size:13px; line-height:1.8;">${order.address}</div>
  <div style="font-size:13px; color:#888; margin-top:4px;">${order.phone}</div>

  <p class="ref">Paystack Ref: ${order.paystackReference || "N/A"}</p>

  <div class="footer">© ${new Date().getFullYear()} Ikeyà Originals · Thank you for your order</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ikeya-receipt-${orderId}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Component ───────────────────────────────────────────────────────────────

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <Navigate to="/shop" replace />;

  const orderId = `#IKY-${order.id.slice(-8).toUpperCase()}`;
  const deliveryFee = 250000;
  const subtotal = order.totalAmount - deliveryFee;

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">

        {/* ── Success Header ── */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-600" strokeWidth={1} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-black mb-4 uppercase tracking-tighter">
            Order <span className="text-amber-900 italic">Confirmed</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
            A receipt has been sent to your email
          </p>
        </div>

        {/* ── Receipt Card ── */}
        <div className="border border-neutral-100 shadow-sm mb-10" id="receipt">

          {/* Receipt Header */}
          <div className="bg-neutral-50 border-b border-neutral-100 px-8 py-6 flex justify-between items-start">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-amber-900 font-bold mb-1">Order ID</p>
              <p className="text-lg font-bold tracking-widest">{orderId}</p>
              <p className="text-[10px] text-neutral-400 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <button
              onClick={() => downloadReceipt(order)}
              className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest border border-neutral-200 px-4 py-2.5 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <Download size={12} /> Download Receipt
            </button>
          </div>

          {/* Items */}
          <div className="px-8 py-6 border-b border-neutral-100">
            <div className="flex items-center gap-2 mb-5 text-amber-900">
              <Package size={14} strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Items Ordered</span>
            </div>
            <div className="space-y-4">
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover bg-neutral-100 border border-neutral-100"
                      />
                    )}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide">
                        {item.product?.name}
                      </p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-8 py-6 border-b border-neutral-100 space-y-3">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-400">
              <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-400">
              <span>Delivery</span><span>{formatMoney(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold uppercase tracking-widest pt-3 border-t border-neutral-100">
              <span>Total Paid</span><span>{formatMoney(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-4 text-amber-900">
              <MapPin size={14} strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Shipping To</span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{order.address}</p>
            <p className="text-xs text-neutral-400 mt-1">{order.phone}</p>
            {order.paystackReference && (
              <p className="text-[9px] text-neutral-300 mt-4 font-mono">
                Ref: {order.paystackReference}
              </p>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col items-center gap-5">
          <Link
            to="/shop"
            className="w-full md:w-auto bg-black text-white px-16 py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 group"
          >
            Continue Shopping
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/profile"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-amber-900 hover:border-amber-900 transition-colors"
          >
            Track Order in Profile
          </Link>
        </div>

      </div>
    </Layout>
  );
};

export default OrderSuccess;
