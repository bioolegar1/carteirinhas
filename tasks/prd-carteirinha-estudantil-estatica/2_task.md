# Tarefa 2.0: Definir models, dados locais e 3 cadastros iniciais

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar os modelos TypeScript e a fonte local de dados com 3 cadastros iniciais, usando placeholders até o envio dos dados definitivos e do QR code.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Criar interfaces conforme Tech Spec.
- Criar constante local `STUDENT_CARDS`.
- Incluir exatamente 3 cadastros iniciais.
- Cada cadastro deve ter `id` único, legível e estável.
- QR code deve ser opcional e aceitar imagem fornecida depois.
- Não exibir lista ou área de cadastro na UI.
</requirements>

## Subtarefas

- [ ] 2.1 Criar `student-card.model.ts`.
- [ ] 2.2 Criar `student-cards.data.ts` com 3 objetos iniciais.
- [ ] 2.3 Definir placeholders seguros para dados ainda não enviados.
- [ ] 2.4 Adicionar campos opcionais para `photoUrl` e `qrImageUrl`.
- [ ] 2.5 Criar teste garantindo 3 cadastros e IDs únicos.
- [ ] 2.6 Criar teste garantindo campos mínimos preenchidos.

## Detalhes de Implementação

Seguir a seção "Models/Interfaces" da Tech Spec. Os dados devem ficar no frontend e ser empacotados no build.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- Existem 3 cadastros iniciais tipados.
- Nenhum cadastro compartilha o mesmo `id`.
- A ausência de QR/foto não quebra os dados.
- Os dados podem ser importados por componentes Angular.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de unidade para quantidade de cadastros.
- [ ] Teste de unidade para unicidade de IDs.
- [ ] Teste de unidade para campos obrigatórios.

### Integração

- [ ] Não aplicável.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/student-cards/models/student-card.model.ts`
- `src/app/student-cards/data/student-cards.data.ts`
- `src/app/student-cards/data/student-cards.data.spec.ts`

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
