
export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  createdAt: string;
   requester: {
    id: string;
    name: string;
    profilePic: string;
    title: string;
  };
}

export interface ConnectionRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    profilePic: string;
    title: string;
  };
  receiver: {
    id: string;
    name: string;
    profilePic: string;
    title: string;
  };
}