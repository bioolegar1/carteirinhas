# Tarefa 5.0: Implementar flip, estados de QR/foto e remoção de renovação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a interação de virar a carteirinha e os estados visuais para ausência de QR code ou foto, garantindo que não exista fluxo de renovação.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Flip deve funcionar por click/toque.
- Flip deve funcionar por teclado com Enter e Espaço.
- QR code deve aceitar imagem fornecida depois.
- Ausência de QR ou foto deve mostrar placeholder estável.
- Botão e fluxo "Renove Agora" devem estar ausentes.
</requirements>

## Subtarefas

- [ ] 5.1 Implementar estado de flip no `StudentCardComponent`.
- [ ] 5.2 Adicionar handlers de click, Enter e Espaço.
- [ ] 5.3 Implementar placeholder de foto.
- [ ] 5.4 Implementar placeholder de QR code.
- [ ] 5.5 Garantir suporte a imagem real via `qrImageUrl`.
- [ ] 5.6 Criar testes de flip por click e teclado.
- [ ] 5.7 Criar testes para placeholders.

## Detalhes de Implementação

Seguir as seções "Componentes", "Models/Interfaces" e "Testes de Componente" da Tech Spec.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- Carteirinha vira entre frente e verso.
- Interação é acessível por teclado.
- QR ausente não quebra o layout.
- Foto ausente não quebra o layout.
- Nenhum elemento de renovação é renderizado.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de componente para flip por click.
- [ ] Teste de componente para flip por teclado.
- [ ] Teste de componente para QR ausente.
- [ ] Teste de componente para foto ausente.

### Integração

- [ ] Não aplicável.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/student-cards/components/student-card/student-card.component.ts`
- `src/app/student-cards/components/student-card-front/student-card-front.component.ts`
- `src/app/student-cards/components/student-card-front/student-card-front.component.html`
- `src/app/student-cards/components/student-card-front/student-card-front.component.scss`
- `public/assets/qrs/`
- `public/assets/photos/`

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
