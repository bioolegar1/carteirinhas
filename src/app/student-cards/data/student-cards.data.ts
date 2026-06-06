import { StudentCardData } from '../models/student-card.model';

const sharedBenefit = {
  percentage: '50%',
  description: 'Meia Entrada em eventos culturais e de entretenimento',
  venues: ['Teatro', 'Cinema', 'Estadios', 'Shows', '+ Eventos'] as const,
  legalText:
    'Lei Federal no 12.933/2013 garante o beneficio do pagamento de Meia Entrada para estudantes. Documento valido em todo o Territorio Nacional ate marco do ano seguinte.',
};

const sharedIssuer = {
  acronym: 'ABOFE',
  name: 'Assoc. Brasileira de Foco Estudantil',
};

const sharedValidator = {
  label: 'Validado no',
  urlText: 'validador.org.br',
};

export const STUDENT_CARDS: readonly StudentCardData[] = [
  {
    id: 'propria-carteirinha',
    greetingName: 'Vanderson',
    fullName: 'Vanderson Henrique dos Santos',
    documentLabel: 'CPF/CIN',
    documentNumber: '032.658.931-70',
    birthDate: '23/10/1964',
    course: 'Analise e Desenvolvimento de Sistemas',
    institution: 'UNIASSELVI',
    year: '2026',
    validUntil: '31/03/2026',
    cieCode: '4C7564B9',
    photoUrl: '/assets/photos/propria-carteirinha.jpg',
    qrImageUrl: '/assets/qrs/qrcode01.jpg',
    issuer: sharedIssuer,
    validator: sharedValidator,
    benefit: sharedBenefit,
    supportPhone: '(31) 9 9327-1886',
  },
  {
    id: 'conta-2',
    greetingName: 'Estudante',
    fullName: 'Cadastro Predefinido Dois',
    documentLabel: 'CPF/CIN',
    documentNumber: '000.000.000-02',
    birthDate: '01/01/2000',
    course: 'Curso Predefinido Dois',
    institution: 'Instituicao Predefinida',
    year: '2026',
    validUntil: '31/03/2026',
    cieCode: 'CAD00002',
    issuer: sharedIssuer,
    validator: sharedValidator,
    benefit: sharedBenefit,
    supportPhone: '(31) 9 9327-1886',
  },
  {
    id: 'conta-3',
    greetingName: 'Estudante',
    fullName: 'Cadastro Predefinido Tres',
    documentLabel: 'CPF/CIN',
    documentNumber: '000.000.000-03',
    birthDate: '01/01/2000',
    course: 'Curso Predefinido Tres',
    institution: 'Instituicao Predefinida',
    year: '2026',
    validUntil: '31/03/2026',
    cieCode: 'CAD00003',
    issuer: sharedIssuer,
    validator: sharedValidator,
    benefit: sharedBenefit,
    supportPhone: '(31) 9 9327-1886',
  },
];
