import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, saveOutline, addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { WorkoutService, Workout, WorkoutExercise } from '@core/services/workout.service';

interface WorkoutType {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './add-workout.page.html',
  styleUrl: './add-workout.page.scss'
})
export class AddWorkoutPage {
  private workoutService = inject(WorkoutService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  workoutTypes: WorkoutType[] = [
    { id: 1, name: 'Fuerza', icon: 'barbell-outline' },
    { id: 2, name: 'Cardio', icon: 'heart-outline' },
    { id: 3, name: 'HIIT', icon: 'flash-outline' }
  ];

  workoutName = signal('');
  selectedTypeId = signal(1);
  exercises = signal<WorkoutExercise[]>([
    { exerciseId: 1, orderIndex: 0, sets: 4, reps: 10, notes: '', restSeconds: 60 }
  ]);
  saving = signal(false);

  constructor() {
    addIcons({ arrowBack, saveOutline, addOutline, trashOutline, createOutline });
  }

  selectType(typeId: number): void {
    this.selectedTypeId.set(typeId);
  }

  addExercise(): void {
    const currentExercises = this.exercises();
    this.exercises.set([
      ...currentExercises,
      {
        exerciseId: 0,
        orderIndex: currentExercises.length,
        sets: 3,
        reps: 10,
        notes: '',
        restSeconds: 60
      }
    ]);
  }

  removeExercise(index: number): void {
    const currentExercises = [...this.exercises()];
    currentExercises.splice(index, 1);
    this.exercises.set(currentExercises.map((ex, i) => ({ ...ex, orderIndex: i })));
  }

  goBack(): void {
    this.router.navigate(['/tabs/home']);
  }

  cancel(): void {
    this.router.navigate(['/tabs/home']);
  }

  async saveWorkout(): Promise<void> {
    if (!this.workoutName().trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, introduce un nombre para el entrenamiento',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.saving.set(true);

    const workout: Workout = {
      name: this.workoutName(),
      workoutTypeId: this.selectedTypeId(),
      exercises: this.exercises(),
      scheduledDate: new Date().toISOString()
    };

    this.workoutService.createWorkout(workout).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Entrenamiento guardado correctamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/tabs/home']);
      },
      error: async () => {
        this.saving.set(false);
        const toast = await this.toastController.create({
          message: 'Error al guardar el entrenamiento',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
