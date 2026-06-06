export interface StudentCardData {
  id: string;
  greetingName: string;
  fullName: string;
  documentLabel: string;
  documentNumber: string;
  birthDate: string;
  course: string;
  institution: string;
  year: string;
  validUntil: string;
  cieCode: string;
  photoUrl?: string;
  qrImageUrl?: string;
  issuer: IssuerData;
  validator: ValidatorData;
  benefit: BenefitData;
  supportPhone: string;
}

export interface IssuerData {
  acronym: string;
  name: string;
}

export interface ValidatorData {
  label: string;
  urlText: string;
}

export interface BenefitData {
  percentage: string;
  description: string;
  venues: readonly string[];
  legalText: string;
}
