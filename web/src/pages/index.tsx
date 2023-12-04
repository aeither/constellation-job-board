import { Button, Heading, Input, Typography } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Card, Form, Helper, Link } from '@/styles'
import { JobPostRequest } from '@/types'
import { WORKER_URL } from '@/utils/contants'
import { OwnerData } from '@/utils/types'

export default function App() {
  const address = useAccount()
  const { data: ownerData } = useFetch<OwnerData>(
    `${WORKER_URL}/owner/${address}`
  )

  return (
    <>
      <Head>
        <title>Offchain ENS Registrar</title>
        <meta property="og:title" content="Offchain ENS Registrar" />
        <meta
          name="description"
          content="Quick demo of how offchain ENS names work"
        />
        <meta
          property="og:description"
          content="Quick demo of how offchain ENS names work"
        />
      </Head>

      <Heading>Profile</Heading>
      {ownerData && (
        <>
          <Typography>{ownerData.name}</Typography>
          <Typography>{ownerData.texts.description}</Typography>
        </>
      )}

      <JobCard creator={'ttt'} />
      <Footer />
    </>
  )
}

const JobCard = ({ creator }: { creator: string }) => {
  const { address } = useAccount()

  const [name, setName] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const regex = new RegExp('^[a-z0-9-]+$')
  const debouncedName = useDebounce(creator, 500)
  const enabled = !!debouncedName && regex.test(debouncedName)

  const [jobs, setJobs] = useLocalStorage('jobPosts', [
    {
      id: 0,
      title: 'Software Developer',
      candidates: [''],
      creator: creator,
      createdAt: new Date(),
    },
  ])

  const addJob = () => {
    setJobs((prevValue) => {
      return [
        ...prevValue,
        {
          id: prevValue.length,
          title: 'Software Developer',
          candidates: [''],
          creator: creator,
          createdAt: new Date(),
        },
      ]
    })
  }

  const updateCandidates = (jobIndex: number, newCandidates: any[]) => {
    setJobs((prevJobs) => {
      // Create a new array with the updated object
      const updatedJobs = prevJobs.map((job, index) => {
        if (index === jobIndex) {
          // Update the candidates array for the specific job
          return {
            ...job,
            candidates: newCandidates,
          }
        }
        // Return the unchanged object for other jobs
        return job
      })

      return updatedJobs
    })
  }

  return (
    <>
      <Heading>Job Board</Heading>
      <Card>
        <ConnectButton showBalance={false} />

        <Form
          onSubmit={(e) => {
            e.preventDefault()

            addJob()
          }}
        >
          <Input
            type="text"
            label="Title"
            placeholder="Sotware Developer"
            required
            disabled={!address}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            label="Description"
            placeholder="fullstack developer in defi space"
            disabled={!address}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" disabled={!enabled}>
            Register
          </Button>
        </Form>
      </Card>

      {jobs.map((job) => (
        <>
          <Card>
            <Heading>{job.title}</Heading>
            <Typography>Created by {job.creator}</Typography>
            {job.candidates.map((candidate) => (
              <Typography>{candidate}</Typography>
            ))}
            <Button
              onClick={() => {
                updateCandidates(job.id, [...job.candidates, address])
              }}
            >
              Apply
            </Button>
          </Card>
        </>
      ))}
    </>
  )
}
