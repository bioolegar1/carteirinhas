import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { STUDENT_CARDS } from '../../data/student-cards.data';
import { StudentCardComponent } from './student-card.component';

describe('StudentCardComponent', () => {
  let fixture: ComponentFixture<StudentCardComponent>;
  let component: StudentCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', STUDENT_CARDS[0]);
    fixture.detectChanges();
  });

  it('should flip when clicked', fakeAsync(() => {
    const button = fixture.nativeElement.querySelector('.card-scene') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(component.turning()).toBeTrue();
    expect(component.flipped()).toBeTrue();
    expect(component.displayedBack()).toBeFalse();

    tick(380);
    fixture.detectChanges();

    expect(component.displayedBack()).toBeTrue();

    tick(380);
    fixture.detectChanges();

    expect(component.turning()).toBeFalse();
  }));

  it('should flip when activated by keyboard', fakeAsync(() => {
    const button = fixture.nativeElement.querySelector('.card-scene') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    button.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.flipped()).toBeTrue();
    tick(380);
    fixture.detectChanges();

    expect(component.displayedBack()).toBeTrue();
  }));
});
