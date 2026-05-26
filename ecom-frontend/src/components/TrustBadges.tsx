"use client";

import { Shield, Truck, Award, Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: t.trust.safeTitle,
      desc: t.trust.safeDesc,
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: Truck,
      title: t.trust.deliveryTitle,
      desc: t.trust.deliveryDesc,
      color: "from-warm-400 to-warm-500",
    },
    {
      icon: Award,
      title: t.trust.qualityTitle,
      desc: t.trust.qualityDesc,
      color: "from-gold to-warm-400",
    },
    {
      icon: Leaf,
      title: t.trust.ecoTitle,
      desc: t.trust.ecoDesc,
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
            {t.trust.badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy">
            {t.trust.title1}{" "}
            <span className="gradient-text">{t.trust.title2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className="relative group p-6 rounded-3xl bg-cream hover:bg-white border border-warm-200/30 hover:border-warm-200 hover:shadow-xl hover:shadow-warm-200/20 transition-all duration-400 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <badge.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-navy-light/60 leading-relaxed">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
