import { Insertable, Selectable } from 'kysely'

import { JobPost, JobPostInKysely, Name, NameInKysely } from '../../models'

type JobPostSelectableKysely = Selectable<JobPostInKysely>
type NameSelectableKysely = Selectable<NameInKysely>

type JobPostInsertableKysely = Insertable<JobPostInKysely>
type NameInsertableKysely = Insertable<NameInKysely>

export function parseJobPostFromDb(flatName: JobPostSelectableKysely): JobPost
export function parseJobPostFromDb(
  flatName: JobPostSelectableKysely[]
): JobPost[]
export function parseJobPostFromDb(
  flatName: JobPostSelectableKysely | JobPostSelectableKysely[]
): JobPost | JobPost[] {
  if (Array.isArray(flatName)) {
    return flatName.map(parseJobPost)
  }

  return parseJobPost(flatName)

  function parseJobPost(name: JobPostSelectableKysely) {
    return {
      id: name.id,
      image_url: name.image_url || null,
      title: name.title,
      description: name.description || null,
      author: name.author,
      candidates: name.candidates || null,
      expiry_date: name.expiry_date || null,
      website_url: name.website_url || null,
      created_at: name.created_at,
      updated_at: name.updated_at,
    }
  }
}

/**
 * Parse `texts` and `addresses` from the database into JSON.
 * @param flatName Name from the database
 */
export function parseNameFromDb(flatName: NameSelectableKysely): Name
export function parseNameFromDb(flatName: NameSelectableKysely[]): Name[]
export function parseNameFromDb(
  flatName: NameSelectableKysely | NameSelectableKysely[]
): Name | Name[] {
  if (Array.isArray(flatName)) {
    return flatName.map(parseName)
  }

  return parseName(flatName)

  function parseName(name: NameSelectableKysely) {
    return {
      name: name.name,
      owner: name.owner,
      addresses: name.addresses ? JSON.parse(name.addresses) : undefined,
      texts: name.texts ? JSON.parse(name.texts) : undefined,
      contenthash: name.contenthash || undefined,
      createdAt: name.createdAt,
      updatedAt: name.updatedAt,
    }
  }
}

export function stringifyJobPostForDb(name: JobPost): JobPostInsertableKysely
export function stringifyJobPostForDb(
  name: JobPost[]
): JobPostInsertableKysely[]
export function stringifyJobPostForDb(
  name: JobPost | JobPost[]
): JobPostInsertableKysely | JobPostInsertableKysely[] {
  if (Array.isArray(name)) {
    return name.map(stringifyJobPost)
  }

  return stringifyJobPost(name)

  function stringifyJobPost(name: JobPost) {
    return {
      id: name.id,
      image_url: name.image_url || null,
      title: name.title,
      description: name.description || null,
      author: name.author,
      candidates: name.candidates || null,
      expiry_date: name.expiry_date || null,
      website_url: name.website_url || null,
      created_at: name.created_at,
      updated_at: name.updated_at,
    }
  }
}

/**
 * Stringify `texts` and `addresses` from JSON.
 * @param name Name to be inserted into the database
 */
export function stringifyNameForDb(name: Name): NameInsertableKysely
export function stringifyNameForDb(name: Name[]): NameInsertableKysely[]
export function stringifyNameForDb(
  name: Name | Name[]
): NameInsertableKysely | NameInsertableKysely[] {
  if (Array.isArray(name)) {
    return name.map(stringifyName)
  }

  return stringifyName(name)

  function stringifyName(name: Name) {
    return {
      name: name.name,
      owner: name.owner,
      addresses: name.addresses ? JSON.stringify(name.addresses) : null,
      texts: name.texts ? JSON.stringify(name.texts) : null,
      contenthash: name.contenthash || null,
      updatedAt: new Date().toISOString(),
    }
  }
}
