import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StudentCardData } from '../../models/student-card.model';

@Component({
  selector: 'app-student-card-back',
  standalone: true,
  templateUrl: './student-card-back.component.html',
  styleUrl: './student-card-back.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardBackComponent {
  readonly card = input.required<StudentCardData>();
}
