# Tarefa 2.0: [Frontend] Serviço de resolução de certificados e agregação cadastral

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar o serviço Angular `StudentCertificateDataService` que correlaciona a consulta do estudante (via `StudentCardDataService`) com a base de certificados (`student-certificates.data.ts`), retornando o objeto unificado `StudentCertificateView` ou `null` quando o registro for inválido ou não encontrado.

**Tipo:** Frontend

**Tecnologias:** Angular 22, TypeScript, Jasmine/Karma

<requirements>
- Injetar `StudentCardDataService` para resolver o cartão estudantil pelo `id`.
- Buscar os metadados do certificado em `STUDENT_CERTIFICATES` correspondentes ao `id`.
- Retornar `{ card, certificate }` quando ambos existirem, ou `null` caso contrário.
- Cobrir todos os cenários com testes unitários no padrão Jasmine/Karma.
</requirements>

## Subtarefas

- [x] 2.1 Criar `StudentCertificateDataService` em `src/app/student-cards/services/student-certificate-data.service.ts`.
- [x] 2.2 Implementar método `getCertificateByStudentId(studentId: string | null): StudentCertificateView | null`.
- [x] 2.3 Criar suite de testes unitários em `student-certificate-data.service.spec.ts` validando busca para `ricardo`, `jenifer`, IDs inexistentes e parâmetro nulo/vazio.

## Detalhes de Implementação

Referência na Tech Spec: Seção *Design de Implementação -> Frontend (Angular) -> Services*.

### Frontend

- [x] Criar `src/app/student-cards/services/student-certificate-data.service.ts`.
- [x] Criar `src/app/student-cards/services/student-certificate-data.service.spec.ts`.

## Critérios de Sucesso

- O serviço compila com `@Injectable({ providedIn: 'root' })`.
- Retorna os dados agregados corretos para `ricardo` e `jenifer`.
- Retorna `null` para qualquer identificador não cadastrado ou nulo, sem lançar exceções.
- Testes unitários com 100% de cobertura nos métodos do serviço.

## Testes da Tarefa

### Frontend

- [ ] Testes de unidade (`student-certificate-data.service.spec.ts`) validando:
  - Resolução de `ricardo` retornando dados do aluno e certificado.
  - Resolução de `jenifer` retornando dados do aluno e certificado.
  - Retorno `null` para ID inexistente (`inexistente`).
  - Retorno `null` para entrada nula (`null`) ou vazia (`''`).

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/student-cards/services/student-card-data.service.ts`
- `src/app/student-cards/services/student-certificate-data.service.ts`
- `src/app/student-cards/services/student-certificate-data.service.spec.ts`
- `src/app/student-cards/data/student-certificates.data.ts`
- `src/app/student-cards/models/student-certificate.model.ts`

## Comandos de Validação

### Frontend

```bash
# Testes
ng test --watch=false --browsers=ChromeHeadless --include='**/student-certificate-data.service.spec.ts'

# Build
ng build

# Lint
npm run lint
```
