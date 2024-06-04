import { UniqueId } from '@lunaproject/web-core/dist/utils';

export interface EditablePermissionOverride extends UniqueId {
    id: string;
    override: boolean;
}
