import {
  BlobClient,
  BlobServiceClient,
  BlockBlobUploadOptions,
  BlockBlobUploadResponse,
  ContainerClient,
} from '@azure/storage-blob'

export type UploadFileResponse = {
  status: string
  response?: BlockBlobUploadResponse
  fileKey?: string
  fileName?: string
  error?: string
}

const account = process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_NAME || ''
const SASToken = process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_SAS_TOKEN || ''
const containerName =
  process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_CONTAINER_NAME || ''

if (!account || !SASToken || !containerName)
  throw Error('Azure storage account credentials not found!')

const blobServiceClient: BlobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net${SASToken}`
)

const container: ContainerClient =
  blobServiceClient.getContainerClient(containerName)

export async function uploadFile(blob: File): Promise<UploadFileResponse> {
  try {
    const fileKey: string = `${Date.now()}-${blob.name.replace(' ', '-')}`

    const { response } = await container.uploadBlockBlob(
      fileKey,
      blob,
      0,
      {} satisfies BlockBlobUploadOptions
    )

    return {
      status: 'ok',
      response,
      fileKey,
      fileName: blob.name,
    }
  } catch (error) {
    console.error(error)
    return { status: 'failed', error }
  }
}
