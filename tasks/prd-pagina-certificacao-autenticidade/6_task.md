# Tarefa 6.0: [Integração] Testes E2E com Playwright e validação de build estático

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Desenvolver e executar testes end-to-end com Playwright cobrindo os fluxos completos da página de certificação para Ricardo e Jenifer, validação de IDs inexistentes, responsividade em Desktop e Mobile (Pixel 7), e execução do ciclo completo de qualidade (`npm run lint`, `npm test` e `npm run build`), garantindo compatibilidade com o deploy estático na Vercel.

**Tipo:** Integração / Testes

**Tecnologias:** Playwright, Angular 22, Vercel SPA Routing

<requirements>
- Criar a suite de testes E2E em `e2e/student-certificate.spec.ts`.
- Validar que `/certificado?id=ricardo` exibe `DOCUMENTO VÁLIDO`, o nome do Ricardo, código CIE `484F61C4` e a chave PEM.
- Validar que `/certificado?id=jenifer` exibe `DOCUMENTO VÁLIDO`, o nome da Jenifer, código CIE `485A61C4` e a chave PEM.
- Validar que `/certificado?id=invalido` exibe o título de certificado não encontrado sem expor dados de alunos.
- Validar que a ação "Clique aqui para baixar o certificado" está visível e interativa.
- Validar que a suite roda em projetos `desktop` e `mobile` definidos no Playwright.
- Validar que `npm run lint`, `npm test` e `npm run build` passam com zero falhas.
</requirements>

## Subtarefas

- [x] 6.1 Criar suite de testes Playwright em `e2e/student-certificate.spec.ts`.
- [x] 6.2 Executar testes E2E (`npx playwright test e2e/student-certificate.spec.ts`) contra o servidor local.
- [x] 6.3 Executar suite completa de testes unitários (`npm test`).
- [x] 6.4 Executar linter em todos os arquivos TypeScript e HTML (`npm run lint`).
- [x] 6.5 Executar compilação de produção (`npm run build`) e validar integridade do bundle em `dist/carteirinha-estudantil/browser`.

## Detalhes de Implementação

Referência na Tech Spec: Seção *Abordagem de Testes -> Testes E2E*.

### Testes / Integração

- [x] Criar `e2e/student-certificate.spec.ts`.
- [x] Validar compatibilidade da rota `/certificado` com as regras de rewrite em `vercel.json`.

## Critérios de Sucesso

- Todos os cenários E2E (Ricardo, Jenifer, ID inexistente) passam com sucesso em Desktop e Mobile.
- Suite de testes unitários do projeto passa com 100% de sucesso (tanto para a carteirinha quanto para o certificado).
- O comando `npm run lint` é concluído sem erros ou advertências.
- O comando `npm run build` compila a aplicação com sucesso gerando o bundle SPA estático pronto para produção.

## Testes da Tarefa

### Integração

- [ ] Testes E2E Playwright (`e2e/student-certificate.spec.ts`):
  - Rota `/certificado?id=ricardo` renderiza declaração do Ricardo com dados, CIE e chave PEM.
  - Rota `/certificado?id=jenifer` renderiza declaração da Jenifer com dados, CIE e chave PEM.
  - Rota `/certificado?id=invalido` renderiza estado "Certificado não encontrado".
  - Ação de impressão/download visível e acessível.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `e2e/student-certificate.spec.ts`
- `playwright.config.ts`
- `vercel.json`
- `package.json`

## Comandos de Validação

### Frontend & Integração

```bash
# Testes E2E
npx playwright test e2e/student-certificate.spec.ts

# Testes Unitários Gerais
npm test

# Lint
npm run lint

# Build de Produção
npm run build
```
