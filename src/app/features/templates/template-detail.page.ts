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
import { WorkoutTemplateService, WorkoutTemplate } from '@core/services/workout-template.service';
import { WorkoutExercise } from '@core/services/workout.service';
import { ExerciseEditorComponent } from '../add-workout/exercise-editor/exercise-editor.component';

interface WorkoutType {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-template-detail',
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
  templateUrl: './template-detail.page.html',
  styleUrls: ['./template-detail.page.scss']
})
export class TemplateDetailPage implements OnInit {
  private templateService = inject(WorkoutTemplateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);

  workoutTypes: WorkoutType[] = [
    { id: 1, name: 'Fuerza', icon: 'barbell-outline' },
    { id: 2, name: 'Cardio', icon: 'heart-outline' },
    { id: 3, name: 'HIIT', icon: 'flash-outline' }
  ];

  templateName = signal('');
  templateDescription = signal('');
  selectedTypeId = signal(1);
  exercises = signal<WorkoutExercise[]>([
    { exerciseId: 1, orderIndex: 0, sets: 4, reps: 10, notes: '', restSeconds: 60 }
  ]);
  exerciseNames = signal<Record<number, string>>({});
  saving = signal(false);
  templateId = signal<string | null>(null);
  isEditMode = computed(() => this.templateId() !== null && this.templateId() !== 'new');

  constructor() {
    addIcons({ arrowBack, saveOutline, addOutline, trashOutline, createOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.templateId.set(id);
      this.loadTemplate(id);
    }
  }

  loadTemplate(id: string): void {
    this.templateService.getTemplate(id).subscribe({
      next: (template) => {
        this.templateName.set(template.name);
        this.templateDescription.set(template.description || '');
        this.selectedTypeId.set(template.workoutTypeId);
        this.exercises.set(template.exercises);
        const names: Record<number, string> = {};
        template.exercises.forEach((ex, i) => {
          if (ex.exercise?.name) {
            names[i] = ex.exercise.name;
          }
        });
        this.exerciseNames.set(names);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al cargar la plantilla',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        this.router.navigate(['/tabs/templates']);
      }
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
    this.router.navigate(['/tabs/templates']);
  }

  cancel(): void {
    this.router.navigate(['/tabs/templates']);
  }

  async saveTemplate(): Promise<void> {
    if (!this.templateName().trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, introduce un nombre para la plantilla',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.exercises().length === 0) {
      const toast = await this.toastController.create({
        message: 'Por favor, añade al menos un ejercicio',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.saving.set(true);

    const template: WorkoutTemplate = {
      name: this.templateName(),
      description: this.templateDescription(),
      workoutTypeId: this.selectedTypeId(),
      exercises: this.exercises()
    };

    const saveOperation = this.isEditMode()
      ? this.templateService.updateTemplate(this.templateId()!, template)
      : this.templateService.createTemplate(template);

    saveOperation.subscribe({
      next: async () => {
        const message = this.isEditMode()
          ? 'Plantilla actualizada correctamente'
          : 'Plantilla creada correctamente';
        const toast = await this.toastController.create({
          message,
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/tabs/templates']);
      },
      error: async () => {
        this.saving.set(false);
        const toast = await this.toastController.create({
          message: 'Error al guardar la plantilla',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
