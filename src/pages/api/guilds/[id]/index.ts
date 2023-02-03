import { NextApiRequest, NextApiResponse } from 'next';
import { getGuildById } from '../../../../libs/discord';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const guild = await getGuildById(id, req.cookies['token']);
    if (!guild)
        return res.status(404).json({ message: 'Guild not found!' });

    return res.status(200).json(guild);
};

export default handler;
