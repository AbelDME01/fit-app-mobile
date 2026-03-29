import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  workoutTypeId: number;
}

export interface WorkoutExercise {
  id?: string;
  exerciseId: number;
  exercise?: Exercise;
  orderIndex: number;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
}

export interface Workout {
  id?: string;
  name: string;
  workoutTypeId: number;
  scheduledDate?: string;
  completedAt?: string;
  durationMinutes?: number;
  notes?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutStats {
  totalSessions: number;
  totalTime: number;
  weeklyChange: number;
  timeChange: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private api = inject(ApiService);

  getWorkouts(): Observable<Workout[]> {
    return this.api.get<Workout[]>('workouts');
  }

  getWorkout(id: string): Observable<Workout> {
    return this.api.get<Workout>(`workouts/${id}`);
  }

  createWorkout(workout: Workout): Observable<Workout> {
    return this.api.post<Workout>('workouts', workout);
  }

  updateWorkout(id: string, workout: Partial<Workout>): Observable<Workout> {
    return this.api.patch<Workout>(`workouts/${id}`, workout);
  }

  deleteWorkout(id: string): Observable<void> {
    return this.api.delete<void>(`workouts/${id}`);
  }

  completeWorkout(id: string, durationMinutes: number): Observable<Workout> {
    return this.api.post<Workout>(`workouts/${id}/complete`, { durationMinutes });
  }

  getWeeklyStats(): Observable<WorkoutStats> {
    return this.api.get<WorkoutStats>('workouts/stats/weekly');
  }

  getRecentWorkouts(limit: number = 5): Observable<Workout[]> {
    return this.api.get<Workout[]>('workouts', { limit: limit.toString() });
  }
}
