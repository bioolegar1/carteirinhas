import { TestBed } from '@angular/core/testing';

import { StudentCardDataService } from './student-card-data.service';
import { StudentCertificateDataService } from './student-certificate-data.service';

describe('StudentCertificateDataService', () => {
  let service: StudentCertificateDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentCardDataService, StudentCertificateDataService],
    });
    service = TestBed.inject(StudentCertificateDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return certificate view for ricardo', () => {
    const result = service.getCertificateByStudentId('ricardo');
    expect(result).not.toBeNull();
    expect(result?.card.fullName).toContain('Ricardo Olimpio');
    expect(result?.card.cieCode).toBe('486C61C4');
    expect(result?.certificate.studentId).toBe('ricardo');
    expect(result?.certificate.certificateKey).toContain('-----BEGIN CERTIFICATE-----');
  });

  it('should return certificate view for jenifer', () => {
    const result = service.getCertificateByStudentId('jenifer');
    expect(result).not.toBeNull();
    expect(result?.card.fullName).toBe('Jenifer Gomes de Sousa');
    expect(result?.card.cieCode).toBe('487B61C4');
    expect(result?.certificate.studentId).toBe('jenifer');
    expect(result?.certificate.certificateKey).toContain('-----BEGIN CERTIFICATE-----');
  });

  it('should return null for unknown studentId', () => {
    const result = service.getCertificateByStudentId('inexistente');
    expect(result).toBeNull();
  });

  it('should return null for null or empty studentId', () => {
    expect(service.getCertificateByStudentId(null)).toBeNull();
    expect(service.getCertificateByStudentId('')).toBeNull();
  });
});
