import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Destroy Service for automatic unsubscription
 * Usage in components:
 * 
 * export class MyComponent {
 *   private destroy$ = inject(DestroyService);
 *   
 *   ngOnInit() {
 *     this.myObservable$
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe(...);
 *   }
 * }
 */
@Injectable()
export class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
