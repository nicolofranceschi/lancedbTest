'use client'
import Image from 'next/image'
import { useState } from 'react'
import Chat from './components/Chat'
import Form from './components/Form'
import lancedbLogo from '../../public/lancedb.svg'
import vercelLogo from '../../public/vercel.svg'


export default function Home() {
  

  const [state, setState] = useState<MainState>({
    chat: false,
    level: 0,
    website: "https://www.pineappsrl.com",
    table: '',
  })

  return (
    <main className="flex min-h-screen flex-col">
      {state.chat ? (
        <div className="flex h-full flex-grow flex-col justify-end items-center p-6 md:p-24">
          <Chat state={state} setState={setState} />
        </div>
      ) : (
        <div className="p-6 md:p-24">
          <div className="md:w-3/4">
            <div className="py-4 flex flex-row w-screen items-center space-x-3">
              <a href="https://lancedb.com" target="_blank"><Image src={lancedbLogo} className="h-5 md:h-8 w-auto" alt="LanceDB logo" /></a>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <a href="https://vercel.com" target="_blank"><Image src={vercelLogo} className="h-4 md:h-6 w-auto" alt="Vercel logo" /></a>
            </div>
            <h5 className="mb-2 text-4xl md:text-8xl font-bold tracking-tight text-gray-900">AI Chatbot with <span className="text-lancedb">any website</span></h5>
            <p className="block mb-5 text-xl font-normal text-gray-700">Use an AI chatbot with website context retrieved from a vector store like LanceDB. LanceDB is lightweight and can be <b>embedded directly into <a href="https://nextjs.org" target="_blank" className="inline-flex items-center font-medium text-lancedb hover:underline">
              Next.js</a></b>, with data stored on-prem. </p>
            <Form state={state} setState={setState} />
          </div>
        </div>
      )
      }
    </main>
  )
}