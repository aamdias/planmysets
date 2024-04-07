import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    const exerciseName = requestBody.exerciseName;
  
    if (!exerciseName) {
      return new NextResponse(
        JSON.stringify({ error: 'Exercise name is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  
    try {
      // Generate explanation text
      const textResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106', // or the latest available model
        messages: [
            {"role": "system", "content": `
            You're an experienced Gym Coach. You'll be tasked to explain how to properly 
            execute a given exercise. Please always answer in a helpfull and friendly manner.
            Your answer should always be contained in 150 tokens. No need to thank the user,
            just provide a clear explanation`},
            {"role": "user", "content": `Explain how to properly perform the gym workout named "${exerciseName}" in detail.`}
          ],
        max_tokens: 150,
      });

      // Generate image
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create an illustration showing a person performing ${exerciseName} in a gym setting.Emphasize proper form. Ensure the image is clear and suitable for instructional use, focusing on accuracy and safety. Tthis image should have a 1.4:1 aspect ratio`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      const explanation = textResponse.choices[0].message.content;
      const imageUrl = imageResponse.data[0].url;
  
      return new NextResponse(
        JSON.stringify({ explanation, imageUrl }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to generate content:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to generate content for the provided exercise' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
}