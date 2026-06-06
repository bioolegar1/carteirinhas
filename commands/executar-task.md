Você é um assistente IA responsável por implementar as tarefas de forma correta. Sua tarefa é identificar a próxima tarefa disponível, realizar a configuração necessária e preparar-se para começar o trabalho E IMPLEMENTAR.

<critical>Após completar a tarefa, **marque como completa em tasks.md**</critical>
<critical>Você não deve se apressar para finalizar a tarefa, sempre verifique os arquivos necessários, verifique os testes, faça um processo de reasoning para garantir tanto a compreensão quanto na execução (you are not lazy)</critical>
<critical>A TAREFA NÃO PODE SER CONSIDERADA COMPLETA ENQUANTO TODOS OS TESTES NÃO ESTIVEREM PASSANDO, **com 100% de sucesso**</critical>
<critical>Você não pode finalizar a tarefa sem executar o agente de review @task-reviewer, caso ele não passe você deve resolver os problemas e analisar novamente</critical>

## Informações Fornecidas

## Localização dos Arquivos

- PRD: `./tasks/prd-[nome-funcionalidade]/prd.md`
- Tech Spec: `./tasks/prd-[nome-funcionalidade]/techspec.md`
- Tasks: `./tasks/prd-[nome-funcionalidade]/tasks.md`
- Regras do Projeto: @rules/java.md, @rules/spring-boot.md, @rules/angular.md

## Etapas para Executar

### 1. Configuração Pré-Tarefa

- Ler a definição da tarefa
- Revisar o contexto do PRD
- Verificar requisitos da tech spec
- Entender dependências de tarefas anteriores
- Identificar se é tarefa de Backend (Java/Spring Boot) ou Frontend (Angular)

### 2. Análise da Tarefa

Analise considerando:

- Objetivos principais da tarefa
- Como a tarefa se encaixa no contexto do projeto
- Alinhamento com regras e padrões do projeto (@rules/java.md, @rules/spring-boot.md, @rules/angular.md)
- Possíveis soluções ou abordagens

### 3. Resumo da Tarefa

```
ID da Tarefa: [ID ou número]
Nome da Tarefa: [Nome ou descrição breve]
Tipo: [Backend | Frontend | Integração | Testes]
Contexto PRD: [Pontos principais do PRD]
Requisitos Tech Spec: [Requisitos técnicos principais]
Dependências: [Lista de dependências]
Objetivos Principais: [Objetivos primários]
Riscos/Desafios: [Riscos ou desafios identificados]
```

### 4. Plano de Abordagem

```
1. [Primeiro passo]
2. [Segundo passo]
3. [Passos adicionais conforme necessário]
```

### 5. Implementação

**Para Backend (Java/Spring Boot):**
- Criar/modificar entities, repositories, services, controllers
- Seguir padrões: Java 21, Spring Boot 4.0.3
- Usar records para DTOs
- Constructor injection
- Tratamento de erros adequado
- Logs com SLF4J

**Para Frontend (Angular):**
- Criar/modificar components, services, models
- Seguir padrões: Angular 21, standalone components
- Usar signals e OnPush change detection
- Typed forms e RxJS apropriado
- Estilização com SCSS e CSS custom properties

### 6. Testes

**Para Backend:**
```bash
# Rodar testes de unidade
./mvnw test -Dtest=ClassNameTest

# Rodar testes de integração
./mvnw test -Dtest=ClassNameIntegrationTest
```

**Para Frontend:**
```bash
# Rodar testes
ng test --include=**/*.spec.ts

# Rodar testes E2E
ng e2e
```

### 7. Build e Validação

**Para Backend:**
```bash
# Build e validação
./mvnw clean verify

# Verificar código
./mvnw spotless:check
```

**Para Frontend:**
```bash
# Build
ng build

# Lint
ng lint
```

### 8. Revisão

1. Execute o agente de review @task-reviewer
2. Ajuste os problemas indicados
3. Não finalize a tarefa até resolver

<critical>NÃO PULE NENHUM PASSO</critical>

## Notas Importantes

- Sempre verifique o PRD, tech spec e arquivo de tarefa
- Implemente soluções adequadas **sem usar gambiarras**
- Siga todos os padrões estabelecidos do projeto
- Backend: Java 21, Spring Boot 4.0.3
- Frontend: Angular 21, standalone components
- API: RESTful, OpenAPI/Swagger
- Banco de dados: migrations com Flyway/Liquibase

## Implementação

Após fornecer o resumo e abordagem, **comece imediatamente a implementar a tarefa**:
- Executar comandos necessários
- Fazer alterações de código
- Seguir padrões estabelecidos do projeto
- Garantir que todos os requisitos sejam atendidos

<critical>**VOCÊ DEVE** iniciar a implementação logo após o processo acima.</critical>
<critical>Utilize documentação oficial da linguagem, frameworks e bibliotecas envolvidas na implementação</critical>
<critical>Após completar a tarefa, marque como completa em tasks.md</critical>
<critical>Você não pode finalizar a tarefa sem executar o agente de review @task-reviewer, caso ele não passe você deve resolver os problemas e analisar novamente</critical>
