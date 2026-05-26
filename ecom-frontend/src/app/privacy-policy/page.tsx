"use client";

import { ArrowLeft, Lock, Eye, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicy() {
  const [cartCount] = useState(0);
  const { t } = useLanguage();

  const icons = [
    <Lock key="0" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />,
    <Eye key="1" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />,
    <Settings key="2" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Header cartCount={cartCount} onCartClick={() => {}} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy-light/60 hover:text-warm-500 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t.about.backBtn}
        </a>

        {/* Title */}
        <div className="border-b border-warm-200/50 pb-8 mb-10">
          <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-2 font-[var(--font-heading)]">
            {t.privacy.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-navy">
            {t.privacy.title}
          </h1>
          <p className="text-sm text-navy-light/50 mt-2 font-medium">
            {t.privacy.updated}
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {t.privacy.cards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-warm-100 flex items-start gap-4 shadow-sm">
              {icons[i] || icons[0]}
              <div>
                <h3 className="font-bold text-navy text-sm font-[var(--font-heading)]">
                  {card.title}
                </h3>
                <p className="text-xs text-navy-light/60 mt-1">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Copy */}
        <div className="bg-white rounded-3xl p-8 border border-warm-100 shadow-sm space-y-8 text-navy-light/80 leading-relaxed text-sm">
          {t.privacy.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg font-bold font-[var(--font-heading)] text-navy flex items-center gap-2">
                <span className="w-1.5 h-6 bg-warm-500 rounded-full inline-block" />
                {section.title}
              </h2>
              <p>{section.content}</p>
              {section.list && (
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  {section.list.map((item, keyIdx) => (
                    <li key={keyIdx} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
