import { createDirectus } from '@directus/sdk'
import type { Schema } from '../types/directus'

export const directus = createDirectus<Schema>('http://10.0.1.51:8055')
