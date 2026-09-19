import { StudentCardData } from './student-card.model';

export interface StudentCertificateData {
  studentId: string;
  authHash: string;
  certificateKey: string;
  issuedAt: string;
  city: string;
  legalFramework: string;
}

export interface StudentCertificateView {
  card: StudentCardData;
  certificate: StudentCertificateData;
}
