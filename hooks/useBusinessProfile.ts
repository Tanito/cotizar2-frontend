import { useEffect, useState } from "react";

import type { BusinessProfile } from "@/lib/models/businessProfile";
import { businessProfileRepository } from "@/services/business/businessProfileRepository";

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      const nextProfile = await businessProfileRepository.getProfile();
      if (!cancelled) {
        setProfile(nextProfile);
        setIsLoading(false);
      }
    };

    void loadProfile();
    const unsubscribe = businessProfileRepository.subscribe(() => {
      void loadProfile();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    profile,
    isLoading,
    saveProfile: (nextProfile: BusinessProfile) =>
      businessProfileRepository.saveProfile(nextProfile),
  };
}
