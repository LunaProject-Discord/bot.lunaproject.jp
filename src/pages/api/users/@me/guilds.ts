import { getGuilds } from '@lunaproject-discord/web-discord';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const guilds = await getGuilds(req.cookies['token']);
    return res.status(200).json(guilds);
};

export default handler;
