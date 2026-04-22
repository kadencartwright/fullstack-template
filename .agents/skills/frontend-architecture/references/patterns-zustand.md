# Zustand Patterns

Use these patterns when the task involves shared client state, store API design, selector strategy, persistence, or store scope.

## Pattern 1: Store API Boundary with Selectors + Event Actions

In shared Zustand stores, export selector hooks and one actions selector.

```ts
import { create } from "zustand";

type PlayerStore = {
  queue: string[];
  currentTrackId: string | null;
  actions: {
    trackQueued: (trackId: string) => void;
    trackSelected: (trackId: string) => void;
    queueCleared: () => void;
  };
};

const usePlayerStore = create<PlayerStore>((set) => ({
  queue: [],
  currentTrackId: null,
  actions: {
    trackQueued: (trackId) => set((s) => ({ queue: [...s.queue, trackId] })),
    trackSelected: (trackId) => set({ currentTrackId: trackId }),
    queueCleared: () => set({ queue: [], currentTrackId: null }),
  },
}));

export const useQueue = () => usePlayerStore((s) => s.queue);
export const useCurrentTrackId = () => usePlayerStore((s) => s.currentTrackId);
export const usePlayerActions = () => usePlayerStore((s) => s.actions);
```

Why it works:

- Prevents broad subscriptions and accidental coupling.
- Gives components a stable, explicit behavior API.

## Pattern 2: Store-Level Persistence for Durable Client Intent

Persist durable client intent with Zustand middleware instead of ad-hoc storage calls.

```ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PreferencesStore = {
  theme: "light" | "dark";
  actions: {
    themeChanged: (theme: "light" | "dark") => void;
  };
};

const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: "light",
      actions: {
        themeChanged: (theme) => set({ theme }),
      },
    }),
    {
      name: "twi.preferences-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

export const useTheme = () => usePreferencesStore((s) => s.theme);
export const usePreferencesActions = () => usePreferencesStore((s) => s.actions);
```

Why it works:

- Centralizes persistence behavior and keeps UI components storage-agnostic.
- Makes storage schema and migration concerns explicit in one place.
