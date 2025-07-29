    'use client';

export default function NotificationsListSkeleton() {
  return (
    <section className="bg-white bg-zinc-900 shadow ">
      <div>
        {/* Example Skeleton Items */}
        {Array.from({ length: 7 }).map((_, i) => (
            <div
                key={i}
                className="h-16 bg-zinc-900 border px-4 py-3 border-gray-400 animate-pulse flex items-center space-x-4"
            >
                <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                <div className="flex-1">
                <div className="h-4 bg-zinc-700 rounded w-1/3" />
                </div>
            </div>
            ))}
      </div>
    </section>
  );
}
