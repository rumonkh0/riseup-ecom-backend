"use client";

import { useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import {
  X,
  ArrowLeft,
  Truck,
  Banknote,
  CheckCircle,
  Loader2,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { CartItem } from "./CartDrawer";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 80;

export default function CheckoutDrawer({
  isOpen,
  onClose,
  onBackToCart,
  items,
  onOrderSuccess,
}: CheckoutDrawerProps) {
  const { t, formatNumber } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = t.checkout.errName;
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, "").length < 10)
      errs.mobile = t.checkout.errMobile;
    if (!formData.address.trim()) errs.address = t.checkout.errAddress;
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save order to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const orderPayload = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email || undefined,
        address: formData.address,
        notes: formData.notes || undefined,
        items: items.map((i) => ({
          name: i.name,
          variant: i.variantName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shipping,
        total,
      };

      const res = await fetch(`${apiUrl}/guest-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      setOrderId(data.data?.id?.slice(0, 8)?.toUpperCase() || "N/A");

      // 2. Send email notification via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const itemsText = items
          .map((i) => `${i.name} (${i.variantName}) x${i.quantity} = ৳${i.price * i.quantity}`)
          .join("\n");

        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email || "N/A",
            from_mobile: formData.mobile,
            subject: `🛒 New Order — ৳${total} (${items.length} items)`,
            message: `📦 NEW ORDER\n\nCustomer: ${formData.name}\nMobile: ${formData.mobile}\nEmail: ${formData.email || "N/A"}\nAddress: ${formData.address}\nNotes: ${formData.notes || "None"}\n\n--- Items ---\n${itemsText}\n\nSubtotal: ৳${subtotal}\nShipping: ৳${shipping}\nTotal: ৳${total}`,
          },
          publicKey
        );
      }

      setOrderPlaced(true);
    } catch (err) {
      console.error("Checkout error:", err);
      // Still show success if order was saved but email failed
      if (orderId) {
        setOrderPlaced(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setOrderPlaced(false);
    setFormData({ name: "", mobile: "", email: "", address: "", notes: "" });
    setErrors({});
    setOrderId("");
    onOrderSuccess();
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-cream/30 border text-sm font-medium text-navy focus:outline-none transition-all placeholder:text-navy-light/30 ${
      errors[field]
        ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/10"
        : "border-warm-200/50 focus:border-warm-500 focus:ring-4 focus:ring-warm-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm z-[60] transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCart}
              className="p-1.5 rounded-full hover:bg-warm-100 transition-colors text-navy-light/50 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy">
              {t.checkout.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-100 transition-colors text-navy-light/50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {orderPlaced ? (
          /* ─── Success State ─── */
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-bounce-gentle">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold font-[var(--font-heading)] text-navy">
              {t.checkout.successTitle}
            </h3>
            <p className="text-sm text-navy-light/60 leading-relaxed max-w-xs">
              {t.checkout.successDesc
                .replace("{name}", formData.name)
                .replace("{mobile}", formData.mobile)}
            </p>
            {orderId && (
              <div className="bg-warm-100/50 px-4 py-2 rounded-xl">
                <span className="text-xs text-navy-light/50">{t.checkout.successOrderId}: </span>
                <span className="text-sm font-bold text-navy font-mono">{orderId}</span>
              </div>
            )}
            <button
              onClick={handleSuccessClose}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {t.checkout.successBackHome}
            </button>
          </div>
        ) : (
          /* ─── Checkout Form ─── */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
              {/* ── Order Summary ── */}
              <div className="bg-soft-gray rounded-2xl p-4 border border-warm-100/30">
                <h4 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-warm-500" />
                  {t.checkout.orderSummary}
                  <span className="text-xs font-medium text-navy-light/40 ml-auto">
                    {t.checkout.itemCount.replace("{count}", String(items.reduce((s, i) => s + i.quantity, 0)))}
                  </span>
                </h4>
                <div className="space-y-2.5 max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-warm-100/50 overflow-hidden flex-shrink-0 relative">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" sizes="40px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-navy truncate">{item.name}</p>
                        <p className="text-[10px] text-navy-light/40">{item.variantName} × {formatNumber(item.quantity)}</p>
                      </div>
                      <p className="text-xs font-bold text-navy">৳{formatNumber((item.price * item.quantity).toFixed(0))}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Customer Information ── */}
              <div>
                <h4 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                  <User size={14} className="text-warm-500" />
                  {t.checkout.customerInfo}
                </h4>
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-name" className="text-xs font-semibold text-navy-light flex items-center gap-1.5">
                      <User size={12} /> {t.checkout.name}
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.checkout.namePlaceholder}
                      className={inputClass("name")}
                    />
                    {errors.name && <p className="text-[11px] font-semibold text-rose">{errors.name}</p>}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-mobile" className="text-xs font-semibold text-navy-light flex items-center gap-1.5">
                      <Phone size={12} /> {t.checkout.mobile}
                    </label>
                    <input
                      id="checkout-mobile"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder={t.checkout.mobilePlaceholder}
                      className={inputClass("mobile")}
                    />
                    {errors.mobile && <p className="text-[11px] font-semibold text-rose">{errors.mobile}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-email" className="text-xs font-semibold text-navy-light flex items-center gap-1.5">
                      <Mail size={12} /> {t.checkout.email}
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.checkout.emailPlaceholder}
                      className={inputClass("email")}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-address" className="text-xs font-semibold text-navy-light flex items-center gap-1.5">
                      <MapPin size={12} /> {t.checkout.address}
                    </label>
                    <textarea
                      id="checkout-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t.checkout.addressPlaceholder}
                      rows={2}
                      className={`${inputClass("address")} resize-none`}
                    />
                    {errors.address && <p className="text-[11px] font-semibold text-rose">{errors.address}</p>}
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-notes" className="text-xs font-semibold text-navy-light flex items-center gap-1.5">
                      <FileText size={12} /> {t.checkout.notes}
                    </label>
                    <textarea
                      id="checkout-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder={t.checkout.notesPlaceholder}
                      rows={2}
                      className={`${inputClass("notes")} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* ── Payment Method ── */}
              <div>
                <h4 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                  <Banknote size={14} className="text-warm-500" />
                  {t.checkout.payment}
                </h4>
                <div className="bg-green-50 dark:bg-navy-dark border-2 border-green-400 dark:border-warm-200/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 dark:border-green-400 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{t.checkout.cod}</p>
                    <p className="text-[11px] text-navy-light/50">{t.checkout.codDesc}</p>
                  </div>
                  <Truck size={20} className="text-green-500 dark:text-green-400 ml-auto" />
                </div>
              </div>
            </div>

            {/* ── Footer: Price Summary + Confirm ── */}
            <div className="border-t border-warm-100 bg-white px-6 py-5 space-y-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] flex-shrink-0">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-navy-light/60">
                  <span>{t.checkout.subtotal}</span>
                  <span>৳{formatNumber(subtotal.toFixed(0))}</span>
                </div>
                <div className="flex justify-between text-sm text-navy-light/60">
                  <span>{t.checkout.shipping}</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? t.checkout.shippingFree : `৳${formatNumber(shipping)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-navy pt-1.5 border-t border-warm-100">
                  <span>{t.checkout.total}</span>
                  <span className="text-lg font-[var(--font-heading)]">৳{formatNumber(total.toFixed(0))}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-warm-500/25 hover:shadow-warm-500/40 transition-all duration-300 flex items-center justify-center gap-2 ${
                  submitting ? "opacity-75 cursor-not-allowed" : "cursor-pointer btn-shine"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t.checkout.confirming}
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {t.checkout.confirm} — ৳{formatNumber(total.toFixed(0))}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
