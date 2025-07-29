"use client";

import Header from '@/../components/layout/Header';
import ProfileHeader from '@/../components/profile/ProfileHeader';
import AboutSection from '@/../components/profile/AboutSection';
import ExperienceSection from '@/../components/profile/ExperienceSection';
import EducationSection from '@/../components/profile/EducationSection';
import SkillsSection from '@/../components/profile/SkillsSection';
import ActivitySection from '@/../components/profile/ActivitySection';
import ProfileSidebar from '@/../components/profile/ProfileSideBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PostSkeleton from '../../../../../components/skeleton/PostSkeleton';
import SidebarSkeleton from '../../../../../components/skeleton/SidebarSkeleton';
import ProfileHeaderSkeleton from '../../../../../components/skeleton/ProfileHeaderSkeleton';

export enum Status {
  online = 'online',
  offline = 'offline',
  away = 'away',
}
interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
  activities: string[];
  logo: string;
}
interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  totalTime: string;
  type: string;
  logo: string;
  description: string[];
}

interface Skill {
  name: string;
  endorsements: number;
  endorsed: boolean;
}

type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  title: string;
  status: Status;
  location:string;
  bannerPic: string;
  education?: EducationEntry | null;
  experience?: Experience | null;
  skills?: Skill | null;
  viewedProfile: number;
} | null;



export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const params = useParams();          // { userId: '12345' }
  const userId = params.userId; 
  const [searchUser, setSearchUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/search/user-posts?userId=${userId}`, {withCredentials: true});
          if(response.data) {
            setPosts(response.data);
          } else {
            console.error('No posts found for this user');
          } 
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/search?userId=${userId}`, {withCredentials:true})
        if (res.data.user) {
          setSearchUser(res.data.user);
        }
      } catch(error) {
        console.log('Error occured', error)
          toast.error('error')
      } finally {
        setLoading(false);

      }
    }

    fetchUser();
    fetchPosts();
  }, [userId]);

  if (loading) {
  return (
    <div className="min-h-screen bg-zinc-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Loader Posts */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileHeaderSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>

          {/* Right Column - Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}



 return (
    <div className="min-h-screen bg-zinc-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Profile Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {searchUser && (
                <>
                  <ProfileHeader
                    searchUser={{
                      id: searchUser.id,
                      name: searchUser.name,
                      title: searchUser.title || '',
                      location: searchUser.location || '',
                      profilePic: searchUser.profilePic || '',
                      bannerPic: searchUser.bannerPic || '',
                    }}
                  />
                  <AboutSection userBio={searchUser?.bio} />
                </>
              )}

              {Array.isArray(posts) && posts.length > 0 && (
                <ActivitySection userPosts={posts} />
              )}

              {searchUser && (
                <>
                  <ExperienceSection
                    userExperience={Array.isArray(searchUser.experience) ? searchUser.experience : []}
                  />
                  <EducationSection
                    userEducation={Array.isArray(searchUser.education) ? searchUser.education : []}
                  />
                  <SkillsSection
                    userSkills={Array.isArray(searchUser.skills) ? searchUser.skills : []}
                  />
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <ProfileSidebar viewedProfile={searchUser?.viewedProfile} searchUserId={searchUser?.id}/>
          </div>
        </div>
      </div>
    </div>
  )
}