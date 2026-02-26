import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RecordsService, PersonalRecord } from '@core/services/records.service';

type FilterType = 'all' | 'strength' | 'cardio';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './records.page.html',
  styleUrl: './records.page.scss'
})
export class RecordsPage implements OnInit {
  private recordsService = inject(RecordsService);

  filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'strength', label: 'Fuerza' },
    { id: 'cardio', label: 'Cardio' }
  ];

  activeFilter = signal<FilterType>('all');
  records = signal<PersonalRecord[]>([]);
  loading = signal(true);

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
    this.loadRecords();
  }

  private loadRecords(): void {
    this.loading.set(true);
    this.recordsService.getRecords(this.activeFilter()).subscribe({
      next: (records) => {
        this.records.set(records);
        this.loading.set(false);
      },
      error: () => {
        this.records.set([]);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  }

  getImprovement(record: PersonalRecord): string {
    if (!record.previousValue) return '';
    const diff = record.value - record.previousValue;
    const prefix = diff > 0 ? '+' : '';
    return `${prefix}${diff}${record.unit} desde anterior`;
  }
}
