import { NextResponse } from 'next/server';
import { getUserNotificationById, getUserNotificationByName } from '../../../../../../libs/bot';
import { getUser } from '../../../../../utils';

type Props = {
    params: {
        idOrName: string | number;
    }
}

export const GET = async (req: Request, { params: { idOrName } }: Props) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const notification = typeof idOrName === 'string' ? await getUserNotificationByName(user.id, idOrName) : await getUserNotificationById(idOrName);
    if (!notification)
        return NextResponse.json({ message: 'Notification not found!' }, { status: 404 });

    return NextResponse.json(notification, { status: 200 });
};
