import { getUser } from '@app/utils';
import { getUserNotifications } from '@libs/bot';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    return NextResponse.json(await getUserNotifications(user.id), { status: 200 });
};
