import { useEffect, useState } from "react";

import type { BrandingSettings } from "@/lib/models/branding";
import { brandingRepository } from "@/services/branding/brandingRepository";

export function useBranding() {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadBranding = async () => {
      setIsLoading(true);
      const nextBranding = await brandingRepository.getBranding();
      if (!cancelled) {
        setBranding(nextBranding);
        setIsLoading(false);
      }
    };

    void loadBranding();
    const unsubscribe = brandingRepository.subscribe(() => {
      void loadBranding();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    branding,
    isLoading,
    saveBranding: (nextBranding: BrandingSettings) =>
      brandingRepository.saveBranding(nextBranding),
  };
}
