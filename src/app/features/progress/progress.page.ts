import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';
import { ProgressService, ProgressSummary, WeeklyProgress, Goal } from '@core/services/progress.service';

type TimeFilter = 'weekly' | 'monthly' | 'yearly';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './progress.page.html',
  styleUrl: './progress.page.scss'
})
export class ProgressPage implements OnInit {
  private progressService = inject(ProgressService);

  timeFilters: { id: TimeFilter; label: string }[] = [
    { id: 'weekly', label: 'Semana' },
    { id: 'monthly', label: 'Mes' },
    { id: 'yearly', label: 'Año' }
  ];

  activeTimeFilter = signal<TimeFilter>('monthly');
  summary = signal<ProgressSummary | null>(null);
  chartData = signal<WeeklyProgress | null>(null);
  goals = signal<Goal[]>([]);
  loading = signal(true);

  constructor() {
    addIcons({ calendarOutline });
  }

  ngOnInit(): void {
    this.loadData();
  }

  setTimeFilter(filter: TimeFilter): void {
    this.activeTimeFilter.set(filter);
    this.loadChartData();
  }

  private loadData(): void {
    this.loading.set(true);

    this.progressService.getSummary().subscribe({
      next: (summary) => this.summary.set(summary),
      error: () => this.summary.set({ totalWorkouts: 0, totalTime: 0, averagePerWeek: 0 })
    });

    this.loadChartData();

    this.progressService.getGoals().subscribe({
      next: (goals) => {
        this.goals.set(goals);
        this.loading.set(false);
      },
      error: () => {
        this.goals.set([]);
        this.loading.set(false);
      }
    });
  }

  private loadChartData(): void {
    const filter = this.activeTimeFilter();
    let observable;

    switch (filter) {
      case 'weekly':
        observable = this.progressService.getWeeklyProgress();
        break;
      case 'yearly':
        observable = this.progressService.getYearlyProgress();
        break;
      default:
        observable = this.progressService.getMonthlyProgress();
    }

    observable.subscribe({
      next: (data) => this.chartData.set(data),
      error: () => this.chartData.set({ labels: [], data: [] })
    });
  }

  getBarHeight(value: number): number {
    const maxValue = Math.max(...(this.chartData()?.data || [1]));
    return (value / maxValue) * 100;
  }

  getGoalProgress(goal: Goal): number {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  }

  formatGoalProgress(goal: Goal): string {
    return `${goal.currentValue}/${goal.targetValue}${goal.unit}`;
  }
}
