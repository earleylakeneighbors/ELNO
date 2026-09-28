export default function AdminLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="space-y-3">
        <div className="shimmer-skeleton h-3 w-24 rounded-full" />
        <div className="shimmer-skeleton h-9 w-64 rounded-lg" />
        <div className="shimmer-skeleton h-4 w-96 max-w-full rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer-skeleton h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="shimmer-skeleton h-72 rounded-2xl" />
        <div className="shimmer-skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}
