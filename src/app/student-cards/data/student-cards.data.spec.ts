import { STUDENT_CARDS } from './student-cards.data';

describe('STUDENT_CARDS', () => {
  it('should define the expected predefined cards', () => {
    expect(STUDENT_CARDS.length).toBe(4);
  });

  it('should define unique stable IDs', () => {
    const ids = STUDENT_CARDS.map((card) => card.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    expect(ids.every((id) => id.trim().length > 0)).toBeTrue();
  });

  it('should define all required display fields', () => {
    for (const card of STUDENT_CARDS) {
      expect(card.fullName).toBeTruthy();
      expect(card.documentNumber).toBeTruthy();
      expect(card.birthDate).toBeTruthy();
      expect(card.course).toBeTruthy();
      expect(card.institution).toBeTruthy();
      expect(card.year).toBeTruthy();
      expect(card.validUntil).toBeTruthy();
      expect(card.cieCode).toBeTruthy();
      expect(card.issuer.acronym).toBeTruthy();
      expect(card.validator.urlText).toBeTruthy();
      expect(card.supportPhone).toBeTruthy();
    }
  });

  it('should configure photos for cards with provided assets', () => {
    expect(STUDENT_CARDS[0].photoUrl).toBe('/assets/photos/propria-carteirinha.jpg');
    expect(STUDENT_CARDS[1].photoUrl).toBeUndefined();
    expect(STUDENT_CARDS[2].photoUrl).toBeUndefined();
    expect(STUDENT_CARDS[3].photoUrl).toBe('/assets/photos/FOTO-STHEFANY.png');
  });

  it('should configure QR code images for cards with provided assets', () => {
    expect(STUDENT_CARDS[0].qrImageUrl).toBe('/assets/qrs/qrcode01.jpg');
    expect(STUDENT_CARDS[3].qrImageUrl).toBe('/assets/qrs/QR-STHEFANY.png');
  });
});
