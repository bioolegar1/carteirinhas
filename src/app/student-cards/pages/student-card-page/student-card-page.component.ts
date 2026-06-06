import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StudentCardComponent } from '../../components/student-card/student-card.component';
import { StudentCardDataService } from '../../services/student-card-data.service';

@Component({
  selector: 'app-student-card-page',
  standalone: true,
  imports: [CommonModule, StudentCardComponent],
  templateUrl: './student-card-page.component.html',
  styleUrl: './student-card-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(StudentCardDataService);

  readonly requestedId = signal(this.route.snapshot.queryParamMap.get('id'));
  readonly card = computed(() => this.dataService.findById(this.requestedId()));
  readonly fullscreenActive = signal(false);

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.fullscreenActive.set(Boolean(document.fullscreenElement));
  }

  async toggleFullscreen(): Promise<void> {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      this.fullscreenActive.set(Boolean(document.fullscreenElement));
      return;
    }

    await document.exitFullscreen?.();
    this.fullscreenActive.set(Boolean(document.fullscreenElement));
  }
}
