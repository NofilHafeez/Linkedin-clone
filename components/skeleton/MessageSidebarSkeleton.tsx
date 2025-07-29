'use client';

export default function MessageSidebarSkeleton() {
  return (
    <div className="space-y-4 bg-zinc-900 p-5 h-full animate-pulse">
      {/* Search bar placeholder */}
      <div className="h-10  dark:bg-gray-700 rounded-md" />

      {/* Message list placeholders */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />

            {/* Name and message preview */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
