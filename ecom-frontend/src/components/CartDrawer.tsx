"use client";

import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const { language, t, formatNumber } = useLanguage();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm z-[60] transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-warm-500" />
            <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy">
              {t.cart.title}
            </h3>
            <span className="text-xs font-semibold bg-warm-100 text-warm-600 px-2.5 py-0.5 rounded-full">
              {formatNumber(totalItems)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-100 transition-colors text-navy-light/50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-6 py-4 bg-warm-100/40 border-b border-warm-100">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-warm-500 animate-bounce-gentle" />
            {amountToFreeShipping > 0 ? (
              <p className="text-xs text-navy-light/75">
                {language === "en" ? (
                  <>
                    Add{" "}
                    <span className="font-bold text-warm-600">
                      ৳{formatNumber(amountToFreeShipping.toFixed(0))}
                    </span>{" "}
                    more for <span className="font-semibold text-green-600">FREE shipping!</span>
                  </>
                ) : (
                  <>
                    ফ্রি ডেলিভারি পেতে আর মাত্র{" "}
                    <span className="font-bold text-warm-600">
                      ৳{formatNumber(amountToFreeShipping.toFixed(0))}
                    </span>{" "}
                    সমমূল্যের খেলনা <span className="font-semibold text-green-600">যোগ করুন!</span>
                  </>
                )}
              </p>
            ) : (
              <p className="text-xs font-semibold text-green-600">
                {language === "en"
                  ? "🎉 You've unlocked FREE shipping!"
                  : "🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি আনলক করেছেন!"}
              </p>
            )}
          </div>
          <div className="w-full h-2 bg-warm-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warm-400 to-warm-500 rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ maxHeight: "calc(100vh - 320px)" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-warm-300" />
              </div>
              <p className="text-navy-light/50 font-medium">{t.cart.empty}</p>
              <p className="text-sm text-navy-light/45 mt-1">
                {t.cart.emptyDesc}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-soft-gray rounded-2xl p-3 group border border-warm-100/30"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-warm-100/50 shadow-inner">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-navy truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-navy-light/50 mt-0.5">
                        {item.variantName}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 rounded-full hover:bg-warm-200/50 text-navy-light/30 hover:text-rose transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-white rounded-full border border-warm-200/50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-warm-100 transition-colors text-navy-light/50 cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-navy">
                        {formatNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-warm-100 transition-colors text-navy-light/50 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-navy">
                      ৳{formatNumber((item.price * item.quantity).toFixed(0))}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-warm-100 bg-white px-6 py-5 space-y-4 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-navy-light/60">{t.cart.subtotal}</span>
              <span className="text-xl font-bold text-navy font-[var(--font-heading)]">
                ৳{formatNumber(subtotal.toFixed(0))}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="btn-shine w-full py-4 bg-gradient-to-r from-navy to-navy-light text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base cursor-pointer"
              id="checkout-button"
            >
              {t.cart.checkout}
            </button>
            <p className="text-center text-[10px] text-navy-light/40">
              {language === "en" ? (
                <>🔒 Secure checkout · Free returns</>
              ) : (
                <>🔒 নিরাপদ চেকআউট · ফ্রী রিটার্ন সুবিধা</>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
