import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { request } from 'http';
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    const exerciseName = requestBody.exerciseName;
    const currentExerciseList = requestBody.currentExerciseList;
  
    // Check is exerciseName is not empty
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

    // Check if currentExerciseList is not empty
    if (!currentExerciseList) {
        return new NextResponse(
            JSON.stringify({ error: 'Current exercise list is required' }),
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
        model: 'gpt-4o', // or the latest available model
        response_format: { type: "json_object" },
        messages: [
            {"role": "system", "content": `
            You're an experienced Gym Coach. 
            You'll be tasked to suggest a replacement gym exercise given a:
            1. The current exercise the user is doing, which is ${exerciseName}.
            2. The current list of exercises, which is ${currentExerciseList}.
            
            Your suggestion should follow these criteria:
            1. The suggested exercise should be different from the exercise given by the user.
            2, The suggested exercise should be one of the options that are available in the object ${defaultItems}.
            3. The suggested exercise should target the same muscle as the exercise given by the user.
            4. The suggested exercise should be different from the other exercises in the current list of exercises, which is ${currentExerciseList}.

            The output should be a JSON object with this data schema:
            {
                "suggestedExercise": [
                {
                    "name": "Barbell Squat",
                    "sets": 3,
                    "reps": 12,
                    "duration": 10  // Exercise duration in minutes
                }
            }
            Your answer should always be contained in 150 tokens. No need to thank the user,
            just provide the JSON object with the suggested exercise`},
            {"role": "user", "content": `I want a gym workout exercise replacement for my current exercise.`}
          ],
        max_tokens: 150,
      });

      const suggestedWorkout = textResponse.choices[0].message.content;

      return new NextResponse(
        JSON.stringify({ suggestedWorkout }),
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