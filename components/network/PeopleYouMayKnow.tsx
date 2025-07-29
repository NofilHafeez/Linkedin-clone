'use client';

import { UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import PeopleYouMayKnowSkeleton from '../skeleton/PeopleYouMayKnowSkeleton';

interface Person {
  id: string;
  name: string;
  title: string;
  profilePic: string;
} 


export default function PeopleYouMayKnow() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const socket = useSocket();

 const handleNotification = async (message: string, receiverId: string) => {
    try {
      const res = await axios.post('api/notifications', {message, senderId: user?.id, receiverId}, {withCredentials: true});
    }catch (err) {
        toast.error("Failed sending notifications")
        console.error('Error sending notification:');
      }

    }
  

  useEffect(() => {
    if (!user?.id) return;

    const fetchPeople = async () => {
      try {
        const response = await axios.get(`/api/connections/?userId=${user.id}`, {
          withCredentials: true,
        });

        if (response.data) {
          setPeople(response.data.similarUsers || []);
        } else {
          toast.error('No data received from API');
        }
      } catch (err) {
        toast.error('Error fetching:' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false)
      }
    };

    fetchPeople();
  }, [user?.id]);

  const sendConnectionRequest = async (receiverId: string) => {
    if (!user?.id) {
      toast.error('User ID is missing.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/connections/request',
        {
          requesterId: user.id,
          receiverId: receiverId,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        if(receiverId !== user.id)  {// Avoid self-notification
        handleNotification("New connection request from", receiverId); 
         if (socket) {
        socket.emit('send-connect-noti', {
            message: `You have a new connection request from ${user?.name}`,
            receiverId: receiverId,
            sender: {
              id: user.id,
              name: user.name,
              profilePic: user.profilePic,
            },
          });
      }
  }
        toast.success('Connection request sended!!');
      }
    } catch (error) {
      toast.error('Failed sending connection request')
      console.error('Error sending connection request:', error);
    }
  };

  if (loading) {
    return <PeopleYouMayKnowSkeleton />;
  }

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">People you may know</h2>
        <button className="text-blue-400 hover:underline text-sm">See all</button>
      </div>

      {people.length === 0 ? (
        <p className="text-gray-400 text-center">No people to suggest right now</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={person.profilePic || '/default.jpg'}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="text-gray-400 hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-white hover:text-blue-400 cursor-pointer text-sm">
                  {person.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1">{person.title}</p>
              </div>

              <button
                onClick={() => {sendConnectionRequest(person.id); handleNotification(`You have a new connection request from ${user?.name}`, person.id)}}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-blue-600 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 