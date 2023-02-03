export const fetcher = async (key: string, init?: RequestInit) => fetch(key, init).then((res) => res.json());

export const fetchWithUser = async (key: string, token: string, init?: RequestInit) => fetcher(
    key,
    {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`
        }
    }
);
