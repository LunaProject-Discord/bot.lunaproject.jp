import { getGuildById, hasPermission } from '@lunaproject-discord/web-discord';
import { NextApiRequest, NextApiResponse } from 'next';
import { getGuildNotificationById, getGuildNotificationByName } from '../../../../../../libs/bot';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;
    const idOrName = req.query.idOrName as string | number;

    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const guild = await getGuildById(id, req.cookies['token']);
    if (!guild)
        return res.status(404).json({ message: 'Guild not found!' });

    if (!hasPermission(guild))
        return res.status(403).json({ message: 'Permission denied!' });

    const notification = typeof idOrName === 'string' ? await getGuildNotificationByName(id, idOrName) : await getGuildNotificationById(idOrName);
    if (!notification)
        return res.status(404).json({ message: 'Notification not found!' });

    return res.status(200).json(notification);
};

export default handler;
