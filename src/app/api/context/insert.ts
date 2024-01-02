import { connect, OpenAIEmbeddingFunction } from 'vectordb';
import { getDomObjects } from './scrape';
import crypto from 'crypto';
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";



export async function createEmbeddingsTable(url: string, pages: number | undefined) {

  const vercelPostgresStore = await VercelPostgres.initialize(new OpenAIEmbeddings(), {
    postgresConnectionOptions: {
      connectionString:
        "postgres://default:CSst0j4xUAVp@ep-polished-rain-57003748.us-east-1.postgres.vercel-storage.com:5432/verceldb",
    },
  });
  const db = await connect('/tmp/website-lancedb')
  // You need to provide an OpenAI API key, here we read it from the OPENAI_API_KEY environment variable
  const apiKey = process.env.OPENAI_API_KEY ?? ''


  // The embedding function will create embeddings for the 'context' column
  const embedFunction = new OpenAIEmbeddingFunction('context', apiKey)
  const data = contextualize(await getDomObjects(url, pages), 5, 'link')
  const batchSize = 500;
  
  for (var i = batchSize; i < data.length; i += batchSize) {
    const ids = await vercelPostgresStore.addDocuments(data.slice(0, Math.min(batchSize, data.length)).map((d: any) => ({ pageContent: d. })));
  }
  return tbl.name
}

// Each article line has a small text column, we include previous lines in order to
// have more context information when creating embeddings
function contextualize(rows: Entry[], contextSize: number, groupColumn: string): EntryWithContext[] {
  const grouped: { [key: string]: any } = []
  rows.forEach(row => {
    if (!grouped[row[groupColumn]]) {
      grouped[row[groupColumn]] = []
    }
    grouped[row[groupColumn]].push(row)
  })

  const data: EntryWithContext[] = []
  Object.keys(grouped).forEach(key => {
    for (let i = 0; i < grouped[key].length; i++) {
      const start = i - contextSize > 0 ? i - contextSize : 0
      grouped[key][i].context = grouped[key].slice(start, i + 1).map((r: Entry) => r.text).join(' ')
    }
    data.push(...grouped[key])
  })
  return data
}
