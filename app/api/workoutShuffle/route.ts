import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
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

    // If availableEquipement is defeaultItems, then store the list of labels of the defaultItems const in a variable, otherwise, store the list of labels of the fullGymItems const
    const avaibableItems = requestBody.avaibableEquipement === 'defaultItems' ? defaultItems.map(item => item.label).join('; ') : fullGymItems.map(item => item.label).join('; ');
  
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


    console.log('Exercise Name:', exerciseName);
    console.log('Current Exercise List:', currentExerciseList);
    console.log('Available Items:', avaibableItems);
  
    try {

      // Defining the System prompt
      const prompt = `
      You're an experienced Gym Coach. 
      You'll be tasked to suggest a replacement gym exercise given a:
      1. The current exercise the user is doing, which is ${exerciseName}.
      2. The current list of exercises, which is ${currentExerciseList}.
      
      Your suggestion should follow these criteria:
      1. The suggested exercise should be different from the exercise given by the user.
      2. The suggested exercise should be one of the options that are available in the object ${avaibableItems}.
      3. The suggested exercise should target the same muscle as the exercise given by the user.
      4. The suggested exercise should be different from the other exercises in the current list of exercises, which is ${currentExerciseList}.
      5. Your answer should be in Portuguese - Brazil.

      The output should be a JSON object with this data schema:
      {
          "suggestedExercise": [
          {
              "name": "Agachamento", // In portuguese - brazil
              "sets": 3,
              "reps": 12,
              "duration": 10,  // Exercise duration in minutes
              "muscleGroup": "Pernas", // Muscle group targeted by the exercise
          }
      }
      Your answer should always be contained in 150 tokens. No need to thank the user,
      just provide the JSON object with the suggested exercise
    `;

      // Generate explanation text
      const textResponse = await openai.chat.completions.create({
        model: 'gpt-4o', // or the latest available model
        response_format: { type: "json_object" },
        messages: [
            {"role": "system", "content": prompt},
            {"role": "user", "content": `Quero um exercísio de academia que substitua o meu atual exercício, mantendo o grupo muscular.`}
          ],
        max_tokens: 150,
      });

      console.log('Prompt:', prompt)

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