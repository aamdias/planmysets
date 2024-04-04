import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    if (req.url) {
      try {
        // Generate a unique timestamp for each request
        const timestamp = new Date().toISOString();
  
        // Ask OpenAI for a streaming completion given the prompt
        // The prompt includes the timestamp to ensure uniqueness
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          temperature: 1.3,
          response_format: { type: "json_object" },
          messages: [
            {"role": "system", "content": `
            You are an experienced gym coach and your job is suggest a 45min full-body gym
            workout based on the following equipment available:
            Dumbbells; Barbells; Cable Crossover machine; Bench Press; 
            adjustable bench; Lat Pull Down machine; Ab Roller; Leg Extension machine; 
            Treadmill and spin bike. 
            
            You anser should ALWAYS be a list of exercises in a JSON format. 
            Each exercise is an object with the following type, as defined in TS:

            type Exercise = {
                name: string;
                sets: number;
                reps: number;
                image?: string; // Optional URL to an image for the exercise
              }

            And the output should match this data schema:

            {
                "exercises": [
                    {
                    "name": "Barbell Squat",
                    "sets": 3,
                    "reps": 12,
                    "image": "https://example.com/barbellsquat.jpg"
                    },
                    {
                    "name": "Dumbbell Shoulder Press",
                    "sets": 3,
                    "reps": 12,
                    "image": "https://example.com/dumbbellshoulderpress.jpg"
                    }
                ]
            }

            Please try to make an effective and fun workout plan.
            
            [Timestamp: ${timestamp}]`},
            {"role": "user", "content": "Suggest me a gym workout"}
          ]
        });
  
        const suggestedWorkout = response.choices[0].message.content;
        if (suggestedWorkout) {
          const formatJSON = JSON.parse(suggestedWorkout.replace(/\n\s+/g, ''));
          return NextResponse.json({ message: "Success", formatJSON }, { status: 200 });
        }
      } catch (error) {
        return NextResponse.json({ message: "Error", error }, {
          status: 500
        });
      }
    }
}