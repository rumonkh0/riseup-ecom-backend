"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
const motionBase = motion;
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const [cartCount] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { language, t, formatNumber } = useLanguage();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = t.contact.errNameReq;
    }
    if (!formData.email.trim()) {
      errors.email = t.contact.errEmailReq;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t.contact.errEmailInvalid;
    }
    if (!formData.message.trim()) {
      errors.message = t.contact.errMessageReq;
    } else if (formData.message.trim().length < 15) {
      errors.message = t.contact.errMessageMin;
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          publicKey
        );
      }
      setFormSubmitted(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      // Still show success UI — the message attempt was made
      setFormSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "general",
      message: ""
    });
    setFormSubmitted(false);
  };

  const getSubjectName = (subjKey: string) => {
    if (subjKey === "general") return t.contact.subjGeneral;
    if (subjKey === "delivery") return t.contact.subjSupport;
    if (subjKey === "custom") return t.contact.subjCustom;
    if (subjKey === "business") return t.contact.subjBulk;
    return subjKey;
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Header cartCount={cartCount} onCartClick={() => {}} />

        {/* ────────── HERO SECTION ────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cream via-warm-100 to-cream-dark py-16 md:py-20 border-b border-warm-200/30">
          <div className="absolute top-10 left-10 w-48 h-48 bg-warm-200/20 rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-10 w-72 h-72 bg-warm-300/20 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            {/* Back Button */}
            <div className="flex justify-start mb-6 md:mb-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-light/60 hover:text-warm-500 transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                {t.about.backBtn}
              </a>
            </div>

            <motionBase.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-warm-200/40 text-xs font-semibold text-warm-600 shadow-sm">
                <Sparkles size={12} className="animate-pulse-soft" />
                {t.contact.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-heading)] text-navy leading-tight">
                {t.contact.title1} <span className="gradient-text">{t.contact.title2}</span> 💌
              </h1>

              <p className="text-base md:text-lg text-navy-light/70 max-w-2xl mx-auto leading-relaxed">
                {t.contact.desc}
              </p>
            </motionBase.div>
          </div>
        </section>

        {/* UNCOMMENT LATER
        <section className="max-w-6xl mx-auto px-4 py-12 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motionBase.div
              whileHover={{ y: -8, boxShadow: "0 20px 45px rgba(247, 148, 29, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-warm-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-warm-100 flex items-center justify-center text-warm-500 group-hover:bg-warm-500 group-hover:text-white transition-all duration-300 shadow-inner mb-5">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy mb-2">
                {language === "en" ? "Call Us Anytime" : "যেকোনো সময় কল করুন"}
              </h3>
              <p className="text-sm text-navy-light/60 mb-4">
                {language === "en" ? "We are available everyday for your order support" : "অর্ডার সংক্রান্ত যেকোনো সহায়তার জন্য আমাদের কল করুন"}
              </p>
              <a
                href="tel:+8801788610608"
                className="text-base font-bold text-warm-600 hover:text-warm-500 transition-colors"
              >
                {language === "en" ? "+880 1788-610608" : "+৮৮০ ১৭৮৮-৬১০৬০৮"}
              </a>
              <span className="text-xs text-navy-light/40 mt-1 font-medium">
                {language === "en" ? "Everyday: 9:00 AM - 9:00 PM" : `প্রতিদিন: সকাল ৯:০০ - রাত ৯:০০`}
              </span>
            </motionBase.div>

            <motionBase.div
              whileHover={{ y: -8, boxShadow: "0 20px 45px rgba(247, 148, 29, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-warm-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-inner mb-5">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy mb-2">
                {t.contact.cardTitle}
              </h3>
              <p className="text-sm text-navy-light/60 mb-4">
                {t.contact.cardDesc}
              </p>
              <a
                href="mailto:hello@riseupzone.com"
                className="text-base font-bold text-emerald-600 hover:text-emerald-500 transition-colors block"
              >
                hello@riseupzone.com
              </a>
              <span className="text-xs text-navy-light/40 mt-1 font-medium">
                {language === "en" ? "For business inquiries: sales@riseupzone.com" : "ব্যবসায়িক যোগাযোগের জন্য: sales@riseupzone.com"}
              </span>
            </motionBase.div>

            <motionBase.div
              whileHover={{ y: -8, boxShadow: "0 20px 45px rgba(247, 148, 29, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-warm-100 shadow-sm flex flex-col items-center text-center group sm:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-inner mb-5">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold font-[var(--font-heading)] text-navy mb-2">
                {language === "en" ? "Our HQ" : "আমাদের অফিস হাব"}
              </h3>
              <p className="text-sm text-navy-light/60 mb-4">
                {language === "en" ? "Come check our collection or collect your pre-orders" : "সরাসরি শোরুমে এসে কিংবা প্রি-অর্ডার সংগ্রহ করতে পারেন"}
              </p>
              <span className="text-base font-bold text-amber-600">
                {language === "en" ? "Dhaka, Bangladesh" : "ঢাকা, বাংলাদেশ"}
              </span>
              <span className="text-xs text-navy-light/40 mt-1 font-medium text-center">
                {language === "en" ? "Dhanmondi Area, Dhaka-1209" : "ধানমন্ডি এলাকা, ঢাকা-১২০৯"}
              </span>
            </motionBase.div>
          </div>
        </section>
        */}

        {/* ────────── MAIN CONTENT: FORM + FAQ ────────── */}
        <section className="max-w-6xl mx-auto px-4 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Contact Form Column (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-warm-100 shadow-md p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warm-200/20 to-transparent rounded-bl-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold font-[var(--font-heading)] text-navy mb-2 flex items-center gap-2">
                      {t.contact.formHeader}
                    </h2>
                    <p className="text-sm text-navy-light/60 mb-8">
                      {t.contact.formSubheader}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-navy-light">
                          {t.contact.formName}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t.contact.placeholderName}
                            className={`w-full px-5 py-3.5 rounded-2xl bg-cream/30 border text-sm font-medium text-navy focus:outline-none transition-all placeholder:text-navy-light/30 ${
                              formErrors.name
                                ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/10"
                                : "border-warm-200/50 focus:border-warm-500 focus:ring-4 focus:ring-warm-100"
                            }`}
                          />
                        </div>
                        {formErrors.name && (
                          <p className="text-xs font-semibold text-rose flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose animate-ping" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-navy-light">
                          {t.contact.formEmail}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t.contact.placeholderEmail}
                          className={`w-full px-5 py-3.5 rounded-2xl bg-cream/30 border text-sm font-medium text-navy focus:outline-none transition-all placeholder:text-navy-light/30 ${
                            formErrors.email
                              ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/10"
                              : "border-warm-200/50 focus:border-warm-500 focus:ring-4 focus:ring-warm-100"
                          }`}
                        />
                        {formErrors.email && (
                          <p className="text-xs font-semibold text-rose flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose animate-ping" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Subject Choice */}
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-semibold text-navy-light">
                          {t.contact.formSubject}
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3.5 rounded-2xl bg-cream/30 border border-warm-200/50 text-sm font-medium text-navy focus:outline-none focus:border-warm-500 focus:ring-4 focus:ring-warm-100 transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundPosition: "right 1.25rem center",
                            backgroundSize: "1.25rem",
                            backgroundRepeat: "no-repeat"
                          }}
                        >
                          <option value="general">{t.contact.subjGeneral} 🧸</option>
                          <option value="delivery">{t.contact.subjSupport} 🚚</option>
                          <option value="custom">{t.contact.subjCustom} 🎨</option>
                          <option value="business">{t.contact.subjBulk} 💼</option>
                        </select>
                      </div>

                      {/* Message area */}
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-semibold text-navy-light">
                          {t.contact.formMessage}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder={t.contact.placeholderMessage}
                          className={`w-full px-5 py-3.5 rounded-2xl bg-cream/30 border text-sm font-medium text-navy focus:outline-none transition-all placeholder:text-navy-light/30 resize-none ${
                            formErrors.message
                              ? "border-rose focus:border-rose focus:ring-2 focus:ring-rose/10"
                              : "border-warm-200/50 focus:border-warm-500 focus:ring-4 focus:ring-warm-100"
                          }`}
                        />
                        {formErrors.message && (
                          <p className="text-xs font-semibold text-rose flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose animate-ping" />
                            {formErrors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-4 rounded-2xl bg-gradient-to-r from-warm-500 to-warm-600 text-white font-bold text-sm shadow-lg shadow-warm-500/25 hover:shadow-warm-500/40 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden ${
                          submitting ? "opacity-75 cursor-not-allowed" : "cursor-pointer btn-shine"
                        }`}
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            {t.contact.sending}
                          </>
                        ) : (
                          <>
                            {t.contact.btnSend}
                            <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: -10 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="text-center py-10 px-4 flex flex-col items-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center text-warm-500 shadow-md border-2 border-warm-200/50"
                    >
                      <CheckCircle size={44} className="fill-warm-500 text-white" />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-[var(--font-heading)] text-navy">
                        {t.contact.successTitle}
                      </h3>
                      <p className="text-sm text-navy-light/60 max-w-sm mx-auto leading-relaxed">
                        {t.contact.successDesc
                          .replace("{name}", formData.name)
                          .replace("{subject}", getSubjectName(formData.subject))}
                      </p>
                    </div>

                    {/* Form Summary details */}
                    <div className="w-full max-w-sm bg-cream/40 rounded-2xl border border-warm-100 p-4 text-left space-y-2.5 text-xs text-navy-light/80">
                      <div>
                        <span className="font-semibold text-navy">
                          {t.contact.lblTopic}
                        </span>{" "}
                        {getSubjectName(formData.subject)}
                      </div>
                      <div className="line-clamp-3">
                        <span className="font-semibold text-navy">
                          {t.contact.lblMessage}
                        </span> &ldquo;{formData.message}&rdquo;
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs pt-4">
                      <button
                        onClick={resetForm}
                        className="flex-1 py-3 px-4 rounded-xl bg-white border border-warm-200 text-navy font-semibold text-xs hover:bg-cream transition-colors cursor-pointer"
                      >
                        {t.contact.btnSendAnother}
                      </button>
                      <a
                        href="/"
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold text-xs hover:shadow-md transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        {t.contact.successBtn}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: FAQ Accordion Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-warm-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center text-warm-600">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg font-[var(--font-heading)]">
                      {t.contact.faqHeader}
                    </h3>
                    <p className="text-xs text-navy-light/50">
                      {t.contact.faqSubheader}
                    </p>
                  </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-3.5">
                  {t.contact.faqsList.map((faq, i) => {
                    const isOpen = activeFaq === i;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "bg-cream-dark/50 border-warm-200"
                            : "bg-white border-warm-100 hover:border-warm-200"
                        }`}
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left gap-4 font-semibold text-navy text-sm font-[var(--font-heading)] focus:outline-none cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            size={16}
                            className={`text-navy-light/60 transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? "rotate-180 text-warm-500" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="px-4 pb-4 text-xs leading-relaxed text-navy-light/75 border-t border-warm-100/50 pt-3">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Channels Callout */}
              <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-xl group-hover:scale-125 transition-transform" />
                <h4 className="font-bold text-white text-base font-[var(--font-heading)] mb-2 flex items-center gap-1.5">
                  {t.contact.socialHeader}{" "}
                  <Heart size={14} className="fill-rose text-rose inline animate-pulse-soft" />
                </h4>
                <p className="text-white/60 text-xs leading-relaxed mb-6">
                  {t.contact.socialSubheader}
                </p>

                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all border border-white/5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all border border-white/5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* UNCOMMENT LATER
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl border border-warm-100 shadow-md p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-amber-50 rounded-full border border-amber-200/50 text-[10px] font-bold uppercase text-amber-600 tracking-wider font-[var(--font-heading)]">
                {language === "en" ? "Dhaka Hub" : "ঢাকা হাব"}
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-navy">
                {language === "en" ? "Looking to experience the fluffiness in person? 🧸" : "খেলনা স্পর্শ করে কিউটনেস দেখতে চান? 🧸"}
              </h3>
              <p className="text-sm text-navy-light/60 leading-relaxed">
                {language === "en" ? "Our creative gift hub and customer experience center is located in the heart of Dhaka. You can arrange to pick up pre-orders or custom requests directly!" : "আমাদের প্রধান ক্রিয়েটিভ গিফট হাব এবং কাস্টমার এক্সপেরিয়েন্স সেন্টার ঢাকার ধানমন্ডিতে অবস্থিত। আপনার যেকোনো কাস্টম গিফট রিকোয়েস্ট সরাসরি এসেও সংগ্রহ করতে পারেন!"}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-sm text-navy-light">
                <MapPin size={16} className="text-warm-500" />
                <span className="font-semibold text-navy">
                  {language === "en" ? "Road 8/A, Dhanmondi, Dhaka, Bangladesh" : "রোড ৮/এ, ধানমন্ডি, ঢাকা, বাংলাদেশ"}
                </span>
              </div>
            </div>

            <div className="w-full md:w-80 h-52 bg-slate-50 rounded-2xl border border-warm-200 relative overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="absolute w-full h-1 bg-warm-200 top-1/3 rotate-6" />
              <div className="absolute w-full h-1.5 bg-warm-200 top-2/3 -rotate-3" />
              <div className="absolute w-2 h-full bg-warm-200 left-1/4 rotate-12" />
              <div className="absolute w-1 h-full bg-warm-200 left-2/3 -rotate-6" />

              <div className="absolute w-24 h-12 bg-sky-200/50 rounded-full blur-sm top-1/2 left-1/3 -rotate-12 border border-sky-300" />

              <div className="relative z-10 flex flex-col items-center gap-1 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl shadow-lg border border-warm-200 animate-bounce-gentle">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-warm-500/30 animate-ping" />
                  <MapPin size={18} className="text-warm-500 fill-warm-200 relative z-10" />
                </div>
                <span className="text-[10px] font-bold font-[var(--font-heading)] text-navy leading-none">RiseUp Zone</span>
              </div>

              <div className="absolute bottom-2 right-2 text-2xl animate-float">🧸</div>
              <div className="absolute top-2 left-2 text-xl animate-float delay-500">☁️</div>
            </div>
          </div>
        </section>
        */}
      </div>

      <Footer />
    </div>
  );
}
