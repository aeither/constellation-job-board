import { IRequest } from 'itty-router'

import { Env } from '../env'
import { ZodJobRequest } from '../models'
import { getJP } from './jobs/getJP'
import { setJP } from './jobs/setJP'

export async function setJobPost(
  request: IRequest,
  env: Env
): Promise<Response> {
  const body = await request.json()
  console.log('🚀 ~ file: setJobPost.ts:13 ~ body:', body)
  const safeParse = ZodJobRequest.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const {
    author,
    candidates,
    expiry_date,
    image_url,
    title,
    website_url,
    description,
  } = safeParse.data

  // Check if the name is already taken
  const existingName = await getJP(0, env)
  console.log(
    '🚀 ~ file: setJobPost.ts:32 ~ setJobPost ~ existingName:',
    existingName
  )

  // Save the name
  try {
    await setJP(
      {
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
      },
      env
    )
    const response = { success: true }
    return Response.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    const response = { success: false, error: 'Error setting name' }
    return Response.json(response, { status: 500 })
  }
}
