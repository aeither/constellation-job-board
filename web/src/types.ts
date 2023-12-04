export interface WorkerRequest {
  name: string
  owner: string
  addresses?: Record<string, string | undefined> | undefined
  texts?: Record<string, string | undefined> | undefined
  contenthash?: string | undefined
  signature: {
    message: string
    hash: string
  }
}

export interface JobPostRequest {
  title: string
  author: string
  description?: string
  image_url?: string
  candidates?: string[]
  expiry_date?: string
  website_url?: string
}
