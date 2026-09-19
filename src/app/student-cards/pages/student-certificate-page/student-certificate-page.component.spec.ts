import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { StudentCertificatePageComponent } from './student-certificate-page.component';

describe('StudentCertificatePageComponent', () => {
  let component: StudentCertificatePageComponent;
  let fixture: ComponentFixture<StudentCertificatePageComponent>;

  const createComponentWithId = async (id: string | null) => {
    await TestBed.configureTestingModule({
      imports: [StudentCertificatePageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(id ? { id } : {}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCertificatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render certificate details for valid id ricardo', async () => {
    await createComponentWithId('ricardo');

    const bannerEl = fixture.debugElement.query(By.css('.status-banner h1'));
    expect(bannerEl.nativeElement.textContent).toContain('DOCUMENTO VÁLIDO');

    const nameEl = fixture.debugElement.query(By.css('.student-name'));
    expect(nameEl.nativeElement.textContent).toContain('Ricardo Olimpio');

    const cieEl = fixture.debugElement.query(By.css('.cie-code'));
    expect(cieEl.nativeElement.textContent).toBe('486C61C4');

    const pemEl = fixture.debugElement.query(By.css('.pem-block code'));
    expect(pemEl.nativeElement.textContent).toContain('-----BEGIN CERTIFICATE-----');
  });

  it('should render certificate details for valid id jenifer', async () => {
    await createComponentWithId('jenifer');

    const nameEl = fixture.debugElement.query(By.css('.student-name'));
    expect(nameEl.nativeElement.textContent).toBe('Jenifer Gomes de Sousa');

    const cieEl = fixture.debugElement.query(By.css('.cie-code'));
    expect(cieEl.nativeElement.textContent).toBe('487B61C4');
  });

  it('should render not-found state when id is missing or invalid', async () => {
    await createComponentWithId('desconhecido');

    const notFoundEl = fixture.debugElement.query(By.css('.not-found h1'));
    expect(notFoundEl).toBeTruthy();
    expect(notFoundEl.nativeElement.textContent).toContain('Certificado não encontrado');

    const docEl = fixture.debugElement.query(By.css('.certificate-document'));
    expect(docEl).toBeNull();
  });

  it('should trigger window.print when download certificate button is clicked', async () => {
    await createComponentWithId('ricardo');
    spyOn(window, 'print');

    const printBtn = fixture.debugElement.query(By.css('.download-cert-btn'));
    expect(printBtn).toBeTruthy();
    printBtn.nativeElement.click();

    expect(window.print).toHaveBeenCalled();
  });

  it('should toggle photoFailed when photo error event occurs', async () => {
    await createComponentWithId('ricardo');

    expect(component.photoFailed()).toBeFalse();
    component.onPhotoError();
    expect(component.photoFailed()).toBeTrue();
  });
});
