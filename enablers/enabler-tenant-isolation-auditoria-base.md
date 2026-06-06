# Enabler: Base transversal de tenant isolation, auditoria e sessao

**Tipo**: Arquitetura
**Prioridade**: Alta
**Estimativa**: M / 3 a 5 dias

## Contexto

O fluxo comercial basico multiempresa depende de isolamento rigoroso por `empresa_id`, autenticacao em duas etapas e auditoria minima em todas as entidades de negocio. Sem uma base transversal padronizada, cada novo modulo tende a reimplementar contexto de tenant, validacoes de acesso e campos auditaveis, aumentando risco de vazamento cross-tenant, inconsistencias de seguranca e retrabalho arquitetural.

Este enabler cria a camada compartilhada que habilita modulos futuros como compras, financeiro, fornecedor e relatorios sem repetir a mesma infraestrutura tecnica em cada entrega.

## Objetivos

- Padronizar o contexto de sessao tenant-aware no backend e no frontend
- Centralizar a base de auditoria minima e isolamento por `empresa_id`
- Definir contratos e pontos de extensao para novos modulos multiempresa

## Escopo

### Incluido

- Abstracao compartilhada para entidades auditaveis com `id`, `empresa_id`, `created_at` e `updated_at`
- Mecanismo padrao de resolucao do tenant a partir da sessao/JWT
- Padrao de seguranca para endpoints protegidos, guards de frontend e propagacao de token
- Convenções de repository e testes para evitar leitura/escrita fora do tenant
- Documentacao curta de uso para novos modulos

### Nao Incluido

- Implementacao de regras de negocio especificas de pessoa, produto, estoque ou venda
- Integracoes externas com provedores de identidade, SSO ou IAM corporativo
- Observabilidade avancada, tracing distribuido ou SIEM

## Critérios de Aceite

- [ ] Existe uma abstracao reutilizavel para auditoria minima adotavel por qualquer nova entity multiempresa
- [ ] O backend consegue resolver `empresa_id` da sessao autenticada sem depender de input manual do frontend para endpoints protegidos
- [ ] Existe um padrao unico para repositories tenant-aware e pelo menos um exemplo testado de consulta segura por tenant
- [ ] O frontend possui store/servico base para sessao tenant-aware e guard que bloqueia rotas sem empresa ativa
- [ ] Ha documentacao objetiva explicando como novos modulos devem consumir a base de tenant e auditoria

## Tarefas Técnicas

### Backend (se aplicável)

- [ ] Criar `AbstractTenantAuditableEntity` ou equivalente reutilizavel
- [ ] Criar resolvedor de contexto tenant a partir do JWT e utilitario para acesso no service layer
- [ ] Padronizar `SecurityConfig` e filtros/interceptors necessarios para APIs protegidas
- [ ] Definir contrato de repository tenant-aware com exemplos de `findByIdAndEmpresaId` e busca paginada segura
- [ ] Criar `@ControllerAdvice` padrao para erros de autenticacao, autorizacao e tenant invalido
- [ ] Criar testes de integracao que provem bloqueio cross-tenant

### Frontend (se aplicável)

- [ ] Criar `SessionStore` ou equivalente com usuario autenticado e empresa ativa
- [ ] Padronizar `AuthInterceptor` e `tenantGuard`
- [ ] Criar componente ou mecanismo visual padrao para exibir empresa ativa no shell autenticado
- [ ] Criar testes de guard e store para sessao sem tenant e com tenant valido

### Infraestrutura (se aplicável)

- [ ] Definir variaveis de ambiente/documentacao para segredo JWT, expiracao e configuracao de tenant session
- [ ] Padronizar massa de teste minima para usuario multiempresa em ambiente local/homolog

## Riscos e Dependências

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Implementacao parcial do tenant apenas na camada web | Alto | Validar tenant tambem em repositories e testes de integracao |
| Reuso inconsistente da abstracao auditavel | Medio | Documentar convencoes e exigir uso em review |
| Guard/interceptor de frontend divergindo do backend | Medio | Formalizar contrato de sessao e adicionar testes de integracao |
| Dependencia de segredo JWT mal configurado por ambiente | Alto | Padronizar configuracao por variaveis de ambiente e checklist de validacao |

## Resultado Esperado

Uma base arquitetural reutilizavel para modulos multiempresa, com sessao tenant-aware, auditoria minima, protecao cross-tenant e contrato claro de uso para backend e frontend. Com esse enabler concluido, novas features podem focar em regra de negocio sem reabrir o problema de autenticacao, tenant e rastreabilidade.

## Validação

Considerar o enabler concluido quando:

- um endpoint protegido de exemplo rejeitar acesso sem autenticacao, sem empresa ativa e com tenant incorreto
- uma entity nova puder herdar ou reutilizar a base auditavel sem duplicar campos
- um repository de exemplo estiver filtrando por `empresa_id` com teste automatizado cobrindo cross-tenant
- uma rota protegida do frontend estiver bloqueada quando nao houver empresa ativa na sessao
- a documentacao de uso estiver salva e apontando como novos modulos devem aderir ao padrao
