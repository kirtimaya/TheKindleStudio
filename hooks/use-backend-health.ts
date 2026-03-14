"use client";

import { useState, useEffect } from "react";

export function useBackendHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/actuator/health`, {
          // Use no-cache to ensure we get the latest status
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          setIsHealthy(true);
          clearInterval(intervalId);
        } else {
          setIsHealthy(false);
        }
      } catch (err) {
        setIsHealthy(false);
        setError("Backend is unreachable");
        console.log("Waiting for backend...");
      }
    };

    // Check immediately
    checkHealth();

    // Then check every 3 seconds
    intervalId = setInterval(checkHealth, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [API_BASE_URL]);

  return { isHealthy, error };
}
