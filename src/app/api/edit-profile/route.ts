export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/schema';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;
    const experience = formData.get('experience') as string;
    const educationRaw = formData.get('education') as string;
    const skillsRaw = formData.get('skills') as string; // New: handle skills
    const skill = formData.get('skill') as string;       // New: individual skill (for add)
 

    const image = formData.get('image') as File;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let imageUrl: string | undefined;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      imageUrl = (uploaded as any).secure_url;
    }

    // Load current user to get existing skills
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { skills: true },
    });

    const updateData: any = {};
    if (name) updateData.name = name;
    if (title) updateData.title = title;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;


let skills: string[] | undefined;
if (skillsRaw) {
  try {
    skills = JSON.parse(skillsRaw);
    if (!Array.isArray(skills) || !skills.every(s => typeof s === 'string')) {
      throw new Error('Invalid skills format');
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid skills format. Must be a JSON array of strings.' }, { status: 400 });
  }
}
if (skills) updateData.skills = skills;


    if (experience) {
      try {
        updateData.experience = JSON.parse(experience);
      } catch {
        return NextResponse.json({ error: 'Invalid experience format' }, { status: 400 });
      }
    }

    if (educationRaw) {
      try {
        updateData.education = JSON.parse(educationRaw);
      } catch {
        return NextResponse.json({ error: 'Invalid education format' }, { status: 400 });
      }
    }

    

    if (imageUrl) {
      if (type === 'profile') updateData.profilePic = imageUrl;
      if (type === 'banner') updateData.bannerPic = imageUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: 'Profile updated successfully', imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
