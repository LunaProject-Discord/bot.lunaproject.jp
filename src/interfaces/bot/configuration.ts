import { ConfigurationLanguageSchema, ConfigurationRootSchema } from '@schemas/bot';
import { z } from 'zod';

export type ConfigurationRoot = z.infer<typeof ConfigurationRootSchema>;

export type ConfigurationLanguage = z.infer<typeof ConfigurationLanguageSchema>;
