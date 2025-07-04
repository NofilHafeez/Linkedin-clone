export default function EditProfilePage() {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <input placeholder="Name" className="w-full p-2 rounded bg-gray-800 text-white mb-2" />
      <textarea placeholder="Bio" className="w-full p-2 rounded bg-gray-800 text-white mb-2" />
      <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">Save</button>
    </div>
  );
}
