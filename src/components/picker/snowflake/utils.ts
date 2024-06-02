import { PickerGetChoiceId, SnowflakePickerRootType } from '@/components/picker';

export const getSnowflakeChoiceId: PickerGetChoiceId<SnowflakePickerRootType> = (choice, index) => 'id' in choice ? choice.id : choice.user.id;
