'use client';

import Header from '@/../components/layout/Header';
import ProfileHeader from '@/../components/profile/ProfileHeader';
import AboutSection from '@/../components/profile/AboutSection';
import ExperienceSection from '@/../components/profile/ExperienceSection';
import EducationSection from '@/../components/profile/EducationSection';
import SkillsSection from '@/../components/profile/SkillsSection';
import RecommendationsSection from '@/../components/profile/RecommendationsSection';
import ActivitySection from '@/../components/profile/ActivitySection';
import ProfileSidebar from '@/../components/profile/ProfileSideBar';
import { useAuth } from '../../../../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/posts/userId/?userId=${user.id}`, {withCredentials: true});
          if(response.data) {
            console.log('Fetched posts:', response.data);
            setPosts(response.data);
          } else {
            console.error('No posts found for this user');
          } 
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-black">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Profile Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <ProfileHeader user={user}/>
              <AboutSection bio={user?.bio} />
              <ActivitySection posts={posts} />
              <ExperienceSection />
              <EducationSection />
              <SkillsSection />
              <RecommendationsSection />
            </div>
          </div>
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-4">
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
