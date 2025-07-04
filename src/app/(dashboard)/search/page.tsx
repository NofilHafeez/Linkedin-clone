export default function SearchPage() {
  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Search</h2>
      <input placeholder="Search for people or posts" className="w-full p-2 rounded bg-gray-800 text-white mb-4" />
      <div className="space-y-2">
        <div className="bg-gray-900 p-4 rounded">Search result 1</div>
        <div className="bg-gray-900 p-4 rounded">Search result 2</div>
      </div>
    </div>
  );
}
