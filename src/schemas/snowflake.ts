import { z } from 'zod';

export const SnowflakeSchema = z.string().min(17).max(20).regex(/^\d+$/);
