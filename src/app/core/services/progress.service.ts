import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ProgressSummary {
  totalWorkouts: number;
  totalTime: number;
  averagePerWeek: number;
}

export interface WeeklyProgress {
  labels: string[];
  data: number[];
}

export interface Goal {
  id?: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private api = inject(ApiService);

  getSummary(): Observable<ProgressSummary> {
    return this.api.get<ProgressSummary>('progress/summary');
  }

  getWeeklyProgress(): Observable<WeeklyProgress> {
    return this.api.get<WeeklyProgress>('progress/weekly');
  }

  getMonthlyProgress(): Observable<WeeklyProgress> {
    return this.api.get<WeeklyProgress>('progress/monthly');
  }

  getYearlyProgress(): Observable<WeeklyProgress> {
    return this.api.get<WeeklyProgress>('progress/yearly');
  }

  getGoals(): Observable<Goal[]> {
    return this.api.get<Goal[]>('progress/goals');
  }

  createGoal(goal: Omit<Goal, 'id' | 'completed'>): Observable<Goal> {
    return this.api.post<Goal>('progress/goals', goal);
  }

  updateGoal(id: string, goal: Partial<Goal>): Observable<Goal> {
    return this.api.patch<Goal>(`progress/goals/${id}`, goal);
  }
}
