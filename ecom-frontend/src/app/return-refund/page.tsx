"use client";

import { ArrowLeft, RefreshCw, AlertCircle, Calendar, ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReturnRefund() {
  const [cartCount] = useState(0);
  const { t } = useLanguage();

  const icons = [
    <Calendar key="0" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />,
    <RefreshCw key="1" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />,
    <ShieldAlert key="2" className="text-warm-500 flex-shrink-0 mt-0.5" size={20} />
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
            {t.refund.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-navy">
            {t.refund.title}
          </h1>
          <p className="text-sm text-navy-light/50 mt-2 font-medium">
            {t.refund.updated}
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {t.refund.cards.map((card, i) => (
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
          {/* Note Box */}
          <div className="bg-rose/5 border border-rose/10 rounded-2xl p-5 flex gap-4 text-rose-800 text-xs">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-rose-500" />
            <p dangerouslySetInnerHTML={{ __html: t.refund.warning }} />
          </div>

          {t.refund.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg font-bold font-[var(--font-heading)] text-navy flex items-center gap-2">
                <span className="w-1.5 h-6 bg-warm-500 rounded-full inline-block" />
                {section.title}
              </h2>
              <p>{section.content}</p>
              {section.list && (
                <ol className="list-decimal pl-5 space-y-1.5 mt-2">
                  {section.list.map((item, keyIdx) => (
                    <li key={keyIdx} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
