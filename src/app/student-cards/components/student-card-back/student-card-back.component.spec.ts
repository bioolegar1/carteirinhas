import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STUDENT_CARDS } from '../../data/student-cards.data';
import { StudentCardBackComponent } from './student-card-back.component';

describe('StudentCardBackComponent', () => {
  let fixture: ComponentFixture<StudentCardBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardBackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardBackComponent);
    fixture.componentRef.setInput('card', STUDENT_CARDS[0]);
    fixture.detectChanges();
  });

  it('should render benefit and support data', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('50%');
    expect(text).toContain('Meia Entrada');
    expect(text).toContain('validador.org.br');
    expect(text).toContain('(31) 9 9327-1886');
  });
});
