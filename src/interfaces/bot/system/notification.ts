export interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'information';
    title: string;
    description: string;
    updatedAt: number;
    createdAt: number;
}
