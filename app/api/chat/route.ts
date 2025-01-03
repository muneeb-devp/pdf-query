import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { getContext } from '@/lib/context'
import { db } from '@/lib/db'
import { chats, messages as _messages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()
    const allChats = await db.select().from(chats).where(eq(chats.id, chatId))

    if (allChats.length !== 1)
      return NextResponse.json({ error: 'chat not found' }, { status: 404 })

    // Only 3 free queries in free tier
    if (messages.filter((msg: Message) => msg.role === 'user').length > 3)
      return NextResponse.json({ error: 'free tier limit reached' }, { status: 402, statusText: 'Payment Required' })

    const fileKey = allChats[0].fileKey
    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, fileKey.replace(/[^\x00-\x7F]+/g, ''))

    const prompt = {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        prompt,
        ...messages.filter((msg: Message) => msg.role === 'user'),
      ],
      stream: true,
    })

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // Save user msg to DB
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: 'user',
        })
      },
      onCompletion: async completion => {
        // Save AI msg to DB
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: 'system',
        })
      },
    })
    return new StreamingTextResponse(stream)
  } catch (error) {
    return new Response('failed', { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams }: { searchParams: URLSearchParams } = new URL(req.url)
  const userId: string | null = searchParams.get('userId')
  if (!userId) {
    return NextResponse.redirect(`${process.env.BASE_URL}`)
  }
  const lastChat: { id: number }[] = await db.select()
    .from(chats)
    .where(
      eq(chats.userId, userId)
    ).orderBy(desc(chats.createdAt))
    .limit(1)

  if (lastChat.length !== 0) {
    return NextResponse.redirect(`${process.env.BASE_URL}/chat/${lastChat[0].id}`)
  }

  return NextResponse.redirect(`${process.env.BASE_URL}`)
}