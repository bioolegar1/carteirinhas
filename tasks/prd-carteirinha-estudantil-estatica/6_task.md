# Tarefa 6.0: Ajustar responsividade, acessibilidade e experiência mobile

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Refinar a interface para mobile e desktop, garantindo leitura, acessibilidade, foco visível e ausência de sobreposição.

**Tipo:** Frontend

**Tecnologias:** Angular 21

<requirements>
- Layout deve funcionar em mobile e desktop.
- Textos longos não devem sobrepor outros elementos.
- Elementos interativos devem ter nome acessível e foco visível.
- Animação deve respeitar `prefers-reduced-motion`.
- Conteúdo não deve ficar coberto pela navegação inferior.
</requirements>

## Subtarefas

- [ ] 6.1 Ajustar dimensões responsivas da carteira.
- [ ] 6.2 Tratar nomes, cursos e instituições longos.
- [ ] 6.3 Garantir foco visível no card interativo.
- [ ] 6.4 Adicionar textos alternativos para QR/foto quando aplicável.
- [ ] 6.5 Implementar regra CSS para `prefers-reduced-motion`.
- [ ] 6.6 Verificar contraste e legibilidade.
- [ ] 6.7 Criar testes ou validações automatizadas de acessibilidade básica.

## Detalhes de Implementação

Seguir as seções "Frontend", "Monitoramento e Observabilidade" e "Riscos Conhecidos" da Tech Spec.

### Backend (se aplicável)

- [ ] Não aplicável.

### Frontend (se aplicável)

- [ ] Criar/Modificar Model/Interface TypeScript
- [ ] Criar/Modificar Service
- [ ] Criar/Modificar Componente(s)
- [ ] Adicionar rota(s)
- [ ] Estilização (SCSS)

## Critérios de Sucesso

- Não há sobreposição visível em viewport mobile.
- Carteirinha permanece legível sem zoom manual.
- Flip é operável por teclado.
- Layout respeita usuários com redução de movimento.
- Navegação inferior não cobre conteúdo crítico.

## Testes da Tarefa

### Backend

- [ ] Não aplicável.

### Frontend

- [ ] Teste de componente para atributos acessíveis.
- [ ] Teste de componente para estado de foco/role quando aplicável.

### Integração

- [ ] Validação visual em viewports mobile e desktop.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/styles.scss`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.scss`
- `src/app/student-cards/components/student-card/student-card.component.scss`
- `src/app/student-cards/components/student-card-front/student-card-front.component.scss`
- `src/app/student-cards/components/student-card-back/student-card-back.component.scss`

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
