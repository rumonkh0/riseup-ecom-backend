"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Gift, Star, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ProductCard, { Product } from "@/components/ProductCard";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, t, formatNumber } = useLanguage();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    sweetheart: "sh-mint",
    cuddle: "cb-gold",
    pikachu: "pk-yellow",
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  /* ───────────────────────── Localized Product Database ───────────────────────── */
  const localizedProducts: Product[] = [
    {
      id: "sweetheart",
      name: language === "en" ? "Sweet Heart Teddy" : "সুইট হার্ট টেডি",
      tagline: language === "en" ? "Customer Favorite 🧸" : "জনপ্রিয় কাস্টমার ফেভারিট 🧸",
      description:
        language === "en"
          ? "Our flagship Sweet Heart Teddy Bear is the absolute standard in plush comfort. Designed with extra love, holding a beautifully soft plush heart, it is the perfect emotional messenger for anniversaries, birthdays, or just to say 'I care'."
          : "আমাদের ফ্ল্যাগশিপ সুইট হার্ট টেডি বেয়ার অত্যন্ত নরম ও আরামদায়ক। সুন্দর একটি প্লুশ হার্ট জড়িয়ে ধরা এই টেডিটি বিবাহবার্ষিকী, জন্মদিন বা যেকোনো বিশেষ মুহূর্তের শুভেচ্ছা জানাতে দারুণ উপযোগী উপহার।",
      price: 650,
      originalPrice: 799,
      rating: 4.9,
      reviewCount: 142,
      badge: language === "en" ? "Best Seller" : "সেরা বিক্রেতা",
      features:
        language === "en"
          ? ["Safety-Lock Plastic Eyes", "Ultra-Soft Cloud Fabric", "Premium Durability", "Customizable Greetings Ribbon"]
          : ["প্লাস্টিক সেফটি লক-আইস", "মেঘের মতো সফট ফেব্রিক", "দীর্ঘস্থায়ী ফিনিশিং", "কাস্টম শুভেচ্ছা রিবন"],
      variants: [
        {
          id: "sh-mint",
          name: language === "en" ? "Sweet Mint" : "মিষ্টি মিন্ট গ্রিন",
          color: "#A7F3D0",
          image: "/products/sweetheart-mint.png"
        },
        {
          id: "sh-red",
          name: language === "en" ? "Ruby Red" : "রুবি রেড",
          color: "#F43F5E",
          image: "/products/sweetheart-red.png"
        },
        {
          id: "sh-pink",
          name: language === "en" ? "Bubblegum Pink" : "বাবলগাম পিঙ্ক",
          color: "#F48FB1",
          image: "/products/sweetheart-pink.png"
        }
      ]
    },
    {
      id: "cuddle",
      name: language === "en" ? "Big Cuddle Bear" : "বিগ কাডল টেডি বেয়ার",
      tagline: language === "en" ? "Premium Collection ✨" : "প্রিমিয়াম কালেকশন ✨",
      description:
        language === "en"
          ? "Meet the Big Cuddle Bear — your new best friend for cozy nights and warm hugs. Extra-large, ultra-fluffy, and impossibly huggable. This oversized companion brings comfort and joy to every room."
          : "সুপার জায়ান্ট আর দারুণ কিউট বিগ কাডল টেডি বেয়ার—বিছানা বা সোফায় সাজিয়ে রাখতে কিংবা জাপটে ধরে ঘুমানোর জন্য পারফেক্ট বন্ধু। অতিরিক্ত তুলতুলে ও অত্যন্ত প্রিমিয়াম মানের স্টাফিংয়ে তৈরি।",
      price: 850,
      originalPrice: 1099,
      rating: 4.8,
      reviewCount: 89,
      badge: language === "en" ? "Premium" : "প্রিমিয়াম",
      features:
        language === "en"
          ? ["Extra Large Size", "Ultra Fluffy", "Premium Durability", "Giftbox Included"]
          : ["অতিরিক্ত বড় সাইজ", "সুপার সফট ও ফ্লাফি", "দীর্ঘস্থায়ী ফিনিশিং", "গিফটবক্স সহ"],
      variants: [
        {
          id: "cb-gold",
          name: language === "en" ? "Honey Gold" : "হানি গোল্ড",
          color: "#DAA520",
          image: "/products/cuddle-gold.png"
        },
        {
          id: "cb-brown",
          name: language === "en" ? "Warm Brown" : "ওয়ার্ম ব্রাউন",
          color: "#A0522D",
          image: "/products/cuddle-brown.png"
        }
      ]
    },
    {
      id: "pikachu",
      name: language === "en" ? "Pikachu Plush" : "পিকাচু প্লুশ",
      tagline: language === "en" ? "Fan Favorite ⚡" : "ফ্যান ফেভারিট ⚡",
      description:
        language === "en"
          ? "Gotta catch this one! Our premium Pikachu plush brings your favorite Pokémon to life with vibrant colors, super-soft fabric, and an adorable smile. A must-have for fans of all ages."
          : "পোকেমন ফ্যানদের জন্য দারুণ উপহার! আপনার প্রিয় পিকাচুকে নিয়ে আসলাম একদম অরিজিনাল ডিজাইনে। উজ্জ্বল রং, অত্যন্ত নরম ফেব্রিক আর কিউট হাসি যা সবার মন কেড়ে নেবেই।",
      price: 550,
      originalPrice: 699,
      rating: 5.0,
      reviewCount: 63,
      badge: language === "en" ? "New Arrival" : "নতুন কালেকশন",
      features:
        language === "en"
          ? ["Vibrant Colors", "Licensed Design", "Premium Fabric", "Collector Item"]
          : ["উজ্জ্বল খাঁটি রং", "খুঁতহীন রিয়েল ডিজাইন", "প্রিমিয়াম সফট ফেব্রিক", "কালেক্টর আইটেম"],
      variants: [
        {
          id: "pk-yellow",
          name: language === "en" ? "Classic Yellow" : "ক্লাসিক হলুদ",
          color: "#FFD700",
          image: "/products/pikachu.png"
        }
      ]
    }
  ];

  const handleVariantChange = useCallback((productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  }, []);

  const handleAddToCart = useCallback(
    (productId: string, variantId: string) => {
      const product = localizedProducts.find((p) => p.id === productId);
      const variant = product?.variants.find((v) => v.id === variantId);
      if (!product || !variant) return;

      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.productId === productId && item.variantId === variantId
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            name: product.name, // Ensure current dynamic language displays in cart
            variantName: variant.name,
            quantity: updated[existingIdx].quantity + 1,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: `${productId}-${variantId}`,
            productId,
            variantId,
            name: product.name,
            variantName: variant.name,
            price: product.price,
            quantity: 1,
            image: variant.image,
          },
        ];
      });
      setCartOpen(true);
    },
    [localizedProducts]
  );

  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // Recalculate names/variant names in active cart items when language dynamically changes
  const activeCartItems = cartItems.map((item) => {
    const freshProduct = localizedProducts.find((p) => p.id === item.productId);
    const freshVariant = freshProduct?.variants.find((v) => v.id === item.variantId);
    return {
      ...item,
      name: freshProduct ? freshProduct.name : item.name,
      variantName: freshVariant ? freshVariant.name : item.variantName,
    };
  });

  const totalCartItems = activeCartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Header cartCount={totalCartItems} onCartClick={() => setCartOpen(true)} />

      {/* ────────── HERO SECTION ────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-warm-100 to-cream-dark">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-warm-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-warm-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-warm-100/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left — Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-warm-200/50 text-sm font-semibold text-warm-600">
                <Sparkles size={14} />
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-heading)] text-navy leading-tight">
                {t.hero.title1}
                <br />
                <span className="relative">
                  <span className="gradient-text">{t.hero.title2}</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8C40 2 100 2 198 8"
                      stroke="#F7941D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                </span>{" "}
                🧸
              </h1>

              <p className="text-lg text-navy-light/60 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t.hero.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <a
                  href="#shop"
                  className="btn-shine px-8 py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold rounded-2xl shadow-lg shadow-warm-400/30 hover:shadow-warm-400/50 transition-all duration-300 flex items-center gap-2 text-base cursor-pointer"
                  id="hero-shop-now"
                >
                  <Gift size={20} />
                  {t.hero.btnShop}
                </a>
                <a
                  href="/about"
                  className="px-8 py-4 bg-white/60 backdrop-blur-sm text-navy font-semibold rounded-2xl border border-warm-200/50 hover:bg-white hover:border-warm-300 transition-all duration-300 text-base"
                  id="hero-learn-more"
                >
                  {t.hero.btnLearn}
                </a>
              </div>

              {/* Social proof mini */}
              <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
                <div className="flex -space-x-3">
                  {["F", "A", "N", "T"].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-warm-300 to-warm-500 border-2 border-cream flex items-center justify-center text-white text-xs font-bold font-[var(--font-heading)]"
                      style={{ zIndex: 4 - i }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-warm-400 text-warm-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-navy-light/50 mt-0.5 font-medium">
                    {t.hero.socialProof.replace("{count}", formatNumber(5000))}
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Hero Product Image */}
            <div className="w-full lg:w-1/2 relative animate-fade-in-up delay-200">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-warm-200/50 to-warm-300/30 blur-2xl" />
                <div className="animate-float absolute inset-0">
                  <Image
                    src="/products/sweetheart-pink.png"
                    alt="Sweet Heart Teddy Bear - RiseUpZone"
                    fill
                    className="object-contain drop-shadow-2xl p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Floating tags */}
                <div className="absolute top-8 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-warm-100 animate-bounce-gentle">
                  <p className="text-xs font-bold text-warm-600">🔥 {t.hero.bestSeller}</p>
                </div>
                <div className="absolute bottom-12 left-0 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-warm-100 animate-bounce-gentle delay-300">
                  <p className="text-xs font-bold text-green-600">✨ {t.hero.premiumQuality}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hidden md:flex justify-center pt-8">
            <a
              href="#shop"
              className="flex flex-col items-center gap-2 text-navy-light/30 hover:text-warm-500 transition-colors group"
            >
              <span className="text-xs font-medium tracking-wider uppercase font-[var(--font-heading)]">
                {language === "en" ? "Explore" : "এক্সপ্লোর করুন"}
              </span>
              <ArrowDown
                size={18}
                className="animate-bounce group-hover:text-warm-500"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ────────── EMOTIONAL CHILD-TEDDY STORY (2nd SLOT) ────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-cream to-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Asymmetrical curved image inspired by unovita leaf design */}
            <div className="lg:col-span-6 flex justify-center w-full">
              <div className="relative w-full aspect-square max-w-[500px] overflow-hidden shadow-xl shadow-warm-500/10 rounded-[80px_15px_80px_15px] border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/story-moment.png"
                  alt="Child Safe Teddy Love"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right: Immersive Typography & Story copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warm-100 dark:bg-warm-200/20 rounded-full border border-warm-200/50 text-xs font-semibold text-warm-600 dark:text-warm-300 shadow-sm font-[var(--font-heading)]">
                <Sparkles size={12} className="animate-pulse-soft" />
                {t.story.badge}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy leading-tight">
                {t.story.title}
              </h2>

              <p className="text-sm md:text-base text-navy-light/85 leading-relaxed">
                {t.story.desc}
              </p>

              <div className="pt-4">
                <a
                  href="#shop"
                  className="btn-shine inline-flex items-center justify-center px-8 py-4 bg-navy text-white hover:bg-navy-light font-semibold rounded-2xl shadow-md transition-all duration-300 text-base cursor-pointer"
                >
                  {language === "en" ? "Shop Safe Cuddles" : "নিরাপদ খেলনা দেখুন"}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────── PRODUCT SHOWCASES ────────── */}
      <section className="py-20 px-4" id="shop">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
              {t.showcase.badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy">
              {t.showcase.title1}{" "}
              <span className="gradient-text">{t.showcase.title2}</span>
            </h2>
          </div>

          <div className="space-y-24">
            {localizedProducts.map((product, i) => (
              <div
                key={product.id}
                id={product.id}
                className="animate-fade-in-up scroll-mt-24"
              >
                <ProductCard
                  product={product}
                  selectedVariant={selectedVariants[product.id]}
                  onVariantChange={(variantId) =>
                    handleVariantChange(product.id, variantId)
                  }
                  onAddToCart={handleAddToCart}
                  reverse={i % 2 === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── TRUST BADGES ────────── */}
      <TrustBadges />

      {/* NOTE: Reviews (Testimonials) section commented out. Will uncomment later. */}
      {/* <Testimonials /> */}

      {/* ────────── FINAL CTA BANNER ────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-navy via-navy-light to-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-white/60 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
            {t.cta.desc}
          </p>
          <a
            href="#shop"
            className="btn-shine inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold rounded-2xl shadow-lg shadow-warm-500/30 hover:shadow-warm-500/50 transition-all duration-300 text-lg cursor-pointer"
            id="cta-shop-now"
          >
            <Gift size={22} />
            {t.cta.btnShop}
          </a>
        </div>
      </section>

      {/* ────────── CUDDLE BY OCCASION (EMOTIONAL SHOPPING GUIDE) ────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-cream to-cream-dark border-t border-warm-200/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
              {t.occasions.badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy leading-tight">
              {t.occasions.title}
            </h2>
            <p className="text-sm text-navy-light/65 mt-2">
              {t.occasions.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.occasions.list.map((item: any, i: number) => {
              const icons = [Heart, Sparkles, Gift];
              const IconComponent = icons[i] || Gift;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-white/5 rounded-3xl border border-warm-200/30 dark:border-warm-200/10 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-warm-100 dark:bg-warm-200/10 flex items-center justify-center text-warm-600 dark:text-warm-400 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xl font-bold font-[var(--font-heading)] text-navy">
                      {item.title}
                    </h3>
                    <p className="text-sm text-navy-light/70 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-6">
                    <a
                      href="#shop"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-600 dark:text-warm-400 hover:text-warm-700 transition-colors group/btn"
                    >
                      {item.btn}
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── FOOTER ────────── */}
      <Footer />

      {/* ────────── CART DRAWER ────────── */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={activeCartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* ────────── CHECKOUT DRAWER ────────── */}
      <CheckoutDrawer
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onBackToCart={() => {
          setCheckoutOpen(false);
          setCartOpen(true);
        }}
        items={activeCartItems}
        onOrderSuccess={() => setCartItems([])}
      />
    </div>
  );
}
