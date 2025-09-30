import { SnowflakePickerRootType } from '@/components/picker';
import { PickerGetChoiceId } from '@lunaproject/web-core/dist/components/Picker';

export const getSnowflakeChoiceId: PickerGetChoiceId<SnowflakePickerRootType> = (choice, index) => 'id' in choice ? choice.id : choice.user.id;
