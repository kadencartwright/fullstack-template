# TanStack Query Patterns

Use these patterns when the task concerns server state, query keys, mutations, cache behavior, or infinite queries.

## Pattern 1: Query-Key Architecture by Feature Shape

Model TanStack Query keys from generic to specific and include all fetch-shaping params.

```tsx
const songsListKey = ["songs", "list", { filter, sort }];
const songDetailKey = ["songs", "detail", songId];
```

Rules:

- Query keys should mirror what changes the response.
- Never reuse the same key between `useQuery` and `useInfiniteQuery`.

Why it works:

- Prevents stale cache collisions.
- Makes invalidation and cache reads predictable.

## Pattern 2: Mutation Boundaries (Consistency vs UI Effects)

Keep server consistency decisions in mutation lifecycle callbacks; keep UI reactions at call sites.

```tsx
const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", "detail"] });
    },
  });
};

// component
const mutation = useUpdateProfile();
mutation.mutate(values, {
  onSuccess: () => {
    toast.success("Profile saved");
    navigate("/account");
  },
});
```

Why it works:

- Cache consistency remains centralized and testable.
- UI behavior stays local to user interaction context.

## Pattern 3: Route-Level Prefetch and Cache Prewarming

When a route has child components that need query data immediately (and do not have a loading UI), prewarm the cache in the route loader.

```tsx
// query module
export const favoritesQueryOptions = {
  queryKey: ["favorites", "list"],
  queryFn: getFavorites,
};

export const favoriteItemsQueryOptions = (ids: string[]) => ({
  queryKey: ["favorites", "items", { ids: [...ids].sort() }],
  queryFn: () => getFavoriteItems(ids),
});

// route loader
export async function clientLoader() {
  const favorites = await queryClient.ensureQueryData(favoritesQueryOptions);

  // fire-and-forget prewarm for adjacent query
  if (favorites.length > 0) {
    void queryClient.prefetchQuery(favoriteItemsQueryOptions(favorites));
  }

  return null;
}
```

Decision criteria:

- Use this when a dependent component has no loading state and must render complete data on first paint.
- Also use it when the route loader is already running a related fetch and can cheaply prewarm sibling queries.
- Prefer non-blocking prefetch (`void prefetchQuery(...)`) by default.
- Block (`await ensureQueryData(...)`) only when you need strict first-render correctness.

Why it works:

- Removes avoidable loading flashes in downstream components.
- Keeps query ownership in TanStack Query instead of mirroring snapshots through context/store.
- Preserves a clean boundary: loader warms cache, components read via query hooks.

## Pattern 4: Feature Wrapper Hooks for Derived View Data

When multiple query results are needed together, compose them in a wrapper hook near the feature instead of passing server snapshots through context providers.

```tsx
export function useFavoritesPageData(user: User | null) {
  const { data: favorites = [], isLoading: isFavoritesLoading } = useFavoritesQuery({ enabled: Boolean(user) });

  const ids = useMemo(() => [...favorites].sort(), [favorites]);
  const { data: items = [], isLoading: isItemsLoading } = useQuery(favoriteItemsQueryOptions(ids));

  const favoriteItems = useMemo(() => deriveFavoriteItems(items, favorites), [items, favorites]);
  const isLoading = isFavoritesLoading || (favorites.length > 0 && isItemsLoading);

  return { favorites, favoriteItems, isLoading };
}
```

Decision criteria:

- Use this when one screen needs multiple server queries and derived data.
- Prefer this over a route/provider context carrying query snapshots.
- Keep query ownership and cache lifecycle in query hooks; return only data needed by the view.

Why it works:

- Keeps server state boundaries explicit and local.
- Avoids context as a data transport layer.
- Makes derivation reusable without creating a second source of truth.
