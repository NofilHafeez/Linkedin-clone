import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/schema'; // adjust path as needed
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}


export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const text = formData.get('text') as string;
  const image = formData.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  //  Upload to Cloudinary
  const uploaded = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    }).end(buffer);
  });

  const imageUrl = (uploaded as any).secure_url;

  // Save to DB
  // You need to get the userId from the request/session; here it's assumed as 'userId'
  const userId = formData.get('userId') as string; // Adjust how you get userId as needed

  const post = await prisma.post.create({
    data: {
      text,
      imageUrl, // store the Cloudinary image URL
      createdAt: new Date(),
      user: {
        connect: { id: userId }, // Connect to existing user by id
      },
    },
  });

  return NextResponse.json({ post });
}
