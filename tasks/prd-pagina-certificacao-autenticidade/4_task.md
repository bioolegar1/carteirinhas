# Tarefa 4.0: [Frontend] Layout oficial ABAFE, card cadastral e bloco de chave PEM

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Desenvolver o layout visual completo da declaração oficial ABAFE no componente `StudentCertificatePageComponent`, incluindo o banner verde superior `DOCUMENTO VÁLIDO`, texto de ateste institucional com dados interpolados, card central com foto do estudante (e tratamento de fallback para erro de carregamento), código CIE, campos cadastrais em colunas, QR Code e bloco da chave criptográfica ICP-Brasil em fonte monoespaçada.

**Tipo:** Frontend

**Tecnologias:** Angular 22, HTML5, SCSS modular

<requirements>
- Renderizar banner superior verde `#00e676` / `#00c853` com o texto em caixa alta: `DOCUMENTO VÁLIDO`.
- Inserir o parágrafo declaratório da ABAFE atestando a matrícula do estudante com nome, curso e instituição.
- Implementar o card central com cantos arredondados contendo:
  - Foto do estudante à esquerda em proporção 3x4 com fallback para placeholder se a imagem falhar (`(error)="onPhotoError()"`).
  - Código CIE/Uso abaixo da foto.
  - Nome completo em destaque.
  - Campos: Instituição, Curso, CPF, Data de Nascimento e Emissor.
  - Imagem do QR Code posicionada à direita no card.
- Inserir seção `Chave do Certificado:` com bloco `<pre>` em fonte monoespaçada exibindo a chave PEM do certificado ICP-Brasil com quebra automática de linha (`overflow-wrap: anywhere; word-break: break-all;`).
- Escrever testes unitários validando a correta renderização de todos os campos cadastrais e elementos visuais.
</requirements>

## Subtarefas

- [x] 4.1 Implementar marcação HTML do banner, ateste da ABAFE, card de identificação e bloco de chave PEM em `student-certificate-page.component.html`.
- [x] 4.2 Estilizar componentes no SCSS (`student-certificate-page.component.scss`) seguindo fielmente as proporções, cores e tipografia do modelo PDF da ABAFE.
- [x] 4.3 Implementar lógica de fallback de foto (`photoFailed` signal e método `onPhotoError()`) no componente TypeScript.
- [x] 4.4 Atualizar testes unitários (`student-certificate-page.component.spec.ts`) para verificar que nome, curso, instituição, CPF, código CIE e a chave PEM estão presentes no DOM.

## Detalhes de Implementação

Referência na Tech Spec: Seção *Design de Implementação -> Frontend (Angular) -> Componentes e Estilos*.

### Frontend

- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.ts`.
- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.html`.
- [x] Modificar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.scss`.
- [x] Atualizar `src/app/student-cards/pages/student-certificate-page/student-certificate-page.component.spec.ts`.

## Critérios de Sucesso

- O layout replica com alta fidelidade visual a primeira página do documento modelo da ABAFE.
- Os dados pessoais e acadêmicos do aluno selecionado são exibidos sem sobreposição ou quebras indevidas.
- A chave PEM aparece formatada corretamente em bloco monoespaçado.
- Caso a URL da foto falhe, um placeholder visual elegante é renderizado.
- Suite de testes unitários passa com 100% de sucesso.

## Testes da Tarefa

### Frontend

- [ ] Testes de unidade do componente (`student-certificate-page.component.spec.ts`) validando:
  - Renderização do banner `DOCUMENTO VÁLIDO`.
  - Exibição do nome completo do aluno (`card.fullName`).
  - Exibição do código CIE (`card.cieCode`).
  - Exibição da chave do certificado contendo `-----BEGIN CERTIFICATE-----`.
  - Ativação do estado `photoFailed` ao disparar o evento `(error)` na imagem da foto.

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
