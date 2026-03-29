import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSpinner,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, barbellOutline, heartOutline, flashOutline } from 'ionicons/icons';
import { WorkoutService, Workout } from '@core/services/workout.service';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSpinner
  ],
  templateUrl: './workouts.page.html',
  styleUrl: './workouts.page.scss'
})
export class WorkoutsPage implements OnInit {
  private workoutService = inject(WorkoutService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  workouts = signal<Workout[]>([]);
  loading = signal(true);

  workoutTypeIcons: Record<number, string> = {
    1: 'barbell-outline',
    2: 'heart-outline',
    3: 'flash-outline'
  };

  workoutTypeNames: Record<number, string> = {
    1: 'Fuerza',
    2: 'Cardio',
    3: 'HIIT'
  };

  constructor() {
    addIcons({ add, createOutline, trashOutline, barbellOutline, heartOutline, flashOutline });
  }

  ngOnInit() {
    this.loadWorkouts();
  }

  ionViewWillEnter() {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.loading.set(true);
    this.workoutService.getWorkouts().subscribe({
      next: (workouts) => {
        this.workouts.set(workouts);
        this.loading.set(false);
      },
      error: async () => {
        this.loading.set(false);
        const toast = await this.toastController.create({
          message: 'Error al cargar los entrenamientos',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  getTypeIcon(typeId: number): string {
    return this.workoutTypeIcons[typeId] || 'barbell-outline';
  }

  getTypeName(typeId: number): string {
    return this.workoutTypeNames[typeId] || 'Entrenamiento';
  }

  addWorkout(): void {
    this.router.navigate(['/add-workout']);
  }

  editWorkout(id: string): void {
    this.router.navigate(['/edit-workout', id]);
  }

  async confirmDelete(workout: Workout): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar entrenamiento',
      message: `¿Seguro que deseas eliminar "${workout.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteWorkout(workout.id!);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteWorkout(id: string): void {
    this.workoutService.deleteWorkout(id).subscribe({
      next: async () => {
        this.workouts.update(workouts => workouts.filter(w => w.id !== id));
        const toast = await this.toastController.create({
          message: 'Entrenamiento eliminado',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al eliminar el entrenamiento',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
