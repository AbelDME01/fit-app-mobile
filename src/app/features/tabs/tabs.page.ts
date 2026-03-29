import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, listOutline, trophyOutline, trendingUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="barbell-outline"></ion-icon>
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Entrenamientos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="records" href="/tabs/records">
          <ion-icon name="trophy-outline"></ion-icon>
          <ion-label>Marcas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="progress" href="/tabs/progress">
          <ion-icon name="trending-up-outline"></ion-icon>
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
    addIcons({ barbellOutline, listOutline, trophyOutline, trendingUpOutline });
  }
}
