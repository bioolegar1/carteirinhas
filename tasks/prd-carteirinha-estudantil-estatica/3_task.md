# Tarefa 3.0: Implementar resolução de carteirinha por URL direta

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a página que resolve o cadastro pelo identificador da URL e renderiza somente a carteirinha correspondente, sem seletor ou lista visível.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Resolver carteirinha por `id` na URL.
- Não exibir seletor, lista de estudantes ou tela de cadastro.
- Exibir estado de "carteirinha não encontrada" para ID inválido.
- Manter compatibilidade com deploy estático na Vercel.
- Não criar chamadas HTTP.
</requirements>

## Subtarefas

- [ ] 3.1 Criar `StudentCardPageComponent`.
- [ ] 3.2 Ler identificador por `?id=` ou rota conforme decisão final da implementação.
- [ ] 3.3 Resolver o cadastro em `STUDENT_CARDS`.
- [ ] 3.4 Renderizar estado de não encontrado para ID inválido.
- [ ] 3.5 Garantir que a UI não revele lista de cadastros.
- [ ] 3.6 Criar testes de resolução por ID válido e inválido.

## Detalhes de Implementação

Seguir as seções "Componentes" e "Rotas" da Tech Spec. A opção recomendada é `?id=<studentId>` para simplificar deploy estático.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- Link com ID válido mostra a carteirinha correta.
- Link com ID inválido mostra estado de erro simples.
- A tela não tem seção de cadastro nem seletor.
- O comportamento funciona após build.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de componente para ID válido.
- [ ] Teste de componente para ID inválido.
- [ ] Teste garantindo ausência de lista/seletor.

### Integração

- [ ] Não aplicável.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/app.routes.ts`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.ts`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.html`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.scss`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.spec.ts`

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
```
