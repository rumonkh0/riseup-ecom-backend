"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t, formatNumber } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t.nav.shop, href: "/#shop" },
    { name: t.nav.collections, href: "/#collections" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.contact, href: "/contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-navy text-white text-center text-xs sm:text-sm py-2.5 px-4 font-medium tracking-wide">
        <span className="animate-pulse-soft inline-block mr-1">🎁</span>
        {language === "en" ? (
          <>
            Free Shipping on Orders Over ৳{formatNumber(999)} —{" "}
            <span className="text-warm-300 font-semibold">Limited Time!</span>
          </>
        ) : (
          <>
            ৳{formatNumber(999)}-এর বেশি অর্ডারে ফ্রি ডেলিভারি —{" "}
            <span className="text-warm-300 font-semibold">সীমিত সময়ের জন্য!</span>
          </>
        )}
      </div>

      {/* Sticky Nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-warm-200/20 border-b border-warm-200/30"
            : "bg-cream"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-lg shadow-warm-400/30 group-hover:shadow-warm-400/50 transition-shadow">
                <span className="text-white font-bold text-lg font-[var(--font-heading)]">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-[var(--font-heading)] text-navy leading-tight">
                  Rise<span className="text-warm-500">Up</span>
                </span>
                <span className="text-[10px] text-navy-light/60 tracking-[0.2em] uppercase font-medium -mt-0.5 hidden sm:block">
                  Zone
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-navy-light/70 hover:text-warm-500 transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-500 rounded-full transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector Switch */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-full bg-warm-100 dark:bg-warm-200/20 text-xs font-bold text-navy hover:text-warm-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center min-w-[3.5rem]"
                aria-label="Toggle Language"
              >
                {language === "en" ? "বাংলা" : "EN"}
              </button>

              <ThemeToggle />

              <button className="hidden md:flex p-2.5 rounded-full hover:bg-warm-100 transition-colors text-navy-light/60 hover:text-rose">
                <Heart size={20} />
              </button>

              <button
                onClick={onCartClick}
                className="relative p-2.5 rounded-full hover:bg-warm-100 transition-colors text-navy-light/60 hover:text-warm-500"
                id="cart-button"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-warm-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-gentle">
                    {formatNumber(cartCount)}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2.5 rounded-full hover:bg-warm-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-warm-200/30 bg-cream animate-fade-in-up">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="py-3 text-sm font-medium text-navy-light/70 hover:text-warm-500 transition-colors border-b border-warm-100/50 last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
