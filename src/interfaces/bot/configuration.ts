import {
    ConfigurationLanguageSchema,
    ConfigurationRootSchema,
    ConfigurationTimeAndLanguageSchema,
    ConfigurationTimeZoneSchema
} from '@schemas/bot';
import { z } from 'zod';

export type ConfigurationRoot = z.infer<typeof ConfigurationRootSchema>;

export type ConfigurationTimeAndLanguage = z.infer<typeof ConfigurationTimeAndLanguageSchema>;

export type ConfigurationLanguage = z.infer<typeof ConfigurationLanguageSchema>;

export type ConfigurationTimeZone = z.infer<typeof ConfigurationTimeZoneSchema>;
