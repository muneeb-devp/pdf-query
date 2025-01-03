import {
  Pinecone,
  PineconeRecord,
} from '@pinecone-database/pinecone'
import { downloadFromAzureBlobStorage } from './azureBlobStorage.server'
import {
  Document,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { getEmbeddings } from './embeddings'
import { convertToASCII } from './utils'
import md5 from 'md5'

export type PDFPage = {
  pageContent: string
  metadata: {
    loc: { pageNumber: number }
  }
}

let pinecone: Pinecone | null = null

export const getPineConeClient = async (): Promise<Pinecone> => {
  const pineconeAPIKey: string | undefined = process.env.PINECONE_API_KEY
  const pineconeEnv: string | undefined = process.env.PINECONE_ENV

  if (!pineconeAPIKey || !pineconeEnv)
    throw Error('Pinecone API credentials not found!')

  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: pineconeAPIKey
    })
  }

  return pinecone
}

export async function loadAzureBlobIntoPinecone(fileKey: string) {
  // Get the PDF
  const response = await downloadFromAzureBlobStorage(fileKey)
  const PINECONE_INDEX = process.env.PINECONE_INDEX || ''

  if (!response.fileName)
    throw new Error(`Failed to download file (${fileKey}) from Azure!`)

  const loader = new PDFLoader(response.fileName)
  const pages = (await loader.load()) as PDFPage[]

  // Split and segment the PDF into smaller documents
  const documents = await Promise.all(pages.map(prepareDocument))

  // vectorize and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument))
  // upload to pinecone
  const client = await getPineConeClient()
  const pineconeIndex = client.Index(PINECONE_INDEX)
  const namespace = pineconeIndex.namespace(convertToASCII(fileKey))

  await namespace.upsert(vectors)

  return documents[0]
}

export async function embedDocument(doc: Document): Promise<PineconeRecord> {
  try {
    const embeddings: number[] = await getEmbeddings(doc.pageContent)
    const hash = md5(doc.pageContent)

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const truncateStringByBytes = (str: string, bytes: number): string => {
  const encoder = new TextEncoder()
  return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes))
}

async function prepareDocument(page: PDFPage): Promise<Document[]> {
  let { pageContent, metadata } = page
  pageContent = pageContent.replace(/\n/g, '')
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter()
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36_000),
      },
    }),
  ])

  return docs
}
