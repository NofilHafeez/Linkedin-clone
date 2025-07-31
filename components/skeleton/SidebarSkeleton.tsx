// components/skeletons/SidebarSkeleton.tsx
export default function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-5">
    <div className="animate-pulse bg-zinc-800 p-4 rounded-lg space-y-3">
      <div className="h-5 bg-zinc-700 rounded mb-5  w-full mx-auto" />
      <div className="h-3 bg-zinc-700 rounded mb-3 w-full mx-auto" />
    </div>
    
     <div className="animate-pulse bg-zinc-800 p-4 rounded-lg w-full max-w-sm">
  {/* Circle on top */}
  <div className="w-24 h-24 bg-zinc-700 rounded-full mb-4" />

  {/* Text skeletons below */}
  <div className="space-y-3">
    <div className="h-4 bg-zinc-700 rounded w-1/2" />
    <div className="h-4 bg-zinc-700 rounded w-2/3" />
    <div className="h-8 bg-zinc-700 rounded w-full mt-2" />
  </div>
</div>


    </div>

  );
}
