import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STUDENT_CARDS } from '../../data/student-cards.data';
import { StudentCardFrontComponent } from './student-card-front.component';

describe('StudentCardFrontComponent', () => {
  let fixture: ComponentFixture<StudentCardFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardFrontComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardFrontComponent);
    fixture.componentRef.setInput('card', STUDENT_CARDS[0]);
    fixture.detectChanges();
  });

  it('should render the main student data', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Vanderson Henrique dos Santos');
    expect(text).toContain('032.658.931-70');
    expect(text).toContain('Analise e Desenvolvimento de Sistemas');
    expect(text).toContain('4C7564B9');
  });

  it('should render QR and photo placeholders when assets are absent', () => {
    fixture.componentRef.setInput('card', STUDENT_CARDS[1]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.qr-placeholder')).toBeTruthy();
    expect(element.querySelector('.photo-placeholder')).toBeTruthy();
  });

  it('should render configured photo for the first card', () => {
    const element = fixture.nativeElement as HTMLElement;
    const photo = element.querySelector('.photo-wrap img') as HTMLImageElement | null;

    expect(photo).toBeTruthy();
    expect(photo?.getAttribute('src')).toBe('/assets/photos/propria-carteirinha.jpg');
    expect(photo?.getAttribute('alt')).toBe('Foto de Vanderson Henrique dos Santos');
  });

  it('should not render renewal action', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).not.toContain('Renove Agora');
  });
});
