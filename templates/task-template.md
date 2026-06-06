# Tarefa X.0: [Título da Tarefa]

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

[Breve descrição da tarefa]

**Tipo:** [Backend | Frontend | Integração | Testes]

**Tecnologias:** [Java 21, Spring Boot 4.0.3 | Angular 21 | Ambos]

<requirements>
[Lista de requisitos obrigatórios]
</requirements>

## Subtarefas

- [ ] X.1 [Descrição da subtarefa]
- [ ] X.2 [Descrição da subtarefa]

## Detalhes de Implementação

[Seções relevantes da spec técnica **NÃO PRECISA MOSTRAR TODA A IMPLEMENTAÇÃO, APENAS REFERENCIE A techspec.md**]

### Backend (se aplicável)

- [ ] Criar/Modificar Entity
- [ ] Criar/Modificar Repository
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Controller
- [ ] Criar DTOs (records)
- [ ] Criar Migration (Flyway/Liquibase)

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- [Resultados mensuráveis]
- [Requisitos de qualidade]

## Testes da Tarefa

### Backend

- [ ] Testes de unidade (JUnit 5 + Mockito)
- [ ] Testes de integração (@SpringBootTest)

### Frontend

- [ ] Testes de unidade (Jasmine/Karma ou Vitest)
- [ ] Testes de componente

### Integração

- [ ] Testes E2E (Playwright ou Cypress)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- [Arquivos relevantes desta tarefa]

## Comandos de Validação

### Backend

```bash
# Testes
./mvnw test -Dtest=ClassNameTest

# Build
./mvnw clean verify

# Lint/Format
./mvnw spotless:check
```

### Frontend

```bash
# Testes
ng test --include=**/*.spec.ts

# Build
ng build

# Lint
ng lint
```
