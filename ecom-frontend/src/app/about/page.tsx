"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  Recycle,
  Sparkles,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

/* Helper mapping to pair static styling & icons with translated values */
const valueIcons = [ShieldCheck, Award, Recycle, HeartHandshake];
const valueColors = [
  "from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400",
  "from-warm-500/10 to-warm-600/10 text-warm-600 dark:text-warm-400",
  "from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  "from-rose-500/10 to-rose-600/10 text-rose-600 dark:text-rose-400"
];

const teamAvatars = ["🧸", "⚡", "🎀"];

export default function AboutPage() {
  const [cartCount] = useState(0);
  const { language, t, formatNumber } = useLanguage();

  // Combine static styling details with translated values list
  const localizedValues = t.about.valuesList.map((val, i) => ({
    ...val,
    icon: valueIcons[i],
    color: valueColors[i]
  }));

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Header cartCount={cartCount} onCartClick={() => {}} />

        {/* ────────── HERO SECTION ────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cream via-warm-100 to-cream-dark py-16 md:py-24 border-b border-warm-200/30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-warm-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-warm-300/20 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
            {/* Back Button */}
            <div className="flex justify-start mb-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-light/60 hover:text-warm-500 transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                {t.about.backBtn}
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-warm-200/40 text-xs font-semibold text-warm-600 shadow-sm">
                <Sparkles size={12} className="animate-pulse-soft" />
                {t.about.storyBadge}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[var(--font-heading)] text-navy leading-tight">
                {t.about.storyTitle1} <span className="gradient-text">{t.about.storyTitle2}</span> 🧸
              </h1>

              <p className="text-base md:text-lg text-navy-light/70 max-w-2xl mx-auto leading-relaxed">
                {t.about.storyDesc}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ────────── MISSION & STORY SECTION ────────── */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Beautiful Graphic / Text Card */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 bg-warm-100 rounded-full border border-warm-200/50 text-xs font-bold uppercase text-warm-600 tracking-wider">
                {t.about.whoBadge}
              </div>
              <h2 className="text-3xl font-bold font-[var(--font-heading)] text-navy">
                {t.about.whoTitle}
              </h2>
              <p className="text-sm md:text-base text-navy-light/85 leading-relaxed">
                {t.about.whoDesc1}
              </p>
              <p className="text-sm md:text-base text-navy-light/85 leading-relaxed">
                {t.about.whoDesc2}
              </p>

              {/* Mini Counter Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-warm-200/30">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] text-warm-600">
                    {formatNumber("5k")}+
                  </h3>
                  <p className="text-[10px] text-navy-light/50 font-semibold uppercase mt-1">
                    {t.about.statCuddles}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] text-warm-600">
                    {formatNumber(100)}%
                  </h3>
                  <p className="text-[10px] text-navy-light/50 font-semibold uppercase mt-1">
                    {t.about.statSafe}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] text-warm-600">
                    {formatNumber(64)}
                  </h3>
                  <p className="text-[10px] text-navy-light/50 font-semibold uppercase mt-1">
                    {t.about.statDistricts}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Polaroid Showcase Card (Blends custom white background elegantly) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-[#FFFBF5] rounded-3xl border border-warm-200/50 p-6 sm:p-8 shadow-md max-w-sm w-full relative overflow-hidden group">
                {/* Visual Image mock */}
                <div className="relative aspect-square rounded-2xl bg-white border border-warm-200/30 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Floating particles */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-warm-200/30 to-warm-400/20 blur-xl animate-pulse-soft animate-float" />
                  <span className="text-8xl relative z-10 animate-float select-none">🧸</span>
                </div>
                <div className="pt-6 text-center space-y-1">
                  <span className="text-xs font-bold text-warm-500 uppercase tracking-widest font-[var(--font-heading)]">
                    {language === "en" ? "Sweet Heart Collection" : "সুইট হার্ট কালেকশন"}
                  </span>
                  <h4 className="font-bold text-navy text-lg font-[var(--font-heading)]">
                    {language === "en" ? "Classic Sweet Heart Teddy" : "ক্লাসিক সুইট হার্ট টেডি"}
                  </h4>
                  <p className="text-xs text-navy-light/55">
                    {language === "en" ? "Designed with premium quality and safe materials" : "উন্নত মান ও নিরাপদ উপাদানে তৈরি"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ────────── VALUES GRID ────────── */}
        <section className="bg-white py-16 md:py-24 border-y border-warm-200/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
                {t.about.valuesBadge}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy">
                {t.about.valuesTitle}
              </h2>
              <p className="text-sm text-navy-light/60 mt-2">
                {t.about.valuesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {localizedValues.map((value, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 sm:p-8 bg-[#FFFBF5] rounded-3xl border border-warm-100 shadow-sm"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${value.color} shadow-sm`}>
                    <value.icon size={26} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-navy text-base font-[var(--font-heading)]">{value.title}</h3>
                    <p className="text-xs leading-relaxed text-navy-light/75">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NOTE: Our Journey (Timeline) section commented out. Will uncomment later. */}
        {/*
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
              {t.about.journeyBadge}
            </p>
            <h2 className="text-3xl font-bold font-[var(--font-heading)] text-navy">
              {t.about.journeyTitle}
            </h2>
          </div>

          <div className="relative border-l border-warm-300 ml-4 md:ml-12 space-y-12">
            {t.about.journeyList.map((item, i) => (
              <div key={i} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-warm-500 to-warm-600 border-4 border-cream flex items-center justify-center shadow-md shadow-warm-500/20" />
                
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-warm-100 rounded-full border border-warm-200/50 text-[10px] font-bold text-warm-600 uppercase tracking-widest font-[var(--font-heading)]">
                    {formatNumber(item.year)}
                  </span>
                  <h3 className="text-xl font-bold font-[var(--font-heading)] text-navy">{item.title}</h3>
                  <p className="text-xs md:text-sm leading-relaxed text-navy-light/75 max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        */}

        {/* ────────── PLAYFUL TEAM SECTION ────────── */}
        <section className="bg-[#FFFBF5] py-16 md:py-24 border-t border-warm-200/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
                {t.about.teamBadge}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy">
                {t.about.teamTitle}
              </h2>
              <p className="text-sm text-navy-light/60 mt-2">
                {t.about.teamDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.about.teamList.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-warm-100 shadow-sm p-6 sm:p-8 text-center flex flex-col items-center group hover:shadow-md transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-full bg-cream border border-warm-100 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300 mb-5">
                    <span className="select-none animate-float" style={{ animationDelay: `${i * 200}ms` }}>
                      {teamAvatars[i] || "🧸"}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy text-lg font-[var(--font-heading)]">{item.name}</h3>
                  <span className="text-xs font-semibold text-warm-500 tracking-wider uppercase font-[var(--font-heading)] mb-3 block">
                    {item.role}
                  </span>
                  <p className="text-xs leading-relaxed text-navy-light/65">
                    {item.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
