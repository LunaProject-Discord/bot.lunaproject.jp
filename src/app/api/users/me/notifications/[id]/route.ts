import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { getUserNotificationById } from '@/libs/bot';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const notification = await getUserNotificationById(user.id, id);
    if (!notification)
        return NextResponse.json({ message: 'Notification not found!' }, { status: 404 });

    return NextResponse.json(notification, { status: 200 });
};
