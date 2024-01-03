import { createEmbeddingsTable } from './insert'
import { NextResponse } from 'next/server'

export const maxDuration = 300; // This function can run for a maximum of 5 seconds

export async function POST(req: Request) {
  const { url, level } = await req.json()
  try {
    const name = await createEmbeddingsTable(url, level)
    return NextResponse.json({ table: name })
  } catch (e) {
    console.log(e)
    return NextResponse.json(e, {
      status: 400
    })
  }
}
