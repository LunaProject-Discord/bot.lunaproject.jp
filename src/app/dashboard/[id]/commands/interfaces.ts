import { UniqueId } from '@utils/state';

export interface EditablePermissionOverride extends UniqueId {
    id: string;
    override: boolean;
}
