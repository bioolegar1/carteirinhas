# Tarefa 3.0: [Frontend] Estrutura da página de certificação e configuração de rota

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o componente standalone `StudentCertificatePageComponent`, configurar a rota `/certificado` em `app.routes.ts` com lazy-loading e implementar a resolução reativa do aluno a partir do query parameter `?id=`, gerenciando a alternância entre a visão do certificado e o estado amigável de "Certificado não encontrado".

**Tipo:** Frontend

**Tecnologias:** Angular 22, Angular Router, Signals, Jasmine/Karma

<requirements>
- Adicionar a rota `path: 'certificado'` em `src/app/app.routes.ts` antes da regra de wildcard.
- Criar `StudentCertificatePageComponent` com `ChangeDetectionStrategy.OnPush`.
- Utilizar `signal` e `computed` para ler `?id=` via `ActivatedRoute` e resolver `certificateView` através de `StudentCertificateDataService`.
- Tratar estado de fallback: quando `certificateView()` for nulo, renderizar bloco com mensagem "Certificado não encontrado" com atributo `aria-live="polite"`.
- Implementar testes unitários do componente cobrindo os fluxos com ID válido e ID inválido.
</requirements>

## Subtarefas

- [x] 3.1 Adicionar a rota `path: 'certificado'` com lazy-loading em `src/app/app.routes.ts`.
- [x] 3.2 Criar os arquivos do componente em `src/app/student-cards/pages/student-certificate-page/` (`.ts`, `.html`, `.scss`, `.spec.ts`).
- [x] 3.3 Implementar leitura de query params e binding condicional `@if (certificateView(); as view) ... @else ...` no template HTML.
- [x] 3.4 Criar suite de testes unitários em `student-certificate-page.component.spec.ts` validando exibição do conteúdo para aluno válido e mensagem de erro para ID não existente.

## Detalhes de Implementação

Referência na Tech Spec: Seção *Design de Implementação -> Frontend (Angular) -> Componentes e Rotas*.

### Frontend

- [x] Modificar `src/app/app.routes.ts`.
- [x] Criar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.ts`.
- [x] Criar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.html`.
- [x] Criar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.scss`.
- [x] Criar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.spec.ts`.

## Critérios de Sucesso

- Rota `/certificado?id=ricardo` carrega o componente `StudentCertificatePageComponent` sob demanda.
- O componente reage a mudanças na URL e obtém os dados reativamente via `computed()`.
- Acesso com ID inválido (`?id=desconhecido`) exibe feedback acessível de certificado não encontrado.
- Testes unitários do componente passam com 100% de sucesso.

## Testes da Tarefa

### Frontend

- [ ] Testes de unidade do componente (`student-certificate-page.component.spec.ts`) validando:
  - Inicialização com `id=ricardo` resolvendo `certificateView`.
  - Inicialização com `id=inexistente` renderizando o container `.not-found`.
  - Acessibilidade do estado de erro (`aria-live="polite"` presente).

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/app.routes.ts`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.ts`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.html`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.scss`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.spec.ts`

## Comandos de Validação

### Frontend

```bash
# Testes
ng test --watch=false --browsers=ChromeHeadless --include='**/student-certificate-page.component.spec.ts'

# Build
ng build

# Lint
npm run lint
```
