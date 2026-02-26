import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { dumbbell, addCircleOutline, trophy, trendingUp } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="dumbbell"></ion-icon>
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="add-workout">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>Añadir</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="records">
          <ion-icon name="trophy"></ion-icon>
          <ion-label>Marcas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="progress">
          <ion-icon name="trending-up"></ion-icon>
          <ion-label>Progreso</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: var(--swiss-surface);
      padding-bottom: env(safe-area-inset-bottom);
      height: 84px;
      padding-top: 16px;
    }

    ion-tab-button {
      --color: var(--swiss-text-muted);
      --color-selected: var(--swiss-accent);

      ion-icon {
        font-size: 22px;
      }

      ion-label {
        font-size: 10px;
        font-weight: 500;
        margin-top: 4px;
      }

      &.tab-selected {
        ion-label {
          font-weight: 600;
        }
      }
    }
  `]
})
export class TabsPage {
  constructor() {
    addIcons({ dumbbell, addCircleOutline, trophy, trendingUp });
  }
}
