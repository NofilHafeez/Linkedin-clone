export default function ChatRoom() {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Chat Room</h2>
      <div className="bg-gray-900 h-80 p-4 rounded mb-4 overflow-y-auto">Chat messages...</div>
      <input placeholder="Type a message" className="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
  );
} 