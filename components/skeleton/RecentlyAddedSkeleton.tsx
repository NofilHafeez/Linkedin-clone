'use client';

export default function RecentlyAdded() {
  return (
    <section className="bg-white bg-zinc-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recently Added</h2>
      <ul className="space-y-2">
        {/* Example Skeleton Items */}
        <li className="h-14 bg-zinc-700 rounded-lg animate-pulse" />
      </ul>
    </section>
  );
}
