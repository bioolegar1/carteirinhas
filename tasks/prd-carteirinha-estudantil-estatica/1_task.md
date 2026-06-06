# Tarefa 1.0: Criar base Angular estática para Vercel

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a estrutura inicial da aplicação Angular estática que receberá os componentes da carteirinha e será publicada na Vercel.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Criar aplicação Angular standalone com SCSS e roteamento.
- Preparar estrutura de pastas para `student-cards`.
- Configurar build estático compatível com Vercel.
- Não criar backend, API REST ou banco de dados.
- Preservar o HTML atual apenas como referência visual.
</requirements>

## Subtarefas

- [ ] 1.1 Verificar se já existe projeto Angular no repositório.
- [ ] 1.2 Criar ou ajustar bootstrap Angular standalone.
- [ ] 1.3 Configurar `app.routes.ts` com rota principal e fallback.
- [ ] 1.4 Criar estrutura base `src/app/student-cards/`.
- [ ] 1.5 Preparar pastas de assets para QR codes e fotos.
- [ ] 1.6 Configurar `vercel.json` apenas se necessário para fallback SPA.
- [ ] 1.7 Criar teste básico de inicialização da aplicação.

## Detalhes de Implementação

Seguir a Tech Spec em `tasks/prd-carteirinha-estudantil-estatica/techspec.md`, seções "Arquitetura do Sistema", "Rotas" e "Dependências Técnicas".

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- A aplicação Angular executa localmente.
- `ng build` gera artefato estático.
- A rota principal carrega sem erro.
- Não há dependência de backend.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de unidade da aplicação inicial.
- [ ] Teste de componente do shell principal quando criado.

### Integração

- [ ] Build estático executado com sucesso.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `angular.json`
- `package.json`
- `src/main.ts`
- `src/app/app.routes.ts`
- `src/styles.scss`
- `public/assets/qrs/.gitkeep`
- `public/assets/photos/.gitkeep`
- `vercel.json`

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
