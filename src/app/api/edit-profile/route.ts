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

    const updateData: any = {};
    if (name) updateData.name = name;
    if (title) updateData.title = title;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
      if (imageUrl) {
      if (type === 'profile') updateData.profilePic = imageUrl;
      if (type === 'banner') updateData.bannerPic = imageUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: 'Profile updated successfully',imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
