import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { JobPost } from '../../models'
import { parseJobPostFromDb } from './utils'

export async function get(id: number, env: Env): Promise<JobPost | null> {
  const db = createKysely(env)
  const record = await db
    .selectFrom('jobPosts')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!record) {
    return null
  }

  return parseJobPostFromDb(record)
}
