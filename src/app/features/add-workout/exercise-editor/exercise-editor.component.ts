import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  ModalController
} from '@ionic/angular/standalone';
import { WorkoutExercise } from '@core/services/workout.service';

@Component({
  selector: 'app-exercise-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Ejercicio</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input [(ngModel)]="exerciseData.name" placeholder="Nombre del ejercicio"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Series</ion-label>
        <ion-input type="number" [(ngModel)]="exerciseData.sets" [min]="1"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Repeticiones</ion-label>
        <ion-input type="number" [(ngModel)]="exerciseData.reps" [min]="1"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Peso (kg)</ion-label>
        <ion-input type="number" [(ngModel)]="exerciseData.weight" [min]="0" step="0.5"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Descanso (seg)</ion-label>
        <ion-input type="number" [(ngModel)]="exerciseData.restSeconds" [min]="0" step="5"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Notas</ion-label>
        <ion-textarea [(ngModel)]="exerciseData.notes" rows="3" placeholder="Notas adicionales..."></ion-textarea>
      </ion-item>
      <ion-button expand="block" class="ion-margin-top" (click)="save()">Guardar</ion-button>
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: var(--swiss-surface);
      --color: var(--swiss-text-primary);
    }
    ion-content {
      --background: var(--swiss-bg);
    }
    ion-item {
      --background: var(--swiss-surface);
      --color: var(--swiss-text-primary);
      margin-bottom: 8px;
      border-radius: 8px;
    }
    ion-label {
      --color: var(--swiss-text-secondary) !important;
    }
    ion-button[expand="block"] {
      --background: var(--swiss-accent);
      --color: #FFFFFF;
      margin-top: 16px;
    }
  `]
})
export class ExerciseEditorComponent {
  private modalController = inject(ModalController);

  @Input() exercise!: WorkoutExercise;
  @Input() exerciseIndex!: number;

  exerciseData: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    restSeconds: number;
    notes: string;
  } = {
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    restSeconds: 60,
    notes: ''
  };

  ngOnInit() {
    if (this.exercise) {
      this.exerciseData = {
        name: this.exercise.exercise?.name || '',
        sets: this.exercise.sets,
        reps: this.exercise.reps,
        weight: this.exercise.weight || 0,
        restSeconds: this.exercise.restSeconds,
        notes: this.exercise.notes || ''
      };
    }
  }

  dismiss() {
    this.modalController.dismiss(null, 'cancel');
  }

  save() {
    this.modalController.dismiss(
      {
        index: this.exerciseIndex,
        data: this.exerciseData
      },
      'save'
    );
  }
}
