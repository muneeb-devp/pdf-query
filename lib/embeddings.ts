import { OpenAIApi, Configuration } from 'openai-edge'

const apiKey = process.env.OPEN_AI_SECRET_KEY || ''

if (!apiKey) throw new Error('OpenAI key not found')

const config = new Configuration({
  apiKey,
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    })

    const result = await response.json()

    return result.data[0].embedding as number[]
  } catch (error) {
    console.error(error)
    throw new Error('Error calling OpenAI embedding API.')
  }
}
