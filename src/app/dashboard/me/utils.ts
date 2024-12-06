import { UserConfiguration } from '@/interfaces/bot';

export const saveUserConfiguration = async (configuration: Partial<UserConfiguration>) => {
    const response = await fetch(
        '/api/users/me/configuration',
        {
            method: 'PATCH',
            body: JSON.stringify(configuration),
            credentials: 'include'
        }
    );

    return response.ok;
};
