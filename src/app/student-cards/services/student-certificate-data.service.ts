import { Injectable, inject } from '@angular/core';

import { STUDENT_CERTIFICATES } from '../data/student-certificates.data';
import { StudentCertificateView } from '../models/student-certificate.model';
import { StudentCardDataService } from './student-card-data.service';

@Injectable({ providedIn: 'root' })
export class StudentCertificateDataService {
  private readonly cardService = inject(StudentCardDataService);

  getCertificateByStudentId(studentId: string | null): StudentCertificateView | null {
    if (!studentId) {
      return null;
    }

    const certificate = STUDENT_CERTIFICATES[studentId];
    if (!certificate) {
      return null;
    }

    const card = this.cardService.getCards().find((c) => c.id === studentId);
    if (!card) {
      return null;
    }

    return { card, certificate };
  }
}
