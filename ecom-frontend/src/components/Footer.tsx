"use client";

import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, t, formatNumber } = useLanguage();

  return (
    <footer className="bg-navy text-white">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-warm-500 to-warm-600">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] text-white mb-3 animate-pulse-soft">
            {t.footer.newsletterTitle}
          </h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
            {t.footer.newsletterDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t.footer.placeholderEmail}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
              id="newsletter-email"
            />
            <button
              className="px-8 py-3.5 bg-white text-warm-600 font-semibold rounded-xl hover:bg-cream transition-colors text-sm shadow-lg cursor-pointer"
              id="newsletter-subscribe"
            >
              {t.footer.btnSubscribe}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center">
                <span className="text-white font-bold font-[var(--font-heading)]">
                  R
                </span>
              </div>
              <span className="text-lg font-bold font-[var(--font-heading)]">
                Rise<span className="text-warm-400">Up</span>Zone
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold font-[var(--font-heading)] mb-4 text-warm-300">
              {t.footer.colLinks}
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: language === "en" ? "Shop All" : "শপ অল", href: "/#shop" },
                { name: language === "en" ? "Sweet Heart Collection" : "সুইট হার্ট টেডি", href: "/#sweetheart" },
                { name: language === "en" ? "Big Cuddle Bears" : "বিগ কাডল বেয়ার", href: "/#cuddle" },
                { name: language === "en" ? "Pikachu Plush" : "পিকাচু প্লুশ", href: "/#pikachu" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-warm-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold font-[var(--font-heading)] mb-4 text-warm-300">
              {t.footer.colSupport}
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: language === "en" ? "Shipping Policy" : "ডেলিভারি পলিসি", href: "/shipping-policy" },
                { name: language === "en" ? "Return & Refund" : "রিটার্ন ও রিফান্ড", href: "/return-refund" },
                { name: language === "en" ? "Privacy Policy" : "প্রাইভেসি পলিসি", href: "/privacy-policy" },
                { name: language === "en" ? "Terms of Service" : "শর্তাবলী", href: "/terms-of-service" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-warm-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold font-[var(--font-heading)] mb-4 text-warm-300">
              {t.footer.colContact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone size={14} className="text-warm-400 flex-shrink-0" />
                {language === "en" ? "+880 1788-610608" : "+৮৮০ ১৭৮৮-৬১০৬০৮"}
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail size={14} className="text-warm-400 flex-shrink-0" />
                hello@riseupzone.com
              </li>
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin size={14} className="text-warm-400 flex-shrink-0 mt-0.5" />
                {language === "en" ? "Dhaka, Bangladesh" : "ঢাকা, বাংলাদেশ"}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {formatNumber(new Date().getFullYear())} RiseUpZone. {t.footer.rightsReserved}
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            {t.footer.madeWith}{" "}
            <Heart size={12} className="text-rose fill-rose inline" />{" "}
            {t.footer.inBangladesh}
          </p>
        </div>
      </div>
    </footer>
  );
}
