'use client';

export default function PeopleYouMayKnow() {
  return (
    <section className="bg-white bg-zinc-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">People You May Know</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {/* Example Skeleton Cards */}
        <div className="h-20 bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-20 bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-20 bg-zinc-700 rounded-lg animate-pulse" />
      </div>
    </section>
  );
}
