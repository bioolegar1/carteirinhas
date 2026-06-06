# Enabler: Integração de OpenPDF para Exportação de Campos de Documentos

**Tipo**: Arquitetura
**Prioridade**: Alta
**Estimativa**: P / 2 a 4 horas

## Contexto

A feature `prd-dociq-document-fields-export` (Task 2) requer geração de PDF no servidor para exportação dos campos extraídos de documentos. O projeto ainda não possui nenhuma biblioteca de geração de PDF no backend.

A decisão técnica foi pelo **OpenPDF 2.0.3** (fork da biblioteca iText 5, licença LGPL), por ser gratuita, madura, com API estável e compatível com Java. Antes de implementar a Task 2, é necessário validar que a dependência se integra corretamente com Spring Boot 4.0.6 + Java 25 e que o padrão de uso está definido para uso consistente no `DocumentFieldExportService`.

Sem este enabler, a Task 2 pode encontrar problemas de compatibilidade em tempo de execução com o módulo system do Java 25 (reflective access, encapsulation) ou incompatibilidades transitividade de dependências.

## Objetivos

- Adicionar e validar a dependência OpenPDF 2.0.3 no `pom.xml`.
- Confirmar inicialização do Spring Boot sem conflitos após a adição.
- Executar uma prova de conceito que gera um PDF com tabela de dados em memória, confirmando que funciona com Java 25.
- Documentar o padrão de uso de `com.lowagie.text.Document` + `PdfPTable` para o `DocumentFieldExportService`.
- Identificar e mitigar qualquer aviso de compatibilidade de módulos Java 25 (`--add-opens` se necessário).

## Escopo

### Incluído

- Adição da dependência `com.github.librepdf:openpdf:2.0.3` ao `pom.xml`
- Verificação de conflito com dependências transitivas existentes (`pom.xml` atual usa iText ou similar? Verificar)
- POC de geração de PDF com `ByteArrayOutputStream` retornando `byte[]` — sem salvar em disco
- Teste unitário simples validando que `byte[].length > 0` e que o conteúdo inicia com `%PDF`
- Registro de qualquer flag JVM necessária (`maven-surefire-plugin` ou `JAVA_TOOL_OPTIONS`)
- Padrão documentado: como criar `Document`, `PdfWriter`, `PdfPTable`, células de cabeçalho e corpo

### Não Incluído

- Implementação completa do `DocumentFieldExportService` (pertence à Task 2)
- Estilização avançada de PDF (logo, branding, fontes customizadas)
- Geração de CSV (sem dependência nova — usa `StringBuilder` + BOM UTF-8 puro)
- Qualquer alteração nos módulos de domínio ou migrations

## Critérios de Aceite

- [ ] `com.github.librepdf:openpdf:2.0.3` declarado no `pom.xml` sem conflito de dependências
- [ ] `./mvnw clean verify` passa com a nova dependência (todos os testes existentes continuam verdes)
- [ ] POC gera `byte[]` não vazio cujo conteúdo inicia com a assinatura `%PDF`
- [ ] Teste unitário do POC passa no `./mvnw test`
- [ ] Nenhum `WARNING: An illegal reflective access` ou `InaccessibleObjectException` no build com Java 25
- [ ] Se necessário `--add-opens`, configurado no `maven-surefire-plugin` do `pom.xml` (não em variável de ambiente)

## Tarefas Técnicas

### Backend

- [ ] Verificar `pom.xml` atual: confirmar ausência de dependências iText 5 / iText 7 que possam conflitar
- [ ] Adicionar ao `pom.xml`:
  ```xml
  <dependency>
      <groupId>com.github.librepdf</groupId>
      <artifactId>openpdf</artifactId>
      <version>2.0.3</version>
  </dependency>
  ```
- [ ] Executar `./mvnw dependency:tree | grep -i pdf` — verificar árvore de dependências
- [ ] Executar `./mvnw clean verify` — confirmar zero regressões
- [ ] Criar classe de POC em `src/test/java/br/com/dociq/exporting/OpenPdfCompatibilityTest.java`:
  ```java
  @Test
  @DisplayName("Should generate valid PDF bytes using OpenPDF with Java 25")
  void shouldGenerateValidPdfBytes() throws Exception {
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      com.lowagie.text.Document doc = new com.lowagie.text.Document();
      PdfWriter.getInstance(doc, out);
      doc.open();
      PdfPTable table = new PdfPTable(3);
      table.addCell("Rótulo");
      table.addCell("Valor");
      table.addCell("Score");
      table.addCell("CNPJ Emitente");
      table.addCell("12.345.678/0001-90");
      table.addCell("98%");
      doc.add(table);
      doc.close();
      byte[] result = out.toByteArray();
      assertThat(result).isNotEmpty();
      assertThat(new String(result, 0, 4)).isEqualTo("%PDF");
  }
  ```
- [ ] Se Java 25 lançar `InaccessibleObjectException`, adicionar ao `maven-surefire-plugin`:
  ```xml
  <configuration>
      <argLine>--add-opens java.base/java.lang=ALL-UNNAMED</argLine>
  </configuration>
  ```
- [ ] Documentar padrão de uso no próprio `enabler` (seção Resultado Esperado)

## Riscos e Dependências

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| OpenPDF usa reflection interna incompatível com Java 25 module system | Alto | Adicionar `--add-opens` no surefire plugin; versão 2.x já endereça a maioria |
| Conflito de classe com dependência transitiva de iText em outra lib | Médio | Verificar `dependency:tree`; excluir transitiva se necessário via `<exclusion>` |
| `ByteArrayOutputStream` com documento grande causa pressão de memória | Baixo | Campos por documento são < 200; sem impacto relevante |

## Resultado Esperado

Projeto compila e todos os testes passam com OpenPDF presente. O padrão canônico para `DocumentFieldExportService` é:

```java
ByteArrayOutputStream out = new ByteArrayOutputStream();
com.lowagie.text.Document pdf = new com.lowagie.text.Document(PageSize.A4);
PdfWriter.getInstance(pdf, out);
pdf.open();

// Cabeçalho
pdf.add(new Paragraph("DocIQ — Campos Extraídos", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
pdf.add(new Paragraph("Documento: " + document.getId()));
pdf.add(new Paragraph("Gerado em: " + Instant.now()));
pdf.add(Chunk.NEWLINE);

// Tabela: 5 colunas — Rótulo, Valor, Score, Validação, Fonte
PdfPTable table = new PdfPTable(new float[]{3, 3, 1, 1.5f, 2});
table.setWidthPercentage(100);
// cabeçalho em negrito
// linhas com background alternado: BaseColor.WHITE / new BaseColor(245, 245, 245)
for (DocumentExtractedField field : fields) {
    table.addCell(field.getFieldLabel() != null ? field.getFieldLabel() : field.getFieldKey());
    table.addCell(String.valueOf(field.effectiveValue()));
    table.addCell(field.getConfidenceScore() != null ? field.getConfidenceScore() + "%" : "-");
    table.addCell(field.getValidationStatus().value());
    table.addCell(field.getExtractionSource().value());
}
pdf.add(table);
pdf.close();
return out.toByteArray();
```

## Validação

```bash
cd dociq-backend

# Verificar árvore de dependências PDF
./mvnw dependency:tree | grep -i -E "pdf|lowagie|itext"

# Rodar apenas o teste de compatibilidade
./mvnw test -Dtest=OpenPdfCompatibilityTest

# Build completo com todos os testes
./mvnw clean verify
```

Enabler concluído quando `./mvnw clean verify` passa sem erros ou warnings de módulo Java e o teste de compatibilidade gera um PDF válido.
