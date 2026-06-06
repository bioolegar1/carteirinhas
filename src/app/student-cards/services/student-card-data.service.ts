import { Injectable } from '@angular/core';

import { STUDENT_CARDS } from '../data/student-cards.data';
import { StudentCardData } from '../models/student-card.model';

@Injectable({ providedIn: 'root' })
export class StudentCardDataService {
  getCards(): readonly StudentCardData[] {
    return STUDENT_CARDS;
  }

  findById(id: string | null): StudentCardData | null {
    if (!id) {
      return STUDENT_CARDS[0] ?? null;
    }

    return STUDENT_CARDS.find((card) => card.id === id) ?? null;
  }
}
