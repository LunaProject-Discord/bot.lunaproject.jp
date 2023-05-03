import { NextResponse } from 'next/server';
import { getGuilds, getUser } from '../../../../utils';

export const GET = async (req: Request) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    return NextResponse.json(await getGuilds(), { status: 200 });
};
