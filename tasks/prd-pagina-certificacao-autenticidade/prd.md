# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

A funcionalidade consiste na criação de uma página de certificação e declaração de autenticidade da Carteira de Identidade Estudantil (CIE) digital. Essa página atesta a regularidade de matrícula do estudante, sua vinculação com a instituição de ensino e o direito ao benefício de meia-entrada conforme a legislação nacional vigente.

O design e o conteúdo da página são diretamente inspirados no modelo oficial de certificado emitido pela ABAFE (Associação Brasileira de Aprendizado e Foco no Estudante), referenciado a partir do documento padrão `7f347123ae1e758fb2d9-cert-4c7564b9-1780449475225.pdf`.

A solução será integrada ao frontend estático em Angular existente, sendo acessada de forma direta através da rota `/certificado?id={studentId}`. A entrega inicial contempla especificamente os cadastros de **Ricardo** (`id=ricardo`) e **Jenifer** (`id=jenifer`), estruturando os dados de certificado e preparando o link para que os respectivos QR Codes possam apontar para esta verificação de autenticidade.

## Objetivos

- Disponibilizar uma rota pública `/certificado?id={studentId}` para conferência de autenticidade e validade da carteira estudantil.
- Atender inicialmente aos estudantes predefinidos **Ricardo** (`id=ricardo`) e **Jenifer** (`id=jenifer`), reutilizando os dados cadastrais já cadastrados no projeto.
- Reproduzir com fidelidade a identidade visual e o conteúdo institucional do modelo da ABAFE:
  - Banner de topo com destaque visual de status: "DOCUMENTO VÁLIDO".
  - Texto declaratório institucional de ateste de regularidade de matrícula.
  - Card centralizado com foto do estudante, código de uso, nome completo, instituição, curso, CPF, data de nascimento, emissor e QR code.
  - Exibição de chave pública/certificado digital ICP-Brasil em bloco de texto criptográfico padrão PEM (`-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----`).
  - Ação "Clique aqui para baixar o certificado" que dispara a visualização de impressão/salvar como PDF (`window.print()`), devidamente estilizada para documento A4.
  - Seções de conformidade com a legislação (Lei Federal nº 12.933/2013), critérios de validade, verificabilidade e observações sobre assinatura digital ICP-Brasil.
  - Rodapé oficial com carimbo de assinatura digital ICP-Brasil contendo cidade, data e horário de emissão.
- Tratar estado amigável de "Certificado não encontrado" caso o `id` informado na query string não exista.
- Manter o padrão arquitetural do projeto: frontend 100% estático, sem backend, sem banco de dados, com performance instantânea e compatível com deploy na Vercel.

**Métrica de sucesso**: Acesso direto a `/certificado?id=ricardo` e `/certificado?id=jenifer` renderizando declarações visualmente impecáveis, responsivas em dispositivos móveis e desktops, e gerando um PDF idêntico ao modelo da ABAFE ao acionar o botão de impressão/download.

## Histórias de Usuário

- Como fiscal, bilheteiro ou validador de eventos culturais/esportivos, eu quero acessar o link de certificação (inclusive via leitura de QR Code) para verificar instantaneamente se o documento do estudante é autêntico, válido e emitido conforme a Lei nº 12.933/2013.
- Como estudante (Ricardo ou Jenifer), eu quero acessar e exibir minha página de certificação com meus dados pessoais, foto, curso e chave ICP-Brasil para comprovar minha condição estudantil com respaldo jurídico.
- Como estudante ou usuário, eu quero acionar a opção "Clique aqui para baixar o certificado" para salvar ou imprimir o documento formatado em padrão de folha A4 com aparência oficial.
- Como mantenedor do projeto, eu quero que os dados do certificado fiquem associados aos cadastros de estudantes em uma estrutura modular, facilitando a expansão futura para outros alunos.

## Funcionalidades Principais

### 1. Resolução e Roteamento de Certificado por Identificador
- O sistema deve responder na rota `/certificado` recebendo o parâmetro `?id={studentId}` via query string (ex: `/certificado?id=ricardo` e `/certificado?id=jenifer`).
- A resolução do estudante deve ser feita de forma reativa a partir dos dados locais existentes.
- Caso o `id` não seja informado ou não coincida com nenhum aluno cadastrado, deve ser exibida uma mensagem clara informando que o certificado não foi localizado.

### 2. Cabeçalho de Status e Declaração de Validade
- Banner superior de destaque em verde vibrante contendo o texto centralizado em caixa alta: `DOCUMENTO VÁLIDO`.
- Parágrafo atestatório oficial declarando que a associação emissora (ABAFE - Associação Brasileira de Aprendizado e Foco no Estudante) atesta a matrícula regular do estudante no curso e instituição correspondentes, com direito à emissão da CIE conforme legislação vigente.

### 3. Card de Identificação do Estudante
- Exibição de card central com cantos arredondados contendo:
  - Foto do estudante à esquerda, acompanhada de seu código de uso (ex: `484F61C4` para Ricardo e `485A61C4` para Jenifer).
  - Nome completo em destaque tipográfico.
  - Campos identificados: Instituição, Curso, CPF, Data de Nascimento e Emissor.
  - QR Code do estudante posicionado no canto superior direito do card.

### 4. Chave do Certificado Digital (ICP-Brasil)
- Seção intitulada `Chave do Certificado:` com destaque sutil.
- Bloco em fonte monoespaçada (`monospace`) contendo a estrutura X.509 em formato PEM:
  ```text
  -----BEGIN CERTIFICATE-----
  ...
  -----END CERTIFICATE-----
  ```
- Reutilização da chave criptográfica oficial presente no documento modelo da ABAFE para ambos os estudantes.

### 5. Ação de Impressão / Download de Certificado
- Link estilizado como botão/ação com o texto: `Clique aqui para baixar o certificado`.
- Ao ser acionado, dispara a função nativa `window.print()`.
- O layout deve conter regras de `@media print` dedicadas para suprimir elementos desnecessários de tela e formatar perfeitamente o documento em folha A4 (duas páginas proporcionais ou página única compactada, seguindo o padrão do documento oficial).

### 6. Conformidade Legal e Observações Regulatórias
- Seção `Conformidade com Legislação`: explicitação do embasamento na Lei Federal nº 12.933/2013 e padronização nacional de identidade estudantil.
- Seção `Validade e Verificabilidade`: lista de formas de validação (QR Code, portal validador, apresentação do documento assinado e contato direto com a associação).
- Seção `Observações Importantes`: esclarecimento sobre assinatura digital ICP-Brasil (Tipo A-1 ou A-3), advertência legal sobre falsificação e responsabilidade da entidade emissora.
- Rodapé com carimbo oficial: "Assinado digitalmente por ABAFE - Associação Brasileira de Aprendizado e Foco no Estudante, conforme Lei 14.063/2020 e Medida Provisória nº 2.200-2/2001. Cidade/Data/Hora: Brasília, 02/06/2026, 22:17:55".

## Requisitos de Frontend (Angular)

- **Componentes**:
  - `StudentCertificatePageComponent`: componente de página standalone responsável por capturar o parâmetro de rota `id`, consultar os dados e renderizar a declaração ou o estado de erro.
  - Estilização em SCSS modular e responsivo, mantendo fidelidade estrita à tipografia, espaçamentos, cores e proporções do modelo ABAFE.
- **Roteamento**:
  - Registro da rota `certificado` em `app.routes.ts` com carregamento lazy-loaded.
- **Estilos de Impressão (`@media print`)**:
  - Otimização para impressão em folhas A4: quebras de página controladas (`page-break-inside: avoid`), margens limpas e preservação de cores de fundo (`-webkit-print-color-adjust: exact`).
- **Acessibilidade & Semântica**:
  - Tags semânticas adequadas (`header`, `main`, `section`, `footer`).
  - Textos alternativos descritivos para fotos e QR Codes.
  - Contraste de cores em conformidade com as diretrizes de legibilidade.

## Requisitos de Backend (Spring Boot)

*Não aplicável nesta entrega.*

O projeto é 100% estático, executado integralmente no navegador do cliente e hospedado na Vercel sem dependência de serviços de backend, microserviços ou endpoints de API remotos.

## Requisitos de Dados

Os dados necessários para a emissão do certificado serão agregados a partir dos dados já existentes em `STUDENT_CARDS` e complementados com metadados do certificado digital:

- **Dados cadastrais do estudante** (oriundos do modelo `StudentCardData`):
  - `id`: identificador do aluno (`ricardo`, `jenifer`).
  - `fullName`: nome completo do estudante.
  - `cieCode`: código de uso / CIE.
  - `institution`: instituição de ensino.
  - `course`: curso matriculado.
  - `documentNumber`: número do CPF/CIN.
  - `birthDate`: data de nascimento.
  - `photoUrl`: foto do estudante.
  - `qrImageUrl`: QR Code de autenticação.
  - `issuer`: dados da entidade emissora (ABAFE).
- **Dados do certificado digital**:
  - `certificateKey`: bloco PEM da chave criptográfica ICP-Brasil.
  - `city`: cidade de emissão (Brasília).
  - `issuedAt`: data e hora de emissão registrada (`02/06/2026, 22:17:55`).
  - `legalFramework`: referências legais (Lei 14.063/2020 e MP nº 2.200-2/2001).

## Experiência do Usuário

- **Fluidez e Rapidez**: Carregamento instantâneo da página ao abrir o link direto, sem telas intermediárias ou necessidade de login.
- **Confiabilidade Visual**: O design transmite seriedade e veracidade institucional, com tipografia nítida, selo de aprovação verde e carimbo digital claro.
- **Responsividade**: Adaptação para visualização em smartphones com leitura confortável de todos os blocos de texto e sem rolagem horizontal no bloco da chave criptográfica (usando quebra de linha ou caixa com overflow suave).
- **Impressão Pronta**: A ação de download imprime diretamente o formato documental em A4 idêntico ao modelo da ABAFE.

## Restrições Técnicas de Alto Nível

- Implementação estritamente em Angular 22 com Standalone Components e Signals.
- Não adicionar bibliotecas pesadas de geração de PDF no cliente caso o recurso nativo de impressão com `@media print` atenda com fidelidade.
- Preservar compatibilidade com a configuração de build e rewrite de SPA da Vercel (`vercel.json`).
- Respeitar a integridade dos dados já cadastrados dos estudantes no arquivo [src/app/student-cards/data/student-cards.data.ts](file:///Users/olegari/Documents/carterinhas/src/app/student-cards/data/student-cards.data.ts).

## Fora de Escopo

- Backend ou banco de dados externo.
- Validação criptográfica em tempo real contra Autoridades Certificadoras (AC) via OCSP ou listas de revogação de certificados (LCR).
- Geração dinâmica das imagens de QR Code nesta entrega (serão geradas/configuradas posteriormente pelo operador).
- Fluxo de edição ou criação de certificados via formulário na interface pelo usuário final.
- Telas de listagem ou seletor público de certificados.
