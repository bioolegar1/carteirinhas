import { STUDENT_CERTIFICATES } from './student-certificates.data';

describe('STUDENT_CERTIFICATES', () => {
  it('should include certificate entries for ricardo and jenifer', () => {
    expect(STUDENT_CERTIFICATES['ricardo']).toBeDefined();
    expect(STUDENT_CERTIFICATES['jenifer']).toBeDefined();
  });

  it('should contain valid PEM format delimiters in certificateKey', () => {
    const ricardoCert = STUDENT_CERTIFICATES['ricardo'];
    expect(ricardoCert.certificateKey).toContain('-----BEGIN CERTIFICATE-----');
    expect(ricardoCert.certificateKey).toContain('-----END CERTIFICATE-----');

    const jeniferCert = STUDENT_CERTIFICATES['jenifer'];
    expect(jeniferCert.certificateKey).toContain('-----BEGIN CERTIFICATE-----');
    expect(jeniferCert.certificateKey).toContain('-----END CERTIFICATE-----');
  });

  it('should contain all required metadata fields populated', () => {
    for (const id of ['ricardo', 'jenifer']) {
      const cert = STUDENT_CERTIFICATES[id];
      expect(cert.studentId).toBe(id);
      expect(cert.authHash.length).toBeGreaterThan(10);
      expect(cert.city).toBe('Brasília');
      expect(cert.issuedAt).toContain('2026');
      expect(cert.legalFramework).toContain('Lei 14.063/2020');
    }
  });
});
