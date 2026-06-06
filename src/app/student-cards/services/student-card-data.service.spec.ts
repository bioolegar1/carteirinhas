import { TestBed } from '@angular/core/testing';

import { StudentCardDataService } from './student-card-data.service';

describe('StudentCardDataService', () => {
  let service: StudentCardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentCardDataService);
  });

  it('should return all predefined cards', () => {
    expect(service.getCards().length).toBe(4);
  });

  it('should find a card by ID', () => {
    const card = service.findById('propria-carteirinha');

    expect(card?.fullName).toContain('Vanderson');
  });

  it('should return the first card when ID is absent', () => {
    const card = service.findById(null);

    expect(card?.id).toBe('propria-carteirinha');
  });

  it('should return null when ID does not exist', () => {
    expect(service.findById('inexistente')).toBeNull();
  });
});
