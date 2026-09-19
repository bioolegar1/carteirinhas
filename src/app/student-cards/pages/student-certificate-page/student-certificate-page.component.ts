import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StudentCertificateDataService } from '../../services/student-certificate-data.service';

@Component({
  selector: 'app-student-certificate-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-certificate-page.component.html',
  styleUrl: './student-certificate-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCertificatePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly certificateService = inject(StudentCertificateDataService);

  readonly requestedId = signal(this.route.snapshot.queryParamMap.get('id'));
  readonly certificateView = computed(() =>
    this.certificateService.getCertificateByStudentId(this.requestedId()),
  );
  readonly photoFailed = signal(false);

  onPhotoError(): void {
    this.photoFailed.set(true);
  }

  printCertificate(): void {
    window.print();
  }
}
