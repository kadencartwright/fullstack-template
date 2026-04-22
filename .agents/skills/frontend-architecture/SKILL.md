---
name: frontend-architecture
description: React frontend architecture playbook for state boundaries, ownership, and refactors. Use this skill whenever a task touches React components/hooks
---

Your job is to keep React code easy to reason about by creating clean state boundaries.
The highest-leverage move is separating server state, client intent, and derived values.
**IMPORTANT** `useEffect`s are an anti-pattern. If you think you need one, you are wrong. consider them a signal to address state management changes from higher in the component hierarchy

## Use this decision model first

1. Classify each state value.
   - `server`: fetched from backend, async, cacheable, stale over time.
   - `intent`: user/UI workflow state (`isOpen`, `selectedId`, drafts, requested index).
   - `derived`: computed from server + intent (`activeItem`, `isValidSelection`, clamped index).
2. Pick the right container.
   - `useState`: small, isolated local intent.
   - `useReducer`: local flows with coupled transitions and explicit event modeling.
   - `Zustand`: complex shared client workflows across components.
   - `TanStack Query`: all server state (queries, mutations, caching, invalidation).
3. Replace `useEffect`
   - data fetching with Query hooks.
   - `setState` sync-in-effect logic with derivation.
   - other uses with reducers + state hoisting

## Core architecture rules

- Keep orchestration in container components/hooks; keep child components controlled and UI-focused.
- Let child callbacks emit intent (`onSelectId`, `onChange`, `onActiveIndexChange`), not business payload snapshots.
- Store durable intent and workflow flags; derive entities from query data at read time.
- Prefer deriving close to consumption instead of storing recomputable values.

## Reference router

Choose references by task type, then read only the matching files first.

- Component ownership, controlled props, state lifting: [State Boundary Playbook][state-boundary-playbook], [Component Boundaries][patterns-component-boundaries]
- TanStack Query keys, mutations, infinite-query boundaries: [React Query Patterns][patterns-react-query], [Smells and Refactors][smells-and-refactors]
- Zustand store API, selectors, persistence, scope: [Zustand Patterns][patterns-zustand], [Anti-Patterns][anti-patterns]
- Transition-heavy flows (forms/wizards/mode transitions): [Workflow Transitions][patterns-workflow-transitions], [Smells and Refactors][smells-and-refactors]

If multiple areas apply, start with the smallest relevant set and expand only as needed.

General references:

- [Patterns Index][patterns]: routes to usecase-specific pattern docs.
- [Smells and Refactors][smells-and-refactors]: smell-to-refactor examples.

[state-boundary-playbook]: references/state-boundary-playbook.md
[patterns-component-boundaries]: references/patterns-component-boundaries.md
[patterns-react-query]: references/patterns-react-query.md
[smells-and-refactors]: references/smells-and-refactors.md
[patterns-zustand]: references/patterns-zustand.md
[anti-patterns]: references/anti-patterns.md
[patterns-workflow-transitions]: references/patterns-workflow-transitions.md
[patterns]: references/patterns.md
