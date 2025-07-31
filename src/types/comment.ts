
export interface Comment {
  id: string;
  text: string;
  commenterId: string;
  postId: string;
  createdAt: string;
  commenter: {
    id: string;
    name: string;
    profilePic?: string | null;
  };
}

