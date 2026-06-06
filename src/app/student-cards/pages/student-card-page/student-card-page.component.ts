import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { StudentCardComponent } from '../../components/student-card/student-card.component';
import { StudentCardDataService } from '../../services/student-card-data.service';

@Component({
  selector: 'app-student-card-page',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, StudentCardComponent, BottomNavComponent],
  templateUrl: './student-card-page.component.html',
  styleUrl: './student-card-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(StudentCardDataService);

  readonly requestedId = signal(this.route.snapshot.queryParamMap.get('id'));
  readonly card = computed(() => this.dataService.findById(this.requestedId()));
}
