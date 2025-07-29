'use client';

export default function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col bg-zinc-900 h-full animate-pulse space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${
              i % 2 === 0 ? 'justify-start' : 'justify-end'
            }`}
          >
            <div className="w-2/3 sm:w-1/2 lg:w-1/3 h-4 bg-gray-200 dark:bg-gray-600 rounded-md p-4" />
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
      </div>
    </div>
  );
}
