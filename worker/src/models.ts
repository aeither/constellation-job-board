import { ColumnType, Generated } from 'kysely'
import z from 'zod'

export const ZodName = z.object({
  name: z.string().regex(/^[a-z0-9-.]+$/),
  owner: z.string(),
  addresses: z.record(z.string()).optional(),
  texts: z.record(z.string()).optional(),
  contenthash: z.string().optional(),
})

export const ZodNameWithSignature = ZodName.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export const ZodJobPost = z.object({
  id: z.number(),
  image_url: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string(),
  candidates: z.array(z.string()).nullable(),
  expiry_date: z.string().nullable(), // Use a string for date representation
  website_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const ZodJobRequest = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  candidates: z.array(z.string()).nullable(),
  expiry_date: z.string().nullable(),
  website_url: z.string().nullable(),
})

export type Name = z.infer<typeof ZodName>
export type JobPost = z.infer<typeof ZodJobPost>
export type NameWithSignature = z.infer<typeof ZodNameWithSignature>

export interface NameInKysely {
  name: string
  owner: string
  addresses: string | null // D1 doesn't support JSON yet, we'll have to parse it manually
  texts: string | null // D1 doesn't support JSON yet, we'll have to parse it manually
  contenthash: string | null
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}

export interface JobPostInKysely {
  id: number
  image_url: string | null
  title: string
  description: string | null
  author: string
  candidates: string[] | null
  expiry_date: string | null // Use a string for date representation
  website_url: string | null
  created_at: string // Assuming the timestamp is stored as a string
  updated_at: string // Assuming the timestamp is stored as a string
}
