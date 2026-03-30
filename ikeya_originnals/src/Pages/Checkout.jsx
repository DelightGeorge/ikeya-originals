import { useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import {
  ArrowRight, Loader2, MapPin, ShieldCheck, ChevronDown,
  User, Phone, Mail, Home, Building2, FileText, Truck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { initializePayment } from "../services/paymentService";
import { DELIVERY_ZONES } from "../data/deliveryZones";

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Receives kobo, displays naira. e.g. 150000 → ₦1,500
const formatMoney = (kobo) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format((kobo || 0) / 100);

// ─── Reusable field components ───────────────────────────────────────────────

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400">
      {label} {required && <span className="text-amber-900">*</span>}
    </label>
    {children}
    {hint && <p className="text-[9px] text-neutral-300 mt-0.5">{hint}</p>}
  </div>
);

const inputClass =
  "w-full bg-transparent border-b border-neutral-200 focus:border-black outline-none text-[13px] py-2.5 transition-colors placeholder-neutral-300";

const SelectInput = ({ value, onChange, children, icon: Icon }) => (
  <div className="relative">
    {Icon && (
      <Icon size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
    )}
    <select
      value={value}
      onChange={onChange}
      className={`${inputClass} appearance-none pr-6 ${Icon ? "pl-5" : ""} cursor-pointer`}
    >
      {children}
    </select>
    <ChevronDown
      size={11}
      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
    />
  </div>
);

// ─── Checkout ─────────────────────────────────────────────────────────────────

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartData = location.state;

  // subtotal comes from CartContext.cartTotal — already in kobo
  // e.g. a ₦5,000 product has price: 500000 in the DB
  const subtotal = cartData?.subtotal || 0;

  const [loading, setLoading] = useState(false);

  // ── Form state ──
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    companyName: "",
    streetAddress: "",
    landmark: "",
    deliveryNote: "",
    state: "",
    areaIndex: "",
  });

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Delivery zone logic ──
  const availableAreas = useMemo(() => {
    if (!form.state) return [];
    return DELIVERY_ZONES.find((z) => z.state === form.state)?.areas || [];
  }, [form.state]);

  const selectedArea = useMemo(() => {
    if (form.areaIndex === "" || !availableAreas.length) return null;
    return availableAreas[Number(form.areaIndex)] || null;
  }, [availableAreas, form.areaIndex]);

  // deliveryZones prices are already in kobo — no * 100 conversion needed.
  // e.g. { name: "Lekki Phase 1", price: 180000 } → ₦1,800
  const deliveryFee = selectedArea?.price ?? null;

  // Both subtotal and deliveryFee are in kobo — safe to add directly
  const total = subtotal + (deliveryFee ?? 0);

  const handleStateChange = (e) => {
    setForm((prev) => ({ ...prev, state: e.target.value, areaIndex: "" }));
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.state) {
      toast.error("Please select your state.");
      return;
    }
    if (form.areaIndex === "") {
      toast.error("Please select your delivery area.");
      return;
    }

    setLoading(true);

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const fullAddress = [
      form.streetAddress.trim(),
      form.landmark ? `Near ${form.landmark.trim()}` : null,
      selectedArea?.name,
      form.state,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      // Everything stored in kobo for consistency across the app
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          address:        fullAddress,
          phone:          form.phone.trim(),
          alternatePhone: form.alternatePhone.trim(),
          email:          form.email.trim(),
          name:           fullName,
          companyName:    form.companyName.trim(),
          deliveryNote:   form.deliveryNote.trim(),
          deliveryArea:   selectedArea?.name,
          deliveryState:  form.state,
          deliveryFee,   // kobo — e.g. 180000 = ₦1,800
          items:          cartData.items,
          subtotal,      // kobo
        })
      );

      // total is in kobo — paymentService divides by 100 before sending to backend,
      // backend multiplies by 100 once for Paystack. Net: correct kobo charge.
      const data = await initializePayment(total);

      if (!data?.data?.authorization_url) {
        throw new Error("Could not get payment URL from Paystack");
      }

      window.location.href = data.data.authorization_url;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Checkout failed");
      setLoading(false);
    }
  };

  if (!cartData || !cartData.items?.length) return <Navigate to="/shop" replace />;

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black uppercase tracking-tighter">
              Checkout
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2">
              Ikeyá Naturals & Fashion
            </p>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

              {/* ── LEFT: Form ── */}
              <div className="space-y-10">

                {/* Personal Information */}
                <div className="bg-white border border-neutral-100 p-8">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400 mb-7 pb-4 border-b border-neutral-100 flex items-center gap-2">
                    <User size={11} /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="First Name" required>
                      <input
                        required
                        className={inputClass}
                        placeholder="Adaeze"
                        value={form.firstName}
                        onChange={set("firstName")}
                      />
                    </Field>
                    <Field label="Last Name" required>
                      <input
                        required
                        className={inputClass}
                        placeholder="Okonkwo"
                        value={form.lastName}
                        onChange={set("lastName")}
                      />
                    </Field>
                    <Field label="Email Address" required hint="Receipt will be sent here">
                      <div className="relative">
                        <Mail size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                        <input
                          required
                          type="email"
                          className={`${inputClass} pl-5`}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={set("email")}
                        />
                      </div>
                    </Field>
                    <Field label="Phone Number" required hint="Primary contact for delivery">
                      <div className="relative">
                        <Phone size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                        <input
                          required
                          type="tel"
                          className={`${inputClass} pl-5`}
                          placeholder="08012345678"
                          value={form.phone}
                          onChange={set("phone")}
                        />
                      </div>
                    </Field>
                    <Field label="Alternate Phone" hint="Optional backup number">
                      <div className="relative">
                        <Phone size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                        <input
                          type="tel"
                          className={`${inputClass} pl-5`}
                          placeholder="07012345678"
                          value={form.alternatePhone}
                          onChange={set("alternatePhone")}
                        />
                      </div>
                    </Field>
                    <Field label="Company / Business Name" hint="Optional — if delivering to a business">
                      <div className="relative">
                        <Building2 size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                        <input
                          type="text"
                          className={`${inputClass} pl-5`}
                          placeholder="Acme Ltd."
                          value={form.companyName}
                          onChange={set("companyName")}
                        />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="bg-white border border-neutral-100 p-8">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400 mb-7 pb-4 border-b border-neutral-100 flex items-center gap-2">
                    <Truck size={11} /> Delivery Location
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <Field label="State" required>
                      <SelectInput value={form.state} onChange={handleStateChange} icon={MapPin}>
                        <option value="">Select state…</option>
                        {DELIVERY_ZONES.map((z) => (
                          <option key={z.state} value={z.state}>
                            {z.state}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="Delivery Area" required>
                      <SelectInput
                        value={form.areaIndex}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, areaIndex: e.target.value }))
                        }
                      >
                        <option value="">
                          {form.state ? "Select area…" : "— pick state first —"}
                        </option>
                        {availableAreas.map((area, i) => (
                          <option key={i} value={i}>
                            {area.name}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                  </div>

                  {/* Live delivery fee callout */}
                  {deliveryFee !== null && (
                    <div className="mb-6 flex items-center justify-between bg-amber-50 border border-amber-100 px-5 py-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-amber-900 mb-0.5">
                          Delivery Fee
                        </p>
                        <p className="text-[10px] text-amber-700">
                          {selectedArea?.name}, {form.state}
                        </p>
                      </div>
                      <p className="text-xl font-display font-bold text-amber-900">
                        {formatMoney(deliveryFee)}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <Field label="Street Address" required>
                      <div className="relative">
                        <Home size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                        <input
                          required
                          className={`${inputClass} pl-5`}
                          placeholder="House No., Street Name"
                          value={form.streetAddress}
                          onChange={set("streetAddress")}
                        />
                      </div>
                    </Field>
                    <Field label="Nearest Landmark" hint="Helps rider find you faster">
                      <input
                        className={inputClass}
                        placeholder="e.g. Opposite First Bank, near the roundabout"
                        value={form.landmark}
                        onChange={set("landmark")}
                      />
                    </Field>
                    <Field label="Delivery Note" hint="Any special instructions for the rider?">
                      <div className="relative">
                        <FileText size={12} className="absolute left-0 top-3 text-neutral-300" strokeWidth={1.5} />
                        <textarea
                          rows={2}
                          className={`${inputClass} pl-5 resize-none`}
                          placeholder="e.g. Call when you arrive, gate code is 1234"
                          value={form.deliveryNote}
                          onChange={set("deliveryNote")}
                        />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Security badge */}
                <div className="p-6 bg-white border border-neutral-100 flex gap-4 items-start">
                  <ShieldCheck className="text-amber-900 flex-shrink-0 mt-0.5" size={20} strokeWidth={1} />
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed font-bold">
                    Payment is processed securely via Paystack. We never store your card details.
                  </p>
                </div>
              </div>

              {/* ── RIGHT: Order Summary ── */}
              <div>
                <div className="bg-white border border-neutral-100 p-8 sticky top-32 shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900 mb-8">
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-4 mb-8 pb-6 border-b border-neutral-100">
                    {cartData.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.product?.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover border border-neutral-100 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-tight truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-[9px] text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                        {/* item.product.price is in kobo — formatMoney handles display */}
                        <p className="text-[10px] font-bold flex-shrink-0">
                          {formatMoney((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 text-[10px] uppercase tracking-widest font-bold">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Delivery</span>
                      <span>
                        {deliveryFee !== null ? (
                          <span className="text-amber-900">{formatMoney(deliveryFee)}</span>
                        ) : (
                          <span className="text-neutral-300 normal-case font-normal italic">
                            Select area
                          </span>
                        )}
                      </span>
                    </div>
                    {deliveryFee !== null && (
                      <div className="flex justify-between pt-4 border-t border-neutral-100 text-base text-black">
                        <span>Total</span>
                        <span>{formatMoney(total)}</span>
                      </div>
                    )}
                  </div>

                  {/* Pay button */}
                  <button
                    form="checkout-form"
                    type="submit"
                    disabled={loading || deliveryFee === null}
                    className="w-full mt-8 bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Redirecting to Payment…
                      </>
                    ) : (
                      <>
                        {deliveryFee !== null
                          ? `Pay ${formatMoney(total)}`
                          : "Select delivery area"}
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-center text-neutral-300 uppercase tracking-widest mt-4 font-bold">
                    Secured by Paystack
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;