import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, chevronForward, addOutline, trophyOutline } from 'ionicons/icons';
import { WorkoutService, Workout, WorkoutStats } from '@core/services/workout.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit {
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);

  stats = signal<WorkoutStats | null>(null);
  recentWorkouts = signal<Workout[]>([]);
  loading = signal(true);
  userName = signal('Usuario');

  constructor() {
    addIcons({ notificationsOutline, chevronForward, addOutline, trophyOutline });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadUserName();
  }

  private loadUserName(): void {
    const user = this.authService.currentUser;
    if (user?.user_metadata?.['full_name']) {
      const fullName = user.user_metadata['full_name'] as string;
      this.userName.set(fullName.split(' ')[0]);
    }
  }

  private loadData(): void {
    this.loading.set(true);

    this.workoutService.getWeeklyStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.stats.set({ totalSessions: 0, totalTime: 0, weeklyChange: 0, timeChange: 0 })
    });

    this.workoutService.getRecentWorkouts(3).subscribe({
      next: (workouts) => {
        this.recentWorkouts.set(workouts);
        this.loading.set(false);
      },
      error: () => {
        this.recentWorkouts.set([]);
        this.loading.set(false);
      }
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }

  getWorkoutTypeIcon(typeId: number): string {
    const icons: Record<number, string> = {
      1: 'barbell-outline',
      2: 'heart-outline',
      3: 'flash-outline'
    };
    return icons[typeId] || 'fitness-outline';
  }
}
