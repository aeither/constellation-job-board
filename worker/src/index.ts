import { Router, createCors } from 'itty-router'

import { createKysely } from './db/kysely'
import { Env } from './env'
import { getCcipRead, getName, getNames, setName } from './handlers'
import { getOwner } from './handlers/getOwner'
import { setJobPost } from './handlers/setJobPost'

const { preflight, corsify } = createCors()
const router = Router()

router
  .all('*', preflight)
  .get('/lookup/*', (request, env) => getCcipRead(request, env))
  .get('/get/:name', (request, env) => getName(request, env))
  .get('/owner/:address', (request, env) => getOwner(request, env))
  .get('/names', (request, env) => getNames(env))
  .post('/set', (request, env) => setName(request, env))
  .post('/setJobPost', async (request, env) => {
    const db = createKysely(env)
    const body = await request.json()

    console.log('🚀 ~ file: index.ts:22 ~ .post ~ body:')
    await db
      .insertInto('jobPosts')
      .values({
        title: 'title',
        author: 'address as string',
        description: 'test',
        image_url: 'https://picsum.photos/1024/1024',
        candidates: ['address as string'],
        expiry_date: '123',
        website_url: 'https://www.google.com',
        created_at: '123',
        id: 0,
        updated_at: '123',
      })
      // .onConflict((oc) => oc.column('id').doUpdateSet(body))
      .execute()
    return Response.json({ text: 'hello' })
  })
  .all('*', () => new Response('Not found', { status: 404 }))

// Handle requests to the Worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return router.handle(request, env).then(corsify)
  },
}
