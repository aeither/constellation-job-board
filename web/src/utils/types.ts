type Address = {
  [key: string]: string
}

type Texts = {
  description: string
}

export type OwnerData = {
  name: string
  owner: string
  addresses: Address
  texts: Texts
  createdAt: string
  updatedAt: string
}
