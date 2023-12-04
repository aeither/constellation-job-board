import { Typography } from '@ensdomains/thorin'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { useFetch } from '@/hooks/useFetch'
import { Link } from '@/styles'
import { WORKER_URL } from '@/utils/contants'
import { OwnerData } from '@/utils/types'

const Container = styled.footer`
  display: flex;
  gap: 1.5rem;
`

export function Footer() {
  const { address } = useAccount()
  const { data: ownerData } = useFetch<OwnerData>(
    `${WORKER_URL}/owner/${address}`
  )

  return (
    <Container>
      <a href="/">Home</a>

      <a href="/profile">Profile</a>

      {ownerData && (
        <Link href={`https://app.ens.domains/${ownerData.name}?tab=records`}>
          ENS Manager
        </Link>
      )}
    </Container>
  )
}
