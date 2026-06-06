import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { StudentCardData } from '../../models/student-card.model';

@Component({
  selector: 'app-student-card-front',
  standalone: true,
  templateUrl: './student-card-front.component.html',
  styleUrl: './student-card-front.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardFrontComponent {
  readonly card = input.required<StudentCardData>();
  readonly photoFailed = signal(false);

  onPhotoError(): void {
    this.photoFailed.set(true);
  }
}
