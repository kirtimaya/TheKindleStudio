"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { AnimatePresence, motion } from "framer-motion";

export function BackendStatusProvider({ 
  children,
  initialHasSeen = false
}: { 
  children: React.ReactNode,
  initialHasSeen?: boolean
}) {
  // Use initialHasSeen from server cookie for the first render
  const [isLoading, setIsLoading] = useState(!initialHasSeen);
  const [shouldShow, setShouldShow] = useState(!initialHasSeen);

  // Still use sessionStorage check as a fallback/sync for client-side navigation
  useLayoutEffect(() => {
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoadingScreen");
    if (hasSeenLoading) {
      setIsLoading(false);
      setShouldShow(false);
    }
  }, []);

  useEffect(() => {
    // If we shouldn't show (either from cookie or session), we stop here
    if (initialHasSeen || sessionStorage.getItem("hasSeenLoadingScreen")) {
      return;
    }

    // Otherwise, show for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasSeenLoadingScreen", "true");
      // Set session cookie as well for the server-side to pick it up on next refresh
      document.cookie = "hasSeenLoadingScreen=true; path=/; SameSite=Lax";
    }, 2000);

    return () => clearTimeout(timer);
  }, [initialHasSeen]);

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShow && isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999]"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={(shouldShow && isLoading) ? "hidden" : "block transition-opacity duration-1000 opacity-100"}>
        {children}
      </main>
    </>
  );
}
