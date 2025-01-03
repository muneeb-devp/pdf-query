import {
  BlobClient,
  BlobDownloadResponseParsed,
  BlobServiceClient,
  ContainerClient,
} from '@azure/storage-blob'

type BlobStorageFileDownloadResponse = {
  status: string
  fileName?: string
  response?: BlobDownloadResponseParsed
  error?: string
}

export async function downloadFromAzureBlobStorage(
  fileKey: string
): Promise<BlobStorageFileDownloadResponse> {
  try {
    const account = process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_NAME || ''
    const SASToken = process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_SAS_TOKEN || ''
    const containerName =
      process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_CONTAINER_NAME || ''

    if (!account || !SASToken || !containerName)
      throw Error('Azure storage account credentials not found!')

    const blobServiceClient: BlobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net/${containerName}?${SASToken}`
    )

    const container: ContainerClient =
      blobServiceClient.getContainerClient(containerName)
    const blob: BlobClient = container.getBlobClient(fileKey)
    const tmpFileName: string = `./public/tmp/pdf-${Date.now()}.pdf`

    const response: BlobDownloadResponseParsed = await blob.downloadToFile(
      tmpFileName,
      0,
      undefined
    )

    return {
      status: 'ok',
      response,
      fileName: tmpFileName,
    }
  } catch (error) {
    return {
      status: 'error',
      error,
    }
  }
}
