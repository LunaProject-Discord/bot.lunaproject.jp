import { PartialUserConfigurationSchema, UserConfigurationSchema } from '@schemas/bot';
import { z } from 'zod';

export type UserConfiguration = z.infer<typeof UserConfigurationSchema>;

export type PartialUserConfiguration = z.infer<typeof PartialUserConfigurationSchema>;
