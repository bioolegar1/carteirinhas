# Template de Especificação Técnica

## Resumo Executivo

A solucao sera uma aplicacao Angular estatica, preparada para build e deploy na Vercel, que renderiza carteirinhas estudantis digitais a partir de dados locais predefinidos. O HTML atual em `commands/carteirinha.html` servira como referencia visual e comportamental, mas a implementacao final deve separar dados, componentes, estilos e assets.

Nao havera backend, API REST, banco de dados, autenticacao ou persistencia remota nesta entrega. O QR code sera tratado como asset local configuravel por cadastro; enquanto a imagem final nao for fornecida, a aplicacao deve exibir um placeholder estavel no mesmo espaco.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **Frontend (Angular)**: aplicacao standalone com componentes para pagina, cabecalho, card frente/verso, navegacao inferior e placeholder de QR/foto.
- **Backend (Spring Boot)**: nao aplicavel.
- **API REST**: nao aplicavel.
- **Banco de Dados**: nao aplicavel; os cadastros ficam em arquivo TypeScript local.
- **Assets**: imagens de QR code e fotos devem ficar em `public/assets/` ou `src/assets/`, conforme configuracao Angular adotada.

Fluxo de dados: a pagina carrega uma lista local com 3 cadastros/contas iniciais, resolve o identificador recebido pela URL e renderiza somente a carteirinha correspondente. Nao deve existir seletor, lista de cadastros ou area de cadastro visivel para o usuario final.

## Design de Implementação

### Frontend (Angular)

#### Componentes

Usar Angular standalone components, `ChangeDetectionStrategy.OnPush`, signals e nomenclatura em kebab-case conforme `rules/angular.md`.

```typescript
@Component({
  selector: 'app-student-card-page',
  standalone: true,
  imports: [CommonModule, StudentCardComponent, BottomNavComponent],
  templateUrl: './student-card-page.component.html',
  styleUrl: './student-card-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardPageComponent {
  readonly cards = STUDENT_CARDS;
  readonly requestedId = signal(this.resolveRequestedId());
  readonly card = computed(() =>
    this.cards.find(card => card.id === this.requestedId()) ?? null
  );
}
```

Componentes previstos:

- `StudentCardPageComponent`: container da tela, resolve o cadastro pela URL e controla o estado de nao encontrado.
- `AppHeaderComponent`: saudacao e titulo da carteira.
- `StudentCardComponent`: controla estado de flip e delega frente/verso.
- `StudentCardFrontComponent`: renderiza identificacao, foto, dados pessoais, curso, validade, codigo e QR.
- `StudentCardBackComponent`: renderiza beneficio, locais aceitos, texto legal, validador e SAC.
- `BottomNavComponent`: navegacao visual simples, sem rotas inexistentes obrigatorias.

O estado de flip deve ficar no `StudentCardComponent`. Como nao ha troca manual de cadastro na interface, o componente renderiza apenas a carteirinha resolvida na carga da pagina.

#### Services

Nao e necessario service HTTP. Se a estrutura Angular for criada com service para isolamento, ele deve retornar dados locais de forma sincronizada ou por signal.

```typescript
@Injectable({ providedIn: 'root' })
export class StudentCardDataService {
  getCards(): readonly StudentCardData[] {
    return STUDENT_CARDS;
  }
}
```

Nao configurar `HttpClient`, interceptors ou chamadas externas nesta entrega.

#### Models/Interfaces

```typescript
export interface StudentCardData {
  id: string;
  greetingName: string;
  fullName: string;
  documentLabel: string;
  documentNumber: string;
  birthDate: string;
  course: string;
  institution: string;
  year: string;
  validUntil: string;
  cieCode: string;
  photoUrl?: string;
  qrImageUrl?: string;
  issuer: IssuerData;
  validator: ValidatorData;
  benefit: BenefitData;
  supportPhone: string;
}

export interface IssuerData {
  acronym: string;
  name: string;
}

export interface ValidatorData {
  label: string;
  urlText: string;
}

export interface BenefitData {
  percentage: string;
  description: string;
  venues: readonly string[];
  legalText: string;
}
```

Dados locais em `src/app/student-cards/data/student-cards.data.ts`. O QR temporario deve ser `undefined` ou apontar para um placeholder local, permitindo troca posterior por uma imagem real.

A constante `STUDENT_CARDS` deve iniciar com 3 objetos fornecidos pelo solicitante. Cada objeto deve ter `id` unico, legivel e estavel, por exemplo `propria-carteirinha`, `conta-2` e `conta-3` ate que nomes definitivos sejam informados.

#### Rotas

Aplicacao de pagina unica:

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-cards/pages/student-card-page/student-card-page.component')
        .then(m => m.StudentCardPageComponent),
  },
  { path: '**', redirectTo: '' },
];
```

O identificador pode ser resolvido por rota `/:id` ou parametro `?id=<studentId>`. Para deploy estatico na Vercel, a opcao recomendada e `?id=<studentId>` ou rota Angular com fallback SPA configurado. Se o `id` nao existir, exibir estado de "carteirinha nao encontrada" sem revelar a lista de cadastros.

### Backend (Spring Boot)

#### Controllers

Nao aplicavel. Nenhum controller Spring Boot sera criado.

#### Services

Nao aplicavel. Regras de resolucao por identificador e renderizacao ficam no frontend.

#### Entities

Nao aplicavel. Nao ha entidades JPA.

#### Repositories

Nao aplicavel. Nao ha persistencia.

#### DTOs (Records)

Nao aplicavel. Os modelos sao interfaces TypeScript locais.

### API REST

#### Endpoints

Nenhum endpoint sera criado.

| Método | Endpoint | Descrição | Request | Response |
|--------|----------|-----------|---------|----------|
| - | - | Nao aplicavel para frontend estatico | - | - |

#### Schemas de Request/Response

Nao aplicavel. Nao ha trafego HTTP de API.

### Banco de Dados

#### Schema

Nao aplicavel. Os dados ficam em arquivo TypeScript local e sao empacotados no build Angular.

#### Migrations

Nao aplicavel. Nenhuma migration sera criada.

#### Relacionamentos

Nao aplicavel. A estrutura de dados e plana, com objetos aninhados apenas para organizar emissor, validador e beneficio.

## Abordagem de Testes

### Testes de Unidade (Backend)

Nao aplicavel.

### Testes de Integração (Backend)

Nao aplicavel.

### Testes de Componente (Frontend)

Criar testes para:

- `StudentCardPageComponent`: resolve cadastro por `id`; exibe estado de nao encontrado para `id` inexistente; nao renderiza lista de cadastros.
- `StudentCardComponent`: alterna frente/verso por click e teclado.
- `StudentCardFrontComponent`: renderiza placeholder quando foto ou QR nao existem.

```typescript
describe('StudentCardComponent', () => {
  it('should flip card when activated by keyboard', () => {
    // arrange fixture with mock StudentCardData
    // dispatch Enter/Space
    // assert flipped class/state
  });
});
```

### Testes E2E

Usar Playwright para validar o build estatico:

- pagina inicial renderiza uma carteirinha;
- link direto com `id` valido renderiza nome, curso, codigo e QR/placeholder corretos;
- link direto com `id` invalido exibe estado de nao encontrado;
- nao existe seletor/lista/area de cadastro visivel;
- flip funciona por click e teclado;
- layout nao apresenta conteudo sobreposto em larguras mobile e desktop;
- botao "Renove Agora" nao existe.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Bootstrap Angular**: criar projeto Angular standalone com SCSS e roteamento.
2. **Modelos e dados locais**: definir interfaces e lista `STUDENT_CARDS`.
3. **Componentes estruturais**: pagina, cabecalho e navegacao inferior.
4. **Carteira visual**: migrar frente/verso do HTML para componentes Angular.
5. **Interacao**: implementar resolucao por URL, flip e teclado.
6. **Assets**: preparar pasta de fotos/QR e placeholder estavel.
7. **Responsividade e acessibilidade**: ajustar foco, texto alternativo, contraste, reduced motion e quebras de texto.
8. **Testes e build**: rodar testes, `ng build` e validar compatibilidade com Vercel.

### Dependências Técnicas

- Angular 21 ou versao Angular disponivel no ambiente do projeto.
- Node.js compativel com a versao do Angular.
- Vercel configurada para build estatico com comando `npm run build` e output `dist/<app-name>/browser` quando aplicavel.
- Imagem real do QR code a ser fornecida posteriormente.

## Monitoramento e Observabilidade

### Backend

Nao aplicavel.

### Frontend

- Evitar logs permanentes em producao.
- Usar mensagens visuais discretas apenas para estados de ausencia de QR/foto.
- Validar performance com Lighthouse ou Web Vitals localmente.
- Garantir que a animacao de flip respeite `prefers-reduced-motion`.

## Considerações Técnicas

### Decisões Principais

- **Angular estatico**: atende ao deploy na Vercel e mantem possibilidade de evolucao futura sem backend.
- **Dados locais tipados**: reduz complexidade e evita API/banco fora do escopo.
- **QR como asset**: como a imagem sera fornecida depois, a implementacao deve aceitar `qrImageUrl` opcional.
- **Acesso direto por identificador**: evita exposicao de lista de cadastros e permite compartilhar link especifico para cada carteirinha.
- **Sem biblioteca de QR**: rejeitada porque o QR nao sera gerado pela aplicacao.

### Riscos Conhecidos

- Dados reais em arquivo fonte podem expor informacoes pessoais no deploy; mitigar usando apenas dados autorizados.
- Os 3 cadastros iniciais ainda dependem de envio dos dados definitivos; mitigar mantendo placeholders ate o recebimento.
- Nomes e cursos longos podem quebrar o layout; mitigar com CSS responsivo, `overflow-wrap` e limites de altura.
- QR fornecido em dimensoes inadequadas pode perder leitura; mitigar com container quadrado, `object-fit: contain` e recomendacao de imagem em alta resolucao.
- Texto legal atual do HTML menciona normas que devem ser revisadas antes de publicacao real.

### Conformidade com Padrões

- `@rules/angular.md`: aplicar standalone components, signals, `OnPush`, `inject()` quando houver DI e arquivos em kebab-case.
- `@rules/java.md`: nao aplicavel, pois nao havera Java nesta entrega.
- `@rules/spring-boot.md`: nao aplicavel, pois nao havera Spring Boot nesta entrega.
- Referencias externas consideradas: Lei Federal 12.933/2013 para contexto de CIE/meia-entrada; WCAG 2.2 para teclado, texto alternativo e acessibilidade; MDN para modulos JavaScript/CSS e `prefers-reduced-motion`.

### Arquivos Relevantes e Dependentes

### Backend

Nenhum arquivo backend sera criado.

### Frontend

- `src/app/app.routes.ts`
- `src/app/student-cards/models/student-card.model.ts`
- `src/app/student-cards/data/student-cards.data.ts`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.ts`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.html`
- `src/app/student-cards/pages/student-card-page/student-card-page.component.scss`
- `src/app/student-cards/components/student-card/student-card.component.ts`
- `src/app/student-cards/components/student-card-front/student-card-front.component.ts`
- `src/app/student-cards/components/student-card-back/student-card-back.component.ts`
- `src/app/student-cards/components/bottom-nav/bottom-nav.component.ts`
- `src/styles.scss`
- `public/assets/qrs/.gitkeep`
- `public/assets/photos/.gitkeep`
- `vercel.json` se necessario para fallback de SPA.
