'use client';

import Header from '@/../components/layout/Header';
import ProfileHeader from '@/../components/profile/ProfileHeader';
import AboutSection from '@/../components/profile/AboutSection';
import ExperienceSection from '@/../components/profile/ExperienceSection';
import EducationSection from '@/../components/profile/EducationSection';
import SkillsSection from '@/../components/profile/SkillsSection';
import ActivitySection from '@/../components/profile/ActivitySection';
import ProfileSidebar from '@/../components/profile/ProfileSideBar';
import PostSkeleton from '@/../components/skeleton/PostSkeleton';
import SidebarSkeleton from '@/../components/skeleton/SidebarSkeleton';
import ProfileHeaderSkeleton from '@/../components/skeleton/ProfileHeaderSkeleton';
import { Post, User } from '@/types/index';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';




export default function ProfilePage() {
  const { userId } = useParams() as { userId: string };
  const [searchUser, setSearchUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/api/search?userId=${userId}`, { withCredentials: true }),
          axios.get(`/api/search/user-posts?userId=${userId}`, { withCredentials: true }),
        ]);

        if (userRes.data?.user) {
          setSearchUser(userRes.data.user);
        }

        if (Array.isArray(postsRes.data)) {
          setPosts(postsRes.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-black">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <ProfileHeaderSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!searchUser) {
    return (
      <div className="min-h-screen bg-zinc-black text-white flex items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ProfileHeader
              searchUser={{
                id: searchUser.id,
                name: searchUser.name,
                title: searchUser.title,
                location: searchUser.location,
                profilePic: searchUser.profilePic ?? '',
                bannerPic: searchUser.bannerPic ?? '',
                receivedConnections: searchUser.receivedConnections
              }}
            />

            <AboutSection userBio={searchUser.bio ?? ''}  searchUserId={searchUser.id}/>

            {posts.length > 0 && <ActivitySection userPosts={posts}  searchUserId={searchUser.id}/>}

            <ExperienceSection userExperience={searchUser.experience ?? []}  searchUserId={searchUser.id}/>
            <EducationSection userEducation={searchUser.education ?? []} searchUserId={searchUser.id} />
            <SkillsSection userSkills={searchUser.skills ?? []} searchUserId={searchUser.id} />
          </div>

          <div className="lg:col-span-4">
            <ProfileSidebar
              viewedProfile={searchUser.viewedProfile}
              searchUserId={searchUser.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
