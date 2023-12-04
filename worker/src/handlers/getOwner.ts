import type { IRequest } from 'itty-router'
import zod from 'zod'

import { createKysely } from '../db/kysely'
import { Env } from '../env'
import { Name } from '../models'
import { parseNameFromDb } from './functions/utils'

export async function get(address: string, env: Env): Promise<Name | null> {
  const db = createKysely(env)
  const record = await db
    .selectFrom('names')
    .selectAll()
    .where('owner', '=', address)
    .executeTakeFirst()

  if (!record) {
    return null
  }

  return parseNameFromDb(record)
}

export async function getOwner(request: IRequest, env: Env) {
  const schema = zod.object({
    address: zod.string(),
  })
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { address } = safeParse.data
  const nameData = await get(address, env)

  if (nameData === null) {
    return new Response('Name not found', { status: 404 })
  }

  return Response.json(nameData, {
    status: 200,
  })
}
