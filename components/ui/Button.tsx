export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white">
      {children}
    </button>
  );
}