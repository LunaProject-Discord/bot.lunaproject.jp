import { getGuildById, hasPermission } from '@lunaproject-discord/web-discord';
import { NextApiRequest, NextApiResponse } from 'next';
import { getGuildNotifications } from '../../../../../libs/bot';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const guild = await getGuildById(id, req.cookies['token']);
    if (!guild)
        return res.status(404).json({ message: 'Guild not found!' });

    if (!hasPermission(guild))
        return res.status(403).json({ message: 'Permission denied!' });

    return res.status(200).json(await getGuildNotifications(id));
};

export default handler;
