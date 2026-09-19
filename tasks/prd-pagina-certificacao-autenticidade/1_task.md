# Tarefa 1.0: [Frontend] Modelos e base de dados estática de certificados ICP-Brasil

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar as interfaces TypeScript necessárias para tipar os dados do certificado digital e implementar a base estática de dados com as credenciais ICP-Brasil (chaves PEM X.509, hash de autenticidade, amparo legal e carimbos de data/hora) para os estudantes Ricardo e Jenifer, com testes unitários de integridade de dados.

**Tipo:** Frontend

**Tecnologias:** Angular 22, TypeScript

<requirements>
- Definir `StudentCertificateData` e `StudentCertificateView` em `src/app/student-cards/models/student-certificate.model.ts`.
- Criar a base de dados `STUDENT_CERTIFICATES` em `src/app/student-cards/data/student-certificates.data.ts`.
- Mapear os dados dos estudantes `ricardo` e `jenifer` com a chave pública oficial X.509 da ABAFE.
- Escrever testes unitários em `student-certificates.data.spec.ts` para garantir integridade e formato dos dados.
</requirements>

## Subtarefas

- [x] 1.1 Criar a interface `StudentCertificateData` e a agregação `StudentCertificateView`.
- [x] 1.2 Criar o arquivo `student-certificates.data.ts` com as entradas de Ricardo e Jenifer contendo a chave PEM completa da ABAFE.
- [x] 1.3 Criar teste unitário `student-certificates.data.spec.ts` validando presença das chaves obrigatórias, identificadores e formato de cabeçalho/rodapé PEM (`-----BEGIN CERTIFICATE-----` e `-----END CERTIFICATE-----`).

## Detalhes de Implementação

Referência na Tech Spec: Seção *Design de Implementação -> Frontend (Angular) -> Models/Interfaces*.

### Frontend

- [x] Criar `src/app/student-cards/models/student-certificate.model.ts`.
- [x] Criar `src/app/student-cards/data/student-certificates.data.ts`.
- [x] Criar `src/app/student-cards/data/student-certificates.data.spec.ts`.

## Critérios de Sucesso

- O modelo TypeScript define estritamente todos os campos exigidos na Tech Spec.
- A base estática possui entradas válidas para `ricardo` e `jenifer`.
- Os testes unitários validam a integridade das credenciais com 100% de aprovação.

## Testes da Tarefa

### Frontend

- [ ] Testes de unidade dos dados (`student-certificates.data.spec.ts`) validando que:
  - As chaves `ricardo` e `jenifer` existem no repositório.
  - A chave de certificado contém `-----BEGIN CERTIFICATE-----` e `-----END CERTIFICATE-----`.
  - Os campos de cidade, data de emissão e amparo legal estão preenchidos.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/student-cards/models/student-certificate.model.ts`
- `src/app/student-cards/data/student-certificates.data.ts`
- `src/app/student-cards/data/student-certificates.data.spec.ts`

## Comandos de Validação

### Frontend

```bash
# Testes
ng test --watch=false --browsers=ChromeHeadless --include='**/student-certificates.data.spec.ts'

# Build
ng build

# Lint
npm run lint
```
