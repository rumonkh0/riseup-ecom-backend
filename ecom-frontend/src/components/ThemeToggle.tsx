"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDark(true);
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-warm-100 dark:bg-warm-200/20" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="p-2.5 rounded-full bg-warm-100 dark:bg-warm-200/20 text-warm-600 dark:text-warm-300 hover:text-warm-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 360 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {dark ? <Sun size={20} className="text-warm-400" /> : <Moon size={20} />}
      </motion.div>
    </motion.button>
  );
}
