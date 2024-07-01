import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function PATCH(req: NextRequest) {
  try {
    const { workoutId, rating, status } = await req.json();

    // Update the workout status and rating in the Supabase database
    const { error } = await supabase
      .from('workouts')
      .update({ workout_rating: rating, workout_status: status })
      .eq('id', workoutId);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ message: 'Error updating workout', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Workout updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
  }
}
