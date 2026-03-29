import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSpinner,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  createOutline,
  trashOutline,
  barbellOutline,
  heartOutline,
  flashOutline,
  playCircleOutline,
  searchOutline
} from 'ionicons/icons';
import { takeUntil } from 'rxjs/operators';
import { WorkoutTemplateService, WorkoutTemplate } from '@core/services/workout-template.service';
import { DestroyService } from '@core/services/destroy.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSpinner
  ],
  providers: [DestroyService],
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss']
})
export class TemplatesPage implements OnInit {
  private templateService = inject(WorkoutTemplateService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private readonly destroy = inject(DestroyService);

  templates = signal<WorkoutTemplate[]>([]);
  filteredTemplates = signal<WorkoutTemplate[]>([]);
  loading = signal(true);
  searchQuery = signal('');

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
    addIcons({
      add,
      createOutline,
      trashOutline,
      barbellOutline,
      heartOutline,
      flashOutline,
      playCircleOutline,
      searchOutline
    });
  }

  ngOnInit() { /* intentionally empty - data loaded in ionViewWillEnter */ }

  ionViewWillEnter() {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading.set(true);
    this.templateService.getTemplates().pipe(takeUntil(this.destroy)).subscribe({
      next: (templates) => {
        this.templates.set(templates);
        this.filteredTemplates.set(templates);
        this.loading.set(false);
      },
      error: async () => {
        this.loading.set(false);
        const toast = await this.toastController.create({
          message: 'Error al cargar las plantillas',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  handleSearch(event: CustomEvent): void {
    const query = (event.detail.value || '').toLowerCase();
    this.searchQuery.set(query);

    if (!query.trim()) {
      this.filteredTemplates.set(this.templates());
      return;
    }

    const filtered = this.templates().filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query)
    );
    this.filteredTemplates.set(filtered);
  }

  getTypeIcon(typeId: number): string {
    return this.workoutTypeIcons[typeId] || 'barbell-outline';
  }

  getTypeName(typeId: number): string {
    return this.workoutTypeNames[typeId] || 'Entrenamiento';
  }

  createTemplate(): void {
    this.router.navigate(['/template-detail', 'new']);
  }

  editTemplate(id: string): void {
    this.router.navigate(['/template-detail', id]);
  }

  async useTemplate(template: WorkoutTemplate): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Usar plantilla',
      message: `¿Crear un nuevo entrenamiento usando "${template.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: () => {
            this.router.navigate(['/add-workout'], {
              state: { templateData: template }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDelete(template: WorkoutTemplate): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar plantilla',
      message: `¿Seguro que deseas eliminar "${template.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteTemplate(template.id!);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteTemplate(id: string): void {
    this.templateService.deleteTemplate(id).pipe(takeUntil(this.destroy)).subscribe({
      next: async () => {
        this.templates.update(templates => templates.filter(t => t.id !== id));
        this.filteredTemplates.update(templates => templates.filter(t => t.id !== id));
        const toast = await this.toastController.create({
          message: 'Plantilla eliminada',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al eliminar la plantilla',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
