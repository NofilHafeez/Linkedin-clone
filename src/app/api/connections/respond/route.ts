import {  NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/schema';

export async function PUT(request: Request) {
    try {
        console
        const { connectionId, status } = await request.json();
console.log('Updating connection status for ID:', connectionId, 'to status:', status);
        if (!connectionId || !status) {
            return NextResponse.json({ error: 'Connection ID and status are required' }, { status: 400 });
        }

       const updated = await prisma.connection.updateMany({
    where: { id: connectionId },
    data: { status },
});

if (updated.count === 0) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
}



        return NextResponse.json({ message: 'Connection status updated successfully', connection: updated }, { status: 200 });
    } catch (error) {
        console.error('Error updating connection status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 