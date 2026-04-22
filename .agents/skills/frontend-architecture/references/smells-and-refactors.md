# Smells and Refactors

Related references:

- `references/patterns.md`
- `references/anti-patterns.md`

## Smell 1: Effect-Based Syncing

```tsx
useEffect(() => {
  setActiveIndex(Math.min(activeIndex, items.length - 1));
}, [items.length]);
```

Refactor:

```tsx
const activeIndex = items.length === 0 ? 0 : Math.min(requestedIndex, items.length - 1);
```

Keep `requestedIndex` as intent, derive `activeIndex` on render.

## Smell 2: Callback Payload Mirroring

```tsx
onSelectionChange?.({ file: items[index]?.file, imageType: items[index]?.imageType });
```

Refactor:

```tsx
onActiveIndexChange(index);
```

Then in orchestrator:

```tsx
const activeSelection = {
  file: items[activeIndex]?.file,
  imageType: items[activeIndex]?.imageType,
};
```

## Smell 3: Store as Event Bus

```tsx
actions.activeSelectionChanged(selectionPayload);
const selection = useStore((s) => s.activeSelection);
```

Refactor:

```tsx
const selectedId = useStore((s) => s.selectedId);
const selected = queryData.find((x) => x.id === selectedId);
```

Store intent, derive selected entity.

## Smell 4: Query Snapshot Duplication in Zustand

```tsx
set({ selectedUser: userFromQuery });
```

Refactor:

```tsx
set({ selectedUserId: userId });
```

Later:

```tsx
const selectedUser = usersQuery.data?.find((u) => u.id === selectedUserId);
```

## Smell 5: Over-Coupled Child Components

Symptoms:

- Child imports query hooks.
- Child writes to global store.
- Child emits business payloads.

Refactor strategy:

1. Move query hook to parent.
2. Move business derivation to parent.
3. Keep child controlled and UI-focused.

## Smell 6: Setter Soup for Workflow State

Symptoms:

- Multiple `setState` calls spread across handlers and effects.
- Step transitions are encoded in several places.
- `useRef` is used to track previous mode/state just to coordinate transitions.

Refactor:

```tsx
type FlowAction = { type: "phoneSubmitted"; phone: string } | { type: "verifyNeedsName" } | { type: "backToPhone" };

function reducer(state: FlowState, action: FlowAction): FlowState {
  // central transition rules
}
```

Use an explicit transition model when local intent transitions are coupled (`useReducer` or a scoped store action map).

## Smell 7: Draft/Baseline Drift

Symptoms:

- Separate `savedValues` and `currentValues` with manual sync logic.
- `dirty` is mutable state maintained by effect.
- Successful submit depends on implicit route/user refresh timing.

Refactor:

```tsx
type FormState<T> = { intent: T; savedBaseline: T };

const hasChanges = !isEqual(state.intent, state.savedBaseline);

// on submit success
dispatch({ type: "markSaved" });
```

Make save semantics explicit with transition event(s) such as `markSaved`.

## Smell 8: Singleton Store Leakage

Symptoms:

- Feature state leaks between two instances of the same UI.
- Store carries modal/drawer/carousel instance-local state globally.

Refactor:

1. Keep instance-local workflows in component state or reducer.
2. If shared selectors are needed inside a subtree, create provider-scoped dynamic stores.
3. Reserve singleton stores for true app/session intent.

## Smell 9: Nested Spread Reducers

Symptoms:

- Reducer cases repeatedly return deeply spread objects.
- Transition intent is obscured by structural cloning noise.

Refactor:

```tsx
import { create } from "mutative";

case "updateBirthMonth":
  return create(state, (draft) => {
    draft.intent.birthMonth = action.value === "__clear__" ? null : Number(action.value);
  });
```

Use `mutative` for readability in transition-heavy reducers when it clarifies intent.

## Smell 10: useEffect Fetching for Server State

```tsx
const [songs, setSongs] = useState<Song[]>([]);

useEffect(() => {
  fetchSongs(filter).then(setSongs);
}, [filter]);
```

Refactor:

```tsx
const songsQuery = useQuery({
  queryKey: ["songs", "list", { filter }],
  queryFn: () => fetchSongs(filter),
});

const songs = songsQuery.data ?? [];
```

TanStack Query should own async server state and cache behavior.

## Smell 11: Query Key Collisions Across Query Types

```tsx
useQuery({ queryKey: ["songs"], queryFn: fetchSongs });
useInfiniteQuery({ queryKey: ["songs"], queryFn: fetchSongsPages, initialPageParam: 0 });
```

Refactor:

```tsx
useQuery({ queryKey: ["songs", "list", { filter }], queryFn: fetchSongs });
useInfiniteQuery({
  queryKey: ["songs", "infinite", { filter }],
  queryFn: fetchSongsPages,
  initialPageParam: 0,
});
```

Never share keys between `useQuery` and `useInfiniteQuery`.

## Smell 12: Broad Store Subscriptions in Components

```tsx
const store = usePlayerStore();
```

Refactor:

```tsx
const queue = usePlayerStore((s) => s.queue);
const actions = usePlayerStore((s) => s.actions);
```

Prefer granular selectors and an actions selector to reduce rerenders and coupling.

## Smell 13: Manual Browser Storage in UI Code

```tsx
useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);
```

Refactor:

```ts
const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: "light",
      actions: { themeChanged: (theme) => set({ theme }) },
    }),
    { name: "twi.preferences-store", storage: createJSONStorage(() => localStorage) },
  ),
);
```

Keep persistence concerns in the store layer.

## Smell 14: Syncing Query Data into Local State Without Draft Intent

```tsx
const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
const [name, setName] = useState("");

useEffect(() => {
  setName(profile?.name ?? "");
}, [profile?.name]);
```

Refactor:

```tsx
const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
const name = profile?.name ?? "";
```

Only create local copies when the user is intentionally editing a draft that diverges from server data.

## Guardrails

- Effects are for external world only.
- Intent crosses boundaries; derived values do not.
- Derive close to consumption point.
- Default to local state before global store.
