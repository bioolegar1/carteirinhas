# Tarefa 7.0: Validar build estático, rotas diretas e testes E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Executar validação final da aplicação como produto estático, cobrindo build, links diretos, estados de erro e fluxos críticos em E2E.

**Tipo:** Integração

**Tecnologias:** Angular 21

<requirements>
- Build estático deve concluir com sucesso.
- Links diretos das 3 carteirinhas devem funcionar.
- ID inválido deve mostrar estado de não encontrado.
- Não deve haver seletor, lista de cadastro ou botão de renovação.
- Testes E2E devem cobrir renderização, flip e responsividade básica.
</requirements>

## Subtarefas

- [ ] 7.1 Configurar Playwright ou Cypress se ainda não existir.
- [ ] 7.2 Criar teste E2E para cada um dos 3 IDs válidos.
- [ ] 7.3 Criar teste E2E para ID inválido.
- [ ] 7.4 Criar teste E2E para flip por click.
- [ ] 7.5 Criar teste E2E garantindo ausência de renovação e seletor.
- [ ] 7.6 Validar viewport mobile e desktop.
- [ ] 7.7 Executar build final e registrar comando de deploy esperado para Vercel.

## Detalhes de Implementação

Seguir as seções "Testes E2E", "Sequenciamento de Desenvolvimento" e "Dependências Técnicas" da Tech Spec.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- `ng build` passa.
- Testes unitários/componentes passam.
- Testes E2E passam para IDs válidos e inválido.
- A aplicação está pronta para publicação estática na Vercel.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Testes unitários e de componentes existentes devem continuar passando.

### Integração

- [ ] Testes E2E de link direto.
- [ ] Testes E2E de ID inválido.
- [ ] Testes E2E de flip.
- [ ] Testes E2E de ausência de seletor e renovação.
- [ ] Testes E2E em mobile e desktop.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `playwright.config.ts`
- `e2e/student-card.spec.ts`
- `package.json`
- `angular.json`
- `vercel.json`
- `src/app/student-cards/data/student-cards.data.ts`

## Comandos de Validação

### Backend

```bash
# Não aplicável
```

### Frontend

```bash
ng test --include=**/*.spec.ts
ng build
ng lint
npx playwright test
```
