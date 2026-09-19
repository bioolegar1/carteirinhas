# Tarefa 5.0: [Frontend] Conformidade legal, carimbo ICP-Brasil e otimização para impressão A4

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar as seções institucionais e regulatórias do certificado (Conformidade com a Legislação, Validade e Verificabilidade, Observações Importantes e Carimbo de Assinatura Digital no rodapé), implementar o botão de ação "Clique aqui para baixar o certificado" invocando nativamente `window.print()`, e aplicar regras de estilo `@media print` para garantir que a impressão ou exportação em PDF seja diagramada perfeitamente no formato de folha A4.

**Tipo:** Frontend

**Tecnologias:** Angular 22, CSS/SCSS (@media print, Paged Media)

<requirements>
- Adicionar o botão/link de ação "Clique aqui para baixar o certificado" com `(click)="printCertificate()"`.
- No TypeScript, implementar o método `printCertificate()` chamando `window.print()`.
- Implementar as seções textuais com amparo na Lei nº 12.933/2013, regras de verificabilidade e observações sobre assinatura ICP-Brasil Tipo A-1 / A-3.
- Renderizar o rodapé oficial com carimbo de assinatura digital: "Assinado digitalmente por ABAFE - Associação Brasileira de Aprendizado e Foco no Estudante, conforme Lei 14.063/2020 e Medida Provisória nº 2.200-2/2001. Cidade/Data/Hora: Brasília, 02/06/2026, 22:17:55".
- Implementar regras `@media print`:
  - Definir `@page { size: A4 portrait; margin: 15mm 18mm; }`.
  - Ocultar botões de ação e navegação (`.no-print`, botão de download).
  - Preservar cores e fundos com `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
  - Evitar quebras de página inadequadas com `break-inside: avoid` no card e nas seções principais.
- Escrever testes unitários verificando a presença das seções legais e o disparo de `window.print()`.
</requirements>

## Subtarefas

- [x] 5.1 Adicionar marcação das seções legais, do botão de ação e do carimbo de rodapé em `student-certificate-page.component.html`.
- [x] 5.2 Implementar método `printCertificate()` em `student-certificate-page.component.ts`.
- [x] 5.3 Implementar regras `@media print` e responsividade em `student-certificate-page.component.scss`.
- [x] 5.4 Adicionar testes unitários em `student-certificate-page.component.spec.ts` validando presença dos textos legais e chamada de `window.print()` ao clicar no botão.

## Detalhes de Implementação

Referência na Tech Spec: Seção *Design de Implementação -> Frontend (Angular) -> Estilos e Regras de Impressão (@media print)*.

### Frontend

- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.ts`.
- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.html`.
- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.scss`.
- [x] Atualizar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.spec.ts`.

## Critérios de Sucesso

- O texto legal e o carimbo ICP-Brasil reproduzem fielmente os textos do modelo oficial da ABAFE.
- Clicar no link de download aciona o diálogo de impressão do navegador (`window.print()`).
- A visualização de impressão/PDF (`Cmd+P` / `Ctrl+P`) gera folha A4 com proporção perfeita, sem barras laterais, sem botões de tela e com quebras de página preservadas.
- Testes unitários passam com 100% de sucesso.

## Testes da Tarefa

### Frontend

- [ ] Testes de unidade do componente (`student-certificate-page.component.spec.ts`) validando:
  - Presença dos termos "Conformidade com Legislação", "Lei nº 12.933", "ICP-Brasil" e "Brasília".
  - Disparo da função `window.print()` através de espionagem (`spyOn(window, 'print')`) ao clicar no elemento de download.

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.ts`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.html`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.scss`
- `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.spec.ts`

## Comandos de Validação

### Frontend

```bash
# Testes
ng test --watch=false --browsers=ChromeHeadless --include='**/student-certificate-page.component.spec.ts'

# Build
ng build

# Lint
npm run lint
```
