import { downloadFromAzureBlobStorage } from '@/lib/azureBlobStorage.server'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { loadAzureBlobIntoPinecone } from '@/lib/pinecone'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { fileKey, fileName } = body
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    console.log(fileKey, fileName)
    await loadAzureBlobIntoPinecone(fileKey)
    const { fileName: tmpFileName } = await downloadFromAzureBlobStorage(
      fileKey
    )
    const chatId = await db
      .insert(chats)
      .values({
        fileKey,
        pdfName: fileName || '',
        pdfUrl: tmpFileName || '',
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      })

    return NextResponse.json(
      { message: 'success', chatId: chatId[0].insertedId },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
