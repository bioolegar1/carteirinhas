# Enabler: Fundacao tecnica do frontend DocIQ MVP

**Tipo**: Arquitetura
**Prioridade**: Alta
**Estimativa**: P / 1 a 2 dias
**Status**: Executado em 2026-05-27

## Contexto

O PRD, a tech spec e as tasks do DocIQ MVP Frontend dependem de uma base tecnica Angular antes das features funcionais. Essa base precisa validar Angular 21, PrimeNG v21, SCSS, rotas lazy, contratos TypeScript alinhados ao backend, padrao de testes e um smoke E2E inicial.

Sem esse enabler, as tasks de autenticacao, upload, documentos, revisao e administracao tenderiam a criar estrutura, estilos, models e convencoes de forma divergente.

## Objetivos

- Criar a fundacao Angular 21 com SCSS e routing.
- Configurar PrimeNG v21, tema, PrimeIcons e animacoes.
- Definir estrutura `core`, `features` e `shared`.
- Criar rotas lazy iniciais e shell operacional.
- Modelar DTOs TypeScript alinhados aos endpoints reais do backend.
- Criar API base configuravel por ambiente.
- Criar utilitarios de formatacao e testes iniciais.
- Validar build, testes unitarios e smoke E2E.

## Escopo

### Incluido

- Scaffold do projeto `dociq-frontend`.
- Configuracao Angular standalone com `provideRouter` e `provideHttpClient`.
- Configuracao PrimeNG com tema Aura.
- Tokens globais de SCSS em `src/styles.scss`.
- Rotas lazy para login, dashboard, onboarding, upload, documentos, revisao, capacidades e administracao.
- Shell operacional placeholder.
- Models para auth, documentos, dicionario, revisao, dashboard, webhook, usuarios e API keys.
- `API_BASE_URL` configuravel por ambiente.
- Utilitarios de data, moeda, tamanho de arquivo, score, status e tipo documental.
- Testes unitarios de bootstrap, models e utilitarios.
- Smoke E2E com Playwright.

### Nao Incluido

- Login real, refresh token, guards e interceptors completos.
- Upload funcional.
- Consumo real das APIs de documentos, revisao, dashboard e administracao.
- Tela final de revisao humana.
- Design system completo.
- CI/CD.

## Criterios de Aceite

- [x] Projeto Angular 21 criado com SCSS e routing.
- [x] PrimeNG v21, PrimeIcons, tema e animacoes configurados.
- [x] Estrutura `core`, `features` e `shared` criada.
- [x] Rotas lazy principais criadas.
- [x] Shell operacional inicial criado.
- [x] Tokens globais de SCSS definidos.
- [x] Models TypeScript alinhados aos DTOs reais do backend.
- [x] `API_BASE_URL` configuravel por ambiente.
- [x] Utilitarios de formatacao criados.
- [x] Testes unitarios iniciais passando.
- [x] Build de producao passando.
- [x] Smoke E2E passando.

## Tarefas Tecnicas

## Agentes/Skills Recomendados

Use este comando para aplicar ou revisar este enabler chamando os agentes necessarios:

```md
$angular-architect $owasp-security-check @enablers/enabler-dociq-mvp-frontend-fundacao-tecnica.md
```

Uso recomendado por foco:

```md
$angular-architect @enablers/enabler-dociq-mvp-frontend-fundacao-tecnica.md
$owasp-security-check @enablers/enabler-dociq-mvp-frontend-fundacao-tecnica.md
```

### Frontend

- [x] Criar projeto Angular com `--style=scss --routing`.
- [x] Instalar PrimeNG, PrimeIcons, tema Aura e Angular animations.
- [x] Configurar `providePrimeNG`, `provideAnimationsAsync`, `provideHttpClient` e `provideRouter`.
- [x] Criar `API_BASE_URL` e environments.
- [x] Criar models TypeScript do contrato backend.
- [x] Criar rotas lazy para todos os fluxos previstos.
- [x] Criar shell e paginas placeholder.
- [x] Criar tokens globais de SCSS.
- [x] Criar utilitarios de formatacao.
- [x] Criar testes unitarios e smoke E2E.

### Backend

- [x] Nao aplicavel. O backend ja esta implementado e serve como contrato para o frontend.

### Infraestrutura

- [x] Configurar Playwright local.
- [x] Validar dev server local em `http://127.0.0.1:4200/`.
- [x] Documentar que `npm run build` pode exigir execucao fora do sandbox neste ambiente.

## Riscos e Dependencias

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Node v25 e versao impar sem LTS | Medio | Usar apenas para desenvolvimento local agora; padronizar Node LTS em CI futuro |
| Build Angular ser encerrado pelo sandbox com codigo `-1` | Medio | Executar build fora do sandbox quando necessario; o build passou sem erro de codigo |
| PRD citar endpoint de schema antigo | Medio | Tech spec frontend corrigiu para `/api/v1/data-dictionary/document-types/{type}/schema` |
| Backend nao possuir `/api/v1/settings` | Medio | Tasks de administracao limitadas a usuarios, API keys e webhook deliveries |
| Filters de documentos ainda nao existirem no backend | Baixo | UI prepara paginação real e filtros client-side/limitados ate contrato evoluir |

## Resultado Esperado

O frontend possui uma base tecnica pronta para as tasks funcionais seguintes: autenticação, dashboard, upload, documentos, dicionario, revisao, administracao e E2E.

## Validacao

Validado com:

```bash
npm test
npm run build
npx playwright test
```

Resultado registrado na Task 1:

- `npm test`: 3 arquivos de teste, 10 testes passando.
- `npm run build`: build de producao passando.
- `npx playwright test`: 1 smoke E2E passando.
- Dev server local respondendo em `http://127.0.0.1:4200/`.
