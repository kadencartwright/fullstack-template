# Component Boundary Patterns

Use these patterns when the task is about ownership boundaries, child/parent responsibilities, controlled props, and state lifting.

## Pattern 1: Intent-Only Child APIs

Child components emit compact intent (`index`, `id`, `open`) while parents derive business payloads.

```tsx
// child
onActiveIndexChange(index);

// parent/orchestrator
const selection = {
  file: items[activeIndex]?.file,
  imageType: items[activeIndex]?.imageType,
};
```

Why it works:

- Keeps children UI-focused and testable.
- Avoids stale payload mirroring across boundaries.

## Pattern 2: Orchestrator Derives from Canonical Sources

Keep canonical sources minimal (`query.data`, local intent), then derive operational values inline.

```tsx
const items = query.data ?? [];
const activeIndex = clamp(requestedIndex, 0, items.length - 1);
const activeItem = items[activeIndex] ?? null;
```

Why it works:

- Eliminates sync effects.
- Makes render output deterministic.

## Pattern 3: Container Choice by Scope and Cardinality

Choose state container by where consumers live and how many isolated instances can exist.

- `useState`: local and simple.
- `useReducer`: local and transition-heavy.
- dynamic scoped store: shared within one feature instance.
- singleton store: app/session shared intent.

Why it works:

- Prevents over-globalization and instance leakage.
- Keeps ownership boundaries explicit.
