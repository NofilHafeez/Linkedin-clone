import React from 'react';

export default function ProfileHeaderSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden relative animate-pulse">
      {/* Cover Photo Skeleton */}
      <div className="h-48 bg-zinc-700 w-full" />

      {/* Profile Info Section */}
      <div className="px-6 pb-6">
        {/* Profile Picture Skeleton */}
        <div className="relative -mt-28 mb-4">
          <div className="w-40 h-40 rounded-full border-4 border-zinc-900 bg-zinc-700" />
        </div>

        {/* Name and Title Skeletons */}
        <div className="flex flex-col items-start justify-between mb-4 space-y-2">
          <div className="w-1/2 h-6 bg-zinc-700 rounded" />
          <div className="w-1/3 h-4 bg-zinc-700 rounded" />
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-24 h-3 bg-zinc-700 rounded" />
            <div className="w-20 h-3 bg-zinc-700 rounded" />
          </div>
          <div className="w-28 h-3 bg-zinc-700 rounded mt-1" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="w-24 h-8 bg-zinc-700 rounded-full" />
          <div className="w-36 h-8 bg-zinc-700 rounded-full" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="w-24 h-8 bg-zinc-700 rounded-full" />
          <div className="w-28 h-8 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
