// app/api/users/route.ts
import { prisma } from '../../../../lib/schema'; // Adjust the import path as necessary

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
