import { useCallback, useEffect, useRef, useState } from "react";

import type { GeoCoords } from "@/lib/api/therapy";

export type GeolocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

/**
 * Wraps the browser Geolocation API for "find therapists near me" style
 * flows. Nothing here persists to a server — it's a per-visit read of the
 * device's current position, requested with the user's explicit permission.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  // Geolocation callbacks can fire after the component using this hook has
  // unmounted (slow GPS fix) — guard state updates against that.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted.current) return;
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      () => {
        if (!mounted.current) return;
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return { coords, status, request };
}
