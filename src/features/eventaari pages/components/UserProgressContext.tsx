"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calculateUserProgress,
  STORAGE_KEYS,
} from "../data/demoData";

type UserProgressContextValue = {
  completedChallengeIds: string[];
  progress: ReturnType<typeof calculateUserProgress>;
  toggleChallenge: (id: string) => void;
  resetChallenges: () => void;
};

const UserProgressContext = createContext<UserProgressContextValue | null>(null);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEYS.completedChallenges);
        if (saved) setCompletedChallengeIds(JSON.parse(saved));
      } catch {
        // The demo still works when browser storage is unavailable.
      }
      setStorageLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.completedChallenges,
        JSON.stringify(completedChallengeIds),
      );
    } catch {
      // The demo still works when browser storage is unavailable.
    }
  }, [completedChallengeIds, storageLoaded]);

  const progress = useMemo(
    () => calculateUserProgress(completedChallengeIds),
    [completedChallengeIds],
  );

  const value = useMemo<UserProgressContextValue>(
    () => ({
      completedChallengeIds,
      progress,
      toggleChallenge: (id) => {
        setCompletedChallengeIds((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        );
      },
      resetChallenges: () => setCompletedChallengeIds([]),
    }),
    [completedChallengeIds, progress],
  );

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error("useUserProgress must be used within UserProgressProvider");
  }
  return context;
}
