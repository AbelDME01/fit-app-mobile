import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PersonalRecord {
  id?: string;
  exerciseId: number;
  exerciseName?: string;
  value: number;
  unit: 'kg' | 'reps' | 'seconds';
  achievedAt: string;
  previousValue?: number;
  improvement?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private api = inject(ApiService);

  getRecords(filter?: 'all' | 'strength' | 'cardio'): Observable<PersonalRecord[]> {
    const params: Record<string, string> = {};
    if (filter && filter !== 'all') {
      params['type'] = filter;
    }
    return this.api.get<PersonalRecord[]>('records', params);
  }

  getRecordsByExercise(exerciseId: number): Observable<PersonalRecord[]> {
    return this.api.get<PersonalRecord[]>(`records/${exerciseId}`);
  }

  createRecord(record: Omit<PersonalRecord, 'id'>): Observable<PersonalRecord> {
    return this.api.post<PersonalRecord>('records', record);
  }

  getRecordHistory(exerciseId: number): Observable<PersonalRecord[]> {
    return this.api.get<PersonalRecord[]>(`records/history/${exerciseId}`);
  }
}
