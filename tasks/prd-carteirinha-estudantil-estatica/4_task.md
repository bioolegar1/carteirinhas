# Tarefa 4.0: Migrar layout da carteirinha para componentes Angular

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Migrar a frente e o verso do HTML existente para componentes Angular reutilizáveis, consumindo dados tipados.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Criar componentes de frente e verso da carteirinha.
- Consumir `StudentCardData` via input tipado.
- Preservar a identidade visual principal do HTML atual.
- Separar estilos em SCSS.
- Não incluir botão "Renove Agora".
- Não incluir seção de cadastro ou seletor.
</requirements>

## Subtarefas

- [ ] 4.1 Criar `StudentCardComponent`.
- [ ] 4.2 Criar `StudentCardFrontComponent`.
- [ ] 4.3 Criar `StudentCardBackComponent`.
- [ ] 4.4 Migrar estrutura visual da frente.
- [ ] 4.5 Migrar estrutura visual do verso.
- [ ] 4.6 Criar `AppHeaderComponent` se necessário.
- [ ] 4.7 Criar `BottomNavComponent` visual sem rotas inexistentes obrigatórias.
- [ ] 4.8 Criar testes de renderização dos dados principais.

## Detalhes de Implementação

Usar `commands/carteirinha.html` como referência visual e a Tech Spec para divisão de componentes.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- Frente exibe nome, documento, nascimento, curso, instituição, validade, código CIE e QR/placeholder.
- Verso exibe benefício, locais, texto legal, validador, SAC e validade nacional.
- Layout não contém renovação.
- Componentes recebem dados por input e não dependem de dados hardcoded no template.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de componente da frente.
- [ ] Teste de componente do verso.
- [ ] Teste garantindo ausência do texto "Renove Agora".

### Integração

- [ ] Não aplicável.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `commands/carteirinha.html`
- `src/app/student-cards/components/student-card/student-card.component.ts`
- `src/app/student-cards/components/student-card-front/student-card-front.component.ts`
- `src/app/student-cards/components/student-card-back/student-card-back.component.ts`
- `src/app/student-cards/components/bottom-nav/bottom-nav.component.ts`
- `src/app/student-cards/components/app-header/app-header.component.ts`

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
