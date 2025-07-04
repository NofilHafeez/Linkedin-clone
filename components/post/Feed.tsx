'use client';

import PostCreator from './CreatePost';
import Post from './PostCard';

export default function Feed() {
  const posts = [
    {
      id: 1,
      author: {
        name: 'Alex Chen',
        title: 'Software Engineer at Google',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        time: '2h'
      },
      content: 'Just shipped a major feature that will impact millions of users! The feeling of seeing your code make a real difference never gets old. Grateful for the amazing team that made this possible. 🚀',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 142,
      comments: 23,
      shares: 8
    },
    {
      id: 2,
      author: {
        name: 'Maria Rodriguez',
        title: 'Marketing Director at StartupXYZ',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        time: '4h'
      },
      content: 'Exciting news! Our startup just closed Series A funding. This journey has been incredible - from late nights in a garage to now having the resources to scale our vision. Thank you to all our investors and supporters who believed in us! 💪',
      likes: 89,
      comments: 31,
      shares: 15
    },
    {
      id: 3,
      author: {
        name: 'David Kim',
        title: 'UX Designer at Design Studio',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        time: '6h'
      },
      content: 'Design tip: Always consider accessibility from the start, not as an afterthought. Good design is inclusive design. Here are 5 quick wins for making your products more accessible: 1) Use sufficient color contrast 2) Add alt text to images 3) Make buttons keyboard navigable 4) Use semantic HTML 5) Test with screen readers',
      likes: 156,
      comments: 42,
      shares: 28
    }
  ];

  return (
    <div className="space-y-6">
      <PostCreator />
      
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}