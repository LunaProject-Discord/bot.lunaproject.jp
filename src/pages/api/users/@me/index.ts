import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '../../../../libs/discord';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const user = await getUser(req.cookies['token']);
    if (!user)
        return res.status(404).json({ message: 'User not found!' });

    return res.status(200).json(user);
};

export default handler;
