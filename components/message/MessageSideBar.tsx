// 'use client';

// import { Search, Edit, MoreHorizontal, Circle } from 'lucide-react';
// import { useState } from 'react';
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

// export default function MessageSidebar() {
//    const { user } = useAuth(); 
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);

//   const handleChatClick = async (conversationId: string) => {
//     setSelectedChat(conversationId);

//     try {
//       const res = await axios.post("/api/room", {
//         userIds: [user.id, conversationId], // Logged-in user + clicked user
//       }, { withCredentials: true });

//       console.log("Room created:", res.data.room);
//       // Optionally navigate to the chat window for this room
//     } catch (error) {
//       console.error("Error creating room:", error);
//     }
//   };


//   return (
//     <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 h-full flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-zinc-700">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-white">Messaging</h2>
//           <div className="flex items-center space-x-2">
//             <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
//               <Edit className="w-5 h-5" />
//             </button>
//             <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
//               <MoreHorizontal className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
        
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search messages"
//             className="w-full pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>
      
//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto">
//         {conversations.map((conversation) => (
//           <div
//             key={conversation.id}
//             onClick={() => handleChatClick(conversation.id)}
//             className={`p-4 border-b border-zinc-700 cursor-pointer transition-colors ${
//               selectedChat === conversation.id ? 'bg-zinc-700' : 'hover:bg-zinc-700'
//             }`}
//           >
//             <div className="flex items-start space-x-3">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full overflow-hidden">
//                   <img
//                     src={conversation.avatar}
//                     alt={conversation.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {conversation.online && (
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-zinc-800 rounded-full"></div>
//                 )}
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <h3 className={`font-medium truncate ${conversation.unread ? 'text-white' : 'text-gray-300'}`}>
//                     {conversation.name}
//                   </h3>
//                   <span className="text-xs text-gray-500">{conversation.time}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className={`text-sm truncate ${conversation.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
//                     {conversation.lastMessage}
//                   </p>
//                   {conversation.unread && (
//                     <Circle className="w-2 h-2 fill-blue-500 text-blue-500 ml-2 flex-shrink-0" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }