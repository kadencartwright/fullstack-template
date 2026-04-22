# State Boundary Playbook

Related references:

- `references/patterns.md`
- `references/anti-patterns.md`

## Quick Classification Matrix

- `server`: fetched/async/cacheable/stale over time.
- `intent`: user choice or UI workflow state (`selectedId`, `requestedIndex`, `isOpen`).
- `derived`: computed from server + intent (`activeItem`, `isValidSelection`, `clampedIndex`).

## Decomposition Pattern

Split feature code into two layers.

1. Orchestrator/container
   - Owns query hooks and mutation hooks.
   - Owns intent state (`useState` or Zustand).
   - Computes all derived values inline.
   - Passes controlled props to children.
2. Controlled presentational component
   - Receives `value`/`items`/`activeIndex`.
   - Emits intent callbacks only (`onChange`, `onSelectIndex`).
   - No query hooks and no cross-component synchronization concerns.

## Intent-First Data Flow

Use this sequence:

1. Child emits `intent`.
2. Parent updates `intent state`.
3. Parent recomputes `derived state` from canonical query data.
4. Actions consume derived values at execution time.

Avoid this sequence:

1. Child computes payload from stale/local copies.
2. Child emits payload to parent/store.
3. Parent/store mirrors payload.

## Zustand Boundary Rules

- Store durable client intent and workflow flags.
- Do not store query-derived snapshots unless explicitly needed for draft editing.
- Prefer keys (`id`, `index`) to object blobs.
- Delete store fields that are recomputable from query + intent.

## State Container Decision Tree

Choose container by matching scenario constraints:

1. `server` state (fetched/cacheable/stale)
   - Use TanStack Query.
   - Do not mirror query data into reducer/Zustand except explicit editable drafts.
2. Local instance intent (single mounted feature instance)
   - Use `useState` for isolated fields.
   - Use `useReducer` for coupled transitions (one event updates multiple fields, workflow steps, save/reset semantics).
3. Shared client intent (multiple components)
   - Use provider-scoped dynamic Zustand store when multiple isolated feature instances may exist.
   - Use singleton Zustand store only for true app/session-wide shared intent.

Selection checks:

- If two rendered instances must not affect each other, avoid singleton store.
- If consumers are local and transitions are explicit event workflows, reducer is often a fit.
- If consumers span siblings in one feature instance, provider-scoped store is often a fit.
- If consumers span routes/layouts and should share one source of truth, singleton store is often a fit.

## Reducer Workflow Pattern

Use reducers when transitions are the complexity center.

- Model actions as events (`phoneSubmitted`, `modeObserved`, `markSaved`, `hydrateFromUser`).
- Keep reducer state as canonical local intent.
- Keep reducer pure; side effects stay outside reducer.
- Derive `hasChanges`/payloads from reducer state at render or action time.
- When reducers are selected, `mutative` (`create`) can improve readability for nested updates or many transition branches.

Mutative reducer example:

```tsx
import { create } from "mutative";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setNotAffiliated":
      return create(state, (draft) => {
        draft.intent.notAffiliated = action.value;
        if (action.value) {
          draft.intent.churchData = null;
        }
      });
    default:
      return state;
  }
}
```

Draft/baseline pattern:

```tsx
type FormState<T> = { intent: T; savedBaseline: T };

const hasChanges = !isEqual(state.intent, state.savedBaseline);

// success handler
dispatch({ type: "markSaved" });
```

## Derived-State Examples

```tsx
const [requestedIndex, setRequestedIndex] = useState(0);
const items = query.data ?? [];
const activeIndex = items.length === 0 ? 0 : Math.min(requestedIndex, items.length - 1);
const activeItem = items[activeIndex];
```

```tsx
const selectedId = useSelectionStore((s) => s.selectedId);
const users = usersQuery.data ?? [];
const selectedUser = users.find((u) => u.id === selectedId) ?? null;
```

## Refactor Checklist

- Is any `useEffect` only syncing one React state value to another?
- Does any child callback emit computed payload object(s) instead of key/index intent?
- Is Zustand holding values that are recomputable from query data?
- Can this component become controlled with `value` + `onChange`?
- Are side effects limited to external-world interactions?
