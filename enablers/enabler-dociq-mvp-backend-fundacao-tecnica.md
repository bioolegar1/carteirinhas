# Enabler: Fundacao tecnica do backend DocIQ MVP

**Tipo**: Arquitetura
**Prioridade**: Alta
**Estimativa**: M / 3 a 5 dias

## Contexto

O PRD, a tech spec e o plano de tasks do DocIQ MVP Backend dependem de uma base tecnica com Java 25, Spring Boot 4.0.6, PostgreSQL, RabbitMQ, Redis, MinIO/S3, Flyway, Tess4J/Tesseract e LangChain4j. Essa combinacao tem pontos de risco antes da implementacao funcional: compatibilidade real das bibliotecas com Java 25/Spring Boot 4, desenho de modulos internos, ambiente local reproduzivel, padrao de testes com servicos externos e convencoes de observabilidade.

Este enabler prepara essas decisoes tecnicas para que as tasks `1.0` a `9.0` sejam executadas com menos retrabalho, principalmente nas areas de bootstrap, dependencias, contratos transversais, Testcontainers e limites entre modulos.

## Objetivos

- Validar a compatibilidade minima da stack backend definida no PRD e na tech spec.
- Definir a fundacao arquitetural do monolito modular antes da implementacao das features.
- Padronizar ambiente local, profiles, Testcontainers, logs estruturados e convencoes de modulo.
- Identificar riscos tecnicos bloqueantes antes das tasks de implementacao.

## Escopo

### Incluido

- Spike de compatibilidade para Java 25, Spring Boot 4.0.6 e dependencias principais.
- Esqueleto conceitual dos modulos backend: identidade, documentos, dicionario, processamento, extracao, revisao, webhook, auditoria e observabilidade.
- Decisao documentada sobre Maven ou Gradle e versoes travadas das dependencias.
- Prova de inicializacao local com PostgreSQL, RabbitMQ, Redis e MinIO/S3.
- Padrao de profiles `local`, `test` e `prod`.
- Padrao de testes de integracao com Testcontainers.
- Convencao de logs estruturados com `correlation_id`, `document_id`, `organization_id`, `stage`, `status`, `duration_ms`, `error_code` e `error_message`.
- Registro de riscos e decisoes tecnicas para orientar as tasks numeradas.

### Nao Incluido

- Implementacao completa de entidades, endpoints ou regras de negocio.
- Implementacao final de OCR, IA fallback, extratores, webhooks ou dashboard.
- Criacao completa das migrations de dominio.
- CI/CD definitivo.
- Implementacao frontend.
- Integracao fiscal oficial com SEFAZ ou conectores ERP.

## Critérios de Aceite

- [ ] Existe uma matriz de compatibilidade validando Java 25, Spring Boot 4.0.6, PostgreSQL, RabbitMQ, Redis, MinIO/S3, Flyway, Tess4J e LangChain4j.
- [ ] O projeto consegue inicializar em modo local com dependencias externas basicas disponiveis.
- [ ] Foi definida e documentada a escolha entre Maven ou Gradle, incluindo versoes travadas das dependencias principais.
- [ ] Existe uma proposta de estrutura de pacotes para o monolito modular alinhada com `techspec.md`.
- [ ] Existe um exemplo minimo de teste de integracao com Testcontainers para PostgreSQL.
- [ ] Existe um exemplo minimo de teste ou health check para RabbitMQ, Redis e MinIO/S3.
- [ ] Existe uma convencao documentada para logs estruturados, correlation ID e mascaramento de dados sensiveis.
- [ ] Existe uma lista de riscos tecnicos remanescentes com mitigacao e task impactada.

## Tarefas Técnicas

## Agentes/Skills Recomendados

Use este comando para aplicar o enabler chamando os agentes necessários:

```md
$java-springboot $docker-compose-orchestration $postgresql-table-design $redis-development $loom-event-driven $java-testing $loom-logging-observability $owasp-security-check $langchain4j-spring-boot-integration $ocr-document-processor @enablers/enabler-dociq-mvp-backend-fundacao-tecnica.md
```

Uso recomendado por foco:

```md
$java-springboot $docker-compose-orchestration $postgresql-table-design $java-testing @enablers/enabler-dociq-mvp-backend-fundacao-tecnica.md
$loom-event-driven $redis-development $loom-logging-observability @enablers/enabler-dociq-mvp-backend-fundacao-tecnica.md
$owasp-security-check $langchain4j-spring-boot-integration $ocr-document-processor @enablers/enabler-dociq-mvp-backend-fundacao-tecnica.md
```

### Backend (se aplicável)

- [ ] Criar POC minima de aplicacao Spring Boot 4.0.6 com Java 25.
- [ ] Validar dependencias principais no build: Spring Web, Security, Data JPA, AMQP, Redis, Actuator, Flyway, PostgreSQL driver, Tess4J e LangChain4j.
- [ ] Definir padrao de pacotes para `identityaccess`, `documents`, `datadictionary`, `processing`, `extraction`, `review`, `webhook`, `audit` e `observability`.
- [ ] Definir convencao para DTOs records, exceptions, `ControllerAdvice` e paginação.
- [ ] Criar POC de correlation ID em request HTTP e log estruturado.
- [ ] Definir convencao de enums centrais: `DocumentStatus`, `DocumentType`, `ValidationStatus`, `ExtractionSource`, `UserRole` e `WebhookDeliveryStatus`.
- [ ] Documentar como cada task deve consultar `prd.md` e `techspec.md` antes de implementar.

### Frontend (se aplicável)

- [ ] Nao aplicavel. Este enabler e exclusivo do backend, mas deve preservar contratos OpenAPI consumiveis pelo futuro frontend Angular.

### Infraestrutura (se aplicável)

- [ ] Validar Docker Compose local com PostgreSQL, RabbitMQ, Redis e MinIO.
- [ ] Definir variaveis de ambiente obrigatorias para banco, fila, cache, storage, JWT, API key e IA.
- [ ] Definir profiles `local`, `test` e `prod`.
- [ ] Criar exemplo de Testcontainers para PostgreSQL.
- [ ] Avaliar viabilidade de Testcontainers para RabbitMQ, Redis e MinIO no ciclo de testes.
- [ ] Definir exposicao minima de Actuator: health, readiness, liveness e metrics.

## Riscos e Dependências

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Alguma biblioteca nao estar pronta para Java 25 ou Spring Boot 4.0.6 | Alto | Fazer spike de build e inicializacao antes da Task 1 |
| Tess4J/Tesseract exigir dependencias nativas dificeis no ambiente local/CI | Alto | Isolar por `OcrProvider` e usar provider fake nos testes automatizados |
| LangChain4j exigir configuracao de provider externo cedo demais | Medio | Usar adapter fake no teste e deixar provider real configuravel por ambiente |
| Testcontainers aumentar muito o tempo de execucao dos testes | Medio | Separar testes unitarios, integracao leve e integracao completa por profile |
| Modulos internos ficarem acoplados por entities JPA compartilhadas | Alto | Definir services publicos, eventos internos e DTOs de fronteira entre modulos |
| Logs estruturados vazarem CPF, CNPJ, token ou API key | Alto | Definir mascaramento e checklist de log antes das tasks de auth/upload |

## Resultado Esperado

Ao final deste enabler, o time deve ter uma fundacao tecnica validada para iniciar a implementacao das tasks do DocIQ MVP Backend com menos incerteza: stack compilando, servicos locais definidos, padrao modular documentado, abordagem de testes preparada, convencoes transversais alinhadas e riscos tecnicos conhecidos.

## Validação

Considerar o enabler concluido quando:

- a POC backend iniciar com Java 25 e Spring Boot 4.0.6;
- o build resolver as dependencias principais sem conflito bloqueante;
- PostgreSQL, RabbitMQ, Redis e MinIO subirem localmente por Docker Compose;
- pelo menos um teste de integracao com Testcontainers executar com sucesso;
- a convencao de pacotes, logs, profiles e variaveis obrigatorias estiver documentada;
- os riscos remanescentes estiverem associados as tasks `1.0` a `9.0`;
- nenhuma implementacao funcional das tasks tiver sido iniciada dentro deste enabler.
