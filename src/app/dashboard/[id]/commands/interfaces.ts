import { UniqueId } from '@/utils/react/state';

export interface EditablePermissionOverride extends UniqueId {
    id: string;
    override: boolean;
}
