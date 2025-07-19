// components/skeletons/PostSkeleton.tsx
'use client';

export default function PostSkeleton() {
  return (
    <div className="animate-pulse bg-zinc-800 p-4 rounded-lg space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-zinc-700" />
        <div className="flex-1">
          <div className="h-3 bg-zinc-700 rounded w-1/3 mb-1" />
          <div className="h-3 bg-zinc-700 rounded w-1/4" />
        </div>
      </div>
      <div className="h-4 bg-zinc-700 rounded w-4/5" />
      <div className="h-4 bg-zinc-700 rounded w-full" />
      <div className="h-48 bg-zinc-700 rounded" />
      <div className="h-3 bg-zinc-700 rounded w-1/4" />
    </div>
  );
}
