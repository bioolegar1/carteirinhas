import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { StudentCardData } from '../../models/student-card.model';
import { StudentCardBackComponent } from '../student-card-back/student-card-back.component';
import { StudentCardFrontComponent } from '../student-card-front/student-card-front.component';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule, StudentCardFrontComponent, StudentCardBackComponent],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent {
  readonly card = input.required<StudentCardData>();
  readonly flipped = signal(false);
  readonly displayedBack = signal(false);
  readonly turning = signal(false);

  flip(): void {
    if (this.turning()) {
      return;
    }

    const nextSide = !this.flipped();
    this.turning.set(true);
    this.flipped.set(nextSide);
    window.setTimeout(() => this.displayedBack.set(nextSide), 380);
    window.setTimeout(() => this.turning.set(false), 760);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.flip();
  }
}
