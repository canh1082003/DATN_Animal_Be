// install thêm nếu chưa có
// npm install openai
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_DOG_APIKEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}
