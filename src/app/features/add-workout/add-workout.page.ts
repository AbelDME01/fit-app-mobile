import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonSpinner,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, saveOutline, addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { WorkoutService, Workout, WorkoutExercise } from '@core/services/workout.service';
import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component';

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
export class AddWorkoutPage implements OnInit {
  private workoutService = inject(WorkoutService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);

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
  exerciseNames = signal<Record<number, string>>({});
  saving = signal(false);
  workoutId = signal<string | null>(null);
  isEditMode = computed(() => !!this.workoutId());

  constructor() {
    addIcons({ arrowBack, saveOutline, addOutline, trashOutline, createOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workoutId.set(id);
      this.loadWorkout(id);
    }
  }

  loadWorkout(id: string): void {
    this.workoutService.getWorkout(id).subscribe({
      next: (workout) => {
        this.workoutName.set(workout.name);
        this.selectedTypeId.set(workout.workoutTypeId);
        this.exercises.set(workout.exercises);
        const names: Record<number, string> = {};
        workout.exercises.forEach((ex, i) => {
          if (ex.exercise?.name) {
            names[i] = ex.exercise.name;
          }
        });
        this.exerciseNames.set(names);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al cargar el entrenamiento',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        this.router.navigate(['/tabs/workouts']);
      }
    });
  }

  updateExercise(index: number, field: keyof WorkoutExercise, value: number | string): void {
    this.exercises.update(exercises => {
      const updated = [...exercises];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  async openExerciseEditor(index: number): Promise<void> {
    const modal = await this.modalController.create({
      component: ExerciseEditorComponent,
      componentProps: {
        exercise: this.exercises()[index],
        exerciseIndex: index
      },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data) {
      this.exercises.update(exercises => {
        const updated = [...exercises];
        updated[data.index] = {
          ...updated[data.index],
          sets: data.data.sets,
          reps: data.data.reps,
          weight: data.data.weight,
          restSeconds: data.data.restSeconds,
          notes: data.data.notes
        };
        return updated;
      });
      this.exerciseNames.update(names => ({
        ...names,
        [data.index]: data.data.name
      }));
    }
  }

  getExerciseName(index: number): string {
    return this.exerciseNames()[index] || '';
  }

  updateExerciseName(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.exerciseNames.update(names => ({
      ...names,
      [index]: value
    }));
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
    this.router.navigate(['/tabs/workouts']);
  }

  cancel(): void {
    this.router.navigate(['/tabs/workouts']);
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

    const saveOperation = this.isEditMode()
      ? this.workoutService.updateWorkout(this.workoutId()!, workout)
      : this.workoutService.createWorkout(workout);

    saveOperation.subscribe({
      next: async () => {
        const message = this.isEditMode()
          ? 'Entrenamiento actualizado correctamente'
          : 'Entrenamiento guardado correctamente';
        const toast = await this.toastController.create({
          message,
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/tabs/workouts']);
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
