"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Coffee, Heart } from "lucide-react";

const messages = [
  "Getting best deals...",
  "Setting up the scene...",
  "Preparing your boho experience...",
  "Curating the perfect vibe...",
  "Brewing some magic...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500); // Slightly faster for 2s duration
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-colors duration-700">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-amber-500/30 rounded-full"
            />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-500/20 flex items-center justify-center backdrop-blur-sm border border-amber-500/30">
               <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Text Section */}
        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-amber-100/90 text-xl font-medium tracking-wide text-center"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Loader2 className="w-6 h-6 animate-spin text-amber-500/40" />
          </motion.div>
        </div>
      </div>

      {/* Boho decorative elements */}
      <div className="absolute bottom-10 left-10 opacity-10">
        <Heart className="w-12 h-12 text-rose-300" />
      </div>
      <div className="absolute top-10 right-10 opacity-10">
        <Coffee className="w-12 h-12 text-amber-200" />
      </div>
    </div>
  );
}
