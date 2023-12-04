import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { JobPost } from '../../models'
import { stringifyJobPostForDb } from './utils'

export async function set(nameData: JobPost, env: Env) {
  const db = createKysely(env)
  const body = stringifyJobPostForDb(nameData)

  await db
    .insertInto('jobPosts')
    .values(body)
    .onConflict((oc) => oc.column('id').doUpdateSet(body))
    .execute()
}
