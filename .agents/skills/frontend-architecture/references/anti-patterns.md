# Architecture Anti-Patterns

Anti-patterns below describe failure shapes that repeatedly produce brittle UI state.
Each item focuses on root cause so it remains applicable as the codebase evolves.

## Anti-Pattern 1: Payload-First Child Contracts

Children emit computed business payloads instead of intent signals.

Why this fails:

- Child depends on context it should not own.
- Parent/store receives stale or redundant data snapshots.

Prefer:

- Child emits `id`/`index`/`open`.
- Parent derives payload from canonical data.

## Anti-Pattern 2: Mirror-and-Sync State

Local state mirrors props/query/store values, then `useEffect` keeps them in sync.

Why this fails:

- Competing sources of truth.
- Timing bugs and render churn.

Prefer:

- Keep one canonical source + local intent.
- Derive everything else on render.

## Anti-Pattern 3: Store as Event Bus

Store actions carry fully computed entities (`setSelectedUser(userFromQuery)`) as cross-component events.

Why this fails:

- Query snapshots become stale in stores.
- State updates hide dependency ownership.

Prefer:

- Persist intent keys (`selectedUserId`) and derive entities from query data.

## Anti-Pattern 4: Split Workflow Transitions

Transition rules are split across handlers, effects, refs, and conditionals.

Why this fails:

- Hard to prove invariants.
- Easy to regress when adding a new transition.

Prefer:

- Central transition model (reducer or scoped store action map).
- Event-named actions for each transition.

## Anti-Pattern 5: Globalizing Instance-Local State

Singleton store holds drawer/modal/carousel state that should be isolated per feature instance.

Why this fails:

- Multiple instances interfere with each other.
- Unexpected cross-route/state leakage.

Prefer:

- Component-local state/reducer for instance-local intent.
- Provider-scoped dynamic store if sharing is needed within one feature instance.

## Anti-Pattern 6: Implicit Save Semantics

Dirty/save logic depends on route refresh timing or inferred side effects.

Why this fails:

- Save state can drift from what user just submitted.
- Difficult to reason about optimistic and post-success behavior.

Prefer:

- Explicit `intent` + `savedBaseline` model.
- Explicit transition/event on success (`markSaved`).

## Anti-Pattern 7: Structural Noise in Reducers

Reducer intent is obscured by repeated deep object spreads.

Why this fails:

- Transition meaning gets buried in cloning syntax.
- Increases accidental update mistakes.

Prefer:

- Use `mutative` in reducer branches when it clarifies transition intent.

## Anti-Pattern 8: Server-State Context Tunneling

A provider reads query data and re-exposes it through React context only to deliver it deeper in the tree.

Why this fails:

- Duplicates TanStack Query ownership semantics in a second abstraction.
- Couples unrelated consumers to provider placement and route structure.
- Encourages snapshot passing instead of deriving close to use.

Prefer:

- Read query hooks where data is consumed, or use a feature wrapper hook that composes queries and returns derived view data.
- Keep context for client intent/workflow state (open flags, selected ids, drafts), not server cache snapshots.

## Anti-Pattern 9: useEffect 

A component or hook utilizes a `useEffect()` to perform a sideEffect

Why this fails:

- Side Effects add exponential complexity to components, making tech debt explode 
- Bandaids over a state management issue higher in the component tree
- Encourages business logic being spread all over the ui component tree

Prefer:

- Refactor state management at a higher level to avoid relying on useEffect
- Use onClicks in conjunction with Tanstack Query Mutations for effects triggered by a user action 
