import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WorkoutExercise } from './workout.service';

export interface WorkoutTemplate {
  id?: string;
  name: string;
  description?: string;
  workoutTypeId: number;
  exercises: WorkoutExercise[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  workoutTypeId: number;
  exercises: WorkoutExercise[];
  isPublic?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplateService {
  private api = inject(ApiService);

  getTemplates(): Observable<WorkoutTemplate[]> {
    return this.api.get<WorkoutTemplate[]>('workout-templates');
  }

  getTemplate(id: string): Observable<WorkoutTemplate> {
    return this.api.get<WorkoutTemplate>(`workout-templates/${id}`);
  }

  createTemplate(template: CreateTemplateDto): Observable<WorkoutTemplate> {
    return this.api.post<WorkoutTemplate>('workout-templates', template);
  }

  updateTemplate(id: string, template: Partial<WorkoutTemplate>): Observable<WorkoutTemplate> {
    return this.api.patch<WorkoutTemplate>(`workout-templates/${id}`, template);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.api.delete<void>(`workout-templates/${id}`);
  }

  searchTemplates(query: string): Observable<WorkoutTemplate[]> {
    return this.api.get<WorkoutTemplate[]>('workout-templates/search', { q: query });
  }
}
