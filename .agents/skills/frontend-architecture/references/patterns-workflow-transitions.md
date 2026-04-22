# Workflow Transition Patterns

Use these patterns for form flows, onboarding steps, mode transitions, and any feature where event sequencing is the complexity center.

## Pattern 1: Explicit Transition Model for Workflow State

Represent workflow transitions as events and centralize them.

```tsx
type Action =
  | { type: "submitted"; value: string }
  | { type: "back" }
  | { type: "modeObserved"; mode: Mode; open: boolean };
```

Use either:

- `useReducer` for component-instance workflows, or
- provider-scoped store actions for shared feature-instance workflows.

Why it works:

- Transition rules live in one place.
- Easier to reason about cross-event invariants.

## Pattern 2: Draft + Saved Baseline

For editable forms, track editable intent separately from committed baseline.

```tsx
type FormState<T> = { intent: T; savedBaseline: T };
const hasChanges = !isEqual(state.intent, state.savedBaseline);
```

On success, advance baseline explicitly (`markSaved`).

Why it works:

- Dirty-state is derived, not synchronized.
- Save semantics do not depend on implicit data refresh timing.

## Pattern 3: Mutative for Transition-Heavy Reducers

When reducer cases become spread-heavy, use `mutative` for clarity.

```tsx
return create(state, (draft) => {
  draft.intent.notAffiliated = action.value;
  if (action.value) draft.intent.churchData = null;
});
```

Why it works:

- Emphasizes business transition intent over cloning mechanics.
