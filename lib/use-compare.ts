"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "watchshop-compare";
const COMPARE_EVENT = "watchshop-compare-changed";
const MAX_COMPARE = 3;

function readCompareIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed.filter(
          (id): id is string => typeof id === "string",
        ),
      ),
    ).slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setCompareIds(readCompareIds());
    };

    sync();

    window.addEventListener(COMPARE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(COMPARE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    const current = readCompareIds();

    let updated: string[];

    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
    } else {
      if (current.length >= MAX_COMPARE) {
        return false;
      }

      updated = [...current, productId];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setCompareIds(updated);

      window.dispatchEvent(new Event(COMPARE_EVENT));

      return true;
    } catch {
      console.error("Izbor satova nije mogao da se sačuva.");
      return false;
    }
  }, []);

  const clearCompare = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);

      setCompareIds([]);

      window.dispatchEvent(new Event(COMPARE_EVENT));
    } catch {
      console.error("Izbor satova nije mogao da se obriše.");
    }
  }, []);

  const isCompared = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds],
  );

  return {
    compareIds,
    toggleCompare,
    clearCompare,
    isCompared,
    maxCompare: MAX_COMPARE,
  };
}