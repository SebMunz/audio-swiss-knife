"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VisualMode = "normal" | "corrupted";

type UiState = {
  sidebarCollapsed: boolean;
  visualMode: VisualMode;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setVisualMode: (mode: VisualMode) => void;
  toggleVisualMode: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      visualMode: "normal",
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setVisualMode: (mode) => set({ visualMode: mode }),
      toggleVisualMode: () =>
        set({ visualMode: get().visualMode === "normal" ? "corrupted" : "normal" })
    }),
    {
      name: "audio-swiss-knife-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        visualMode: state.visualMode
      })
    }
  )
);
