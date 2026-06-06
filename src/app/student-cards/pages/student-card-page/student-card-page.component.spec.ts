import { convertToParamMap } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StudentCardPageComponent } from './student-card-page.component';

function routeWithId(id: string | null): Partial<ActivatedRoute> {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(id ? { id } : {}),
    } as ActivatedRoute['snapshot'],
  };
}

describe('StudentCardPageComponent', () => {
  it('should resolve the first card when ID is absent', async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: routeWithId(null) }],
    }).compileComponents();

    const fixture = TestBed.createComponent(StudentCardPageComponent);

    expect(fixture.componentInstance.card()?.id).toBe('propria-carteirinha');
  });

  it('should resolve a card by URL ID', async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: routeWithId('conta-2') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(StudentCardPageComponent);

    expect(fixture.componentInstance.card()?.id).toBe('conta-2');
  });

  it('should render not found state for an invalid ID without exposing a list', async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: routeWithId('inexistente') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(StudentCardPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Carteirinha nao encontrada');
    expect(text).not.toContain('conta-2');
    expect(text).not.toContain('conta-3');
  });
});
