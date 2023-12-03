import { Button, Input } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { Card, Form, Helper, Link, Spacer } from '@/styles'
import { WorkerRequest } from '@/types'

const abi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'resolve',
    outputs: [
      {
        internalType: 'bytes',
        name: 'result',
        type: 'bytes',
      },
      {
        internalType: 'uint64',
        name: 'expires',
        type: 'uint64',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export default function App() {
  const { address } = useAccount()

  const [name, setName] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const regex = new RegExp('^[a-z0-9-]+$')
  const debouncedName = useDebounce(name, 500)
  const enabled = !!debouncedName && regex.test(debouncedName)

  const { data, isLoading, signMessage, variables } = useSignMessage()

  const requestBody: WorkerRequest = {
    name: `${debouncedName}.offchaindemo.eth`,
    owner: address!,
    addresses: { '60': address },
    texts: { description }, // { description: 'Your portable web3 profile', avatar, url, twitter, github, telegram, discord }
    signature: {
      hash: data!,
      message: variables?.message!,
    },
  }

  const {
    data: gatewayData,
    error: gatewayError,
    isLoading: gatewayIsLoading,
  } = useFetch(data && 'https://ens-gateway.thp76fmkkf.workers.dev/set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const generateLookupParams = async () => {
    const name = ethers.utils.toUtf8Bytes('test')
    const data = ethers.utils.toUtf8Bytes('exampleData')

    const iface = new ethers.utils.Interface(abi)
    const sigHash = iface.getSighash('resolve')
    console.log(
      '🚀 ~ file: index.tsx:89 ~ generateLookupParams ~ sigHash:',
      sigHash
    )
    const calldata = iface.encodeFunctionData('resolve', [name, data])
    console.log(
      '🚀 ~ file: index.tsx:94 ~ generateLookupParams ~ calldata:',
      calldata
    )

    // const name = ethers.utils.toUtf8Bytes('exampleName')
    // const data = ethers.utils.toUtf8Bytes('exampleData')

    // // Your input string
    // const inputString = 'Hello, World!'

    // // Create a TextEncoder instance
    // const textEncoder = new TextEncoder()

    // // Convert the string to bytes
    // const byteArray = textEncoder.encode(inputString)

    // // Log the result
    // console.log(byteArray)

    // const iface = new ethers.utils.Interface(abi)
    // const calldata = iface.encodeFunctionData('resolve', [name, data])
    // console.log(
    //   '🚀 ~ file: index.tsx:104 ~ generateLookupParams ~ calldata:',
    //   calldata
    // )
  }

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

      <Spacer />

      <Card>
        <ConnectButton showBalance={false} />

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            signMessage({
              message: `Register ${debouncedName}.offchaindemo.eth`,
            })
          }}
        >
          <Input
            type="text"
            label="Name"
            suffix=".offchaindemo.eth"
            placeholder="ens"
            required
            disabled={!!data || !address}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            label="Description"
            placeholder="Your portable web3 profile"
            disabled={!!data || !address}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            type="submit"
            disabled={!enabled || !!data}
            loading={isLoading || gatewayIsLoading}
          >
            Register
          </Button>
        </Form>

        {gatewayError ? (
          <Helper type="error">
            {gatewayError.message === 'Conflict'
              ? 'Somebody already registered that name'
              : 'Something went wrong'}
          </Helper>
        ) : gatewayData ? (
          <Helper>
            <p>
              Visit the{' '}
              <Link href={`https://ens.app/${debouncedName}.offchaindemo.eth`}>
                ENS Manager
              </Link>{' '}
              to see your name
            </p>
          </Helper>
        ) : !!debouncedName && !enabled ? (
          <Helper type="error">Name must be lowercase alphanumeric</Helper>
        ) : null}
      </Card>

      <Button
        onClick={() => {
          // const el = {
          //   name: `${debouncedName}.offchaindemo.eth`,
          //   owner: address!,
          //   addresses: { '60': address },
          //   texts: { description },
          //   signature: {
          //     hash: data!,
          //     message: variables?.message!,
          //   },
          // }
          // console.log(el)

          generateLookupParams()
        }}
      >
        Show Result
      </Button>

      <Footer />
    </>
  )
}
