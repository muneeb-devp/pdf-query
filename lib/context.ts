import { PineconeClient } from '@pinecone-database/pinecone'
import { convertToASCII } from './utils'
import { getEmbeddings } from './embeddings'

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new PineconeClient()
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENV!,
  })

  const index = await pinecone.Index(process.env.PINECONE_INDEX!)

  try {
    const namespace = convertToASCII(fileKey)
    const queryResult = await index.query({
      queryRequest: {
        topK: 5,
        vector: embeddings,
        includeMetadata: true,
        namespace,
      },
    })

    return queryResult.matches || []
  } catch (error) {
    console.error('Error querying embeddings!', error)
    throw error
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

  const qualifyingDocs = matches.filter(
    match => match.score && match.score > 0.7
  )

  type MetaData = {
    text: string
    pageNumber: number
  }

  let docs = qualifyingDocs.map(match => (match.metadata as MetaData).text)
  return docs.join('\n').substring(0, 3_000)
}
