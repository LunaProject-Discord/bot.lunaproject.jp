export interface UserNotification {
    id: number;
    name: string;
    type: 'success' | 'warning' | 'error' | 'information';
    title: string;
    description: string;
    read: boolean;
    updatedAt: number;
    createdAt: number;
}
