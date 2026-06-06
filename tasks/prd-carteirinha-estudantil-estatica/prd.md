# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

A funcionalidade consiste em uma interface frontend estatica para exibicao de carteirinhas estudantis digitais a partir de cadastros predefinidos. Cada cadastro representa um estudante e deve gerar uma visualizacao individual da carteira, contendo dados pessoais, curso, instituicao, validade, codigo de uso/CIE, QR code fornecido e verso com informacoes de beneficio, validacao e SAC.

O objetivo e evoluir o HTML existente em `commands/carteirinha.html` para uma experiencia estatica mais organizada, responsiva e reutilizavel, sem backend, sem persistencia remota e sem fluxo de renovacao. A solucao deve permitir acessar diretamente uma carteirinha especifica por identificador na URL, usando dados ja definidos no proprio frontend.

## Objetivos

- Exibir carteirinhas estudantis digitais individuais com base em cadastros predefinidos.
- Manter a interacao de virar a carteira para visualizar frente e verso.
- Remover o botao "Renove Agora" e qualquer expectativa de fluxo de renovacao.
- Permitir que cada cadastro use um QR code fornecido previamente.
- Garantir leitura adequada em dispositivos moveis, com layout estavel e sem sobreposicao de textos.
- Preparar a estrutura frontend para adicionar novos cadastros sem alterar a marcacao principal da carteira.
- Nao exibir uma area de cadastro, lista ou seletor de estudantes para o usuario final.
- Iniciar com 3 cadastros/contas predefinidos, cada um acessado por link direto proprio.

Metrica de sucesso: todos os cadastros predefinidos devem gerar uma carteirinha completa, responsiva e visualmente consistente, com QR code correto e sem elementos de renovacao.

## Histórias de Usuário

- Como estudante, eu quero visualizar minha carteira estudantil digital para comprovar meus dados e validade.
- Como estudante, eu quero tocar na carteira para ver o verso para consultar beneficios, informacoes legais, validador e SAC.
- Como operador do arquivo estatico, eu quero cadastrar estudantes em uma lista predefinida para que cada registro gere uma carteirinha correspondente.
- Como operador do arquivo estatico, eu quero informar um QR code especifico por estudante para que a carteira exiba o codigo ja fornecido.
- Como usuario em celular, eu quero que a carteira ocupe bem a tela e mantenha textos legiveis para conseguir usar a interface sem zoom manual.

## Funcionalidades Principais

1. Renderizacao de carteirinha por cadastro predefinido
   - O frontend deve possuir uma estrutura de dados local com os cadastros dos estudantes.
   - Cada cadastro deve conter nome, CPF/CIN, data de nascimento, curso, instituicao, ano/validade, codigo CIE, QR code, dados de associacao, validador e SAC quando aplicavel.
   - A tela deve renderizar a carteira com base no cadastro ativo.

2. Acesso direto por carteirinha
   - A interface nao deve exibir seletor, lista de cadastros ou area de cadastro.
   - Cada carteirinha deve poder ser acessada diretamente por identificador na URL.
   - Quando o identificador nao existir, a interface deve exibir um estado simples de carteirinha nao encontrada ou redirecionar para um cadastro padrao definido.

3. Carteira com frente e verso
   - A frente deve exibir identificacao estudantil, foto ou placeholder, dados pessoais, curso, instituicao, validade, codigo CIE e QR code.
   - O verso deve exibir beneficio de meia-entrada, locais aceitos, texto legal, validador, SAC e observacao de validade nacional.
   - A interacao de virar deve funcionar por toque/click e teclado.

4. QR code fornecido
   - O QR code nao deve ser gerado dinamicamente como regra obrigatoria do MVP.
   - Cada cadastro deve referenciar um QR code ja fornecido, seja por imagem, data URI ou asset local.
   - Quando um cadastro nao tiver QR code, a interface deve usar um estado visual claro de ausencia sem quebrar o layout.

5. Remocao de renovacao
   - O botao "Renove Agora" deve ser removido.
   - A tela nao deve sugerir fluxo de renovacao, pagamento, envio de documentos ou atualizacao cadastral.

## Requisitos de Frontend (Angular)

Embora o escopo seja apenas frontend estatico, os requisitos devem ser organizados para facilitar futura migracao para Angular, se desejada.

- Componentes/areas esperadas: cabecalho, carteira frente, carteira verso e navegacao inferior.
- A estrutura de dados local deve separar conteudo de apresentacao.
- A carteira deve manter proporcao visual consistente em telas mobile e desktop.
- Deve haver suporte a clique/toque e teclado para virar a carteira.
- Textos longos, como nome, curso e instituicao, devem quebrar linha sem sobrepor outros elementos.
- O identificador da carteirinha deve ser resolvido pela URL, sem controle visual de selecao.
- Estados previstos: cadastro resolvido, cadastro nao encontrado, ausencia de foto e ausencia de QR code.
- A navegacao inferior pode permanecer visual, mas nao deve prometer telas inexistentes caso nao haja implementacao.
- O layout deve evitar dependencias obrigatorias de rede para funcionar, sempre que possivel.

## Requisitos de Backend (Spring Boot)

Nao aplicavel nesta entrega.

O produto solicitado e exclusivamente frontend estatico. Nao deve haver API, banco de dados, autenticacao, processamento assincromo, persistencia em servidor ou integracao externa obrigatoria no MVP.

## Requisitos de Dados

Os dados serao mantidos em uma colecao local predefinida no frontend. Cada cadastro deve conter, no minimo:

- Identificador unico do cadastro.
- Nome completo.
- CPF/CIN.
- Data de nascimento.
- Curso.
- Instituicao.
- Ano da carteira.
- Data de validade.
- Codigo de uso/CIE.
- QR code fornecido.
- Foto ou indicacao para usar placeholder.

A primeira versao deve contemplar 3 cadastros/contas iniciais fornecidos pelo solicitante. Cada cadastro deve possuir um `id` estavel para formar o link direto da carteirinha correspondente.

Dados opcionais:

- Nome e texto da associacao emissora.
- URL ou texto do validador.
- Telefone do SAC.
- Lista de beneficios/locais aceitos.
- Texto legal exibido no verso.

As constraints principais sao: identificador unico por cadastro, codigo CIE unico quando aplicavel e QR code correspondente ao cadastro correto.

## Experiência do Usuário

A experiencia deve ser direta: o usuario acessa um link especifico e ve somente a carteirinha correspondente ao cadastro daquele identificador. Nao deve haver tela de cadastro, lista de estudantes ou troca manual entre carteirinhas.

A carteira deve continuar sendo o elemento principal da primeira tela. A frente deve priorizar identificacao e validade; o verso deve priorizar beneficio, base legal, validador e SAC. A dica de "toque para virar" deve aparecer sem atrapalhar a leitura.

Em mobile, a interface deve respeitar area segura, manter a navegacao inferior sem cobrir conteudo relevante e nao exigir zoom. Em desktop, a carteira pode ficar centralizada com largura maxima controlada.

## Restrições Técnicas de Alto Nível

- A entrega deve ser frontend estatico.
- Nao deve depender de backend, banco de dados ou chamadas de API.
- Os cadastros devem ser predefinidos no proprio projeto.
- Cada cadastro deve ter um identificador estavel para acesso direto por URL.
- O QR code deve ser fornecido por cadastro; geracao automatica de QR code nao e requisito.
- O botao "Renove Agora" deve ser removido.
- A interface deve funcionar em navegadores modernos e ser otimizada para mobile.
- Dados pessoais exibidos na tela devem ser tratados como sensiveis no conteudo do projeto; cadastros reais devem ser usados apenas quando houver autorizacao.
- Caso fontes externas sejam mantidas, deve haver fallback visual para quando a rede nao carregar.

## Fora de Escopo

- Backend em Spring Boot.
- Banco de dados.
- Login, autenticacao ou perfis de usuario.
- Cadastro editavel pelo usuario final.
- Renovacao de carteira.
- Pagamento.
- Upload de foto ou documentos.
- Geracao automatica de QR code.
- Validacao publica real do QR code.
- Envio de notificacoes.
- Integracao com sistemas externos.
- Aplicativo mobile nativo.
