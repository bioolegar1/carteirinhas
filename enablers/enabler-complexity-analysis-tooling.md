# Enabler: Ferramental de Análise de Complexidade Ciclomática

**Tipo**: Arquitetura
**Prioridade**: Média
**Estimativa**: P / 30 minutos
**Status**: ✅ Backend COMPLETO — Frontend pendente

## Contexto

O agente `@agents/complexity-analyzer.md` depende de ferramentas para medir complexidade ciclomática:

- **Backend (Java):** Maven Checkstyle Plugin com checks de complexidade — **já configurado** (`checkstyle-complexity.xml` + plugin no `pom.xml`). Checkstyle foi escolhido em vez de PMD pois PMD 7.x não suporta Java 25 bytecode (class file major version 69).
- **Frontend (Angular):** Angular ESLint com rule `complexity` — **ainda não configurado** (sem `eslint.config.js`, sem `@angular-eslint` devDependencies).

## Escopo

### Incluído

**Backend (já feito):**
- `maven-checkstyle-plugin` 3.6.0 no `pom.xml`
- `checkstyle-complexity.xml` com rules: `CyclomaticComplexity` (max=10), `NPathComplexity` (max=200), `MethodLength` (max=50), `ParameterNumber` (max=7)
- `./mvnw checkstyle:checkstyle` gera `target/checkstyle-complexity.xml`

**Frontend (pendente):**
- Instalar `@angular-eslint/builder`, `@angular-eslint/eslint-plugin`, `@typescript-eslint/*`, `eslint`
- Criar `dociq-frontend/eslint.config.js` com rule `complexity: ['warn', 10]`
- Configurar `angular.json` com linter `@angular-eslint/builder:lint`

### Não Incluído

- Correção de violations existentes (responsabilidade do `@agents/complexity-analyzer.md`)
- SonarQube ou plataformas de métricas externas

## Critérios de Aceite

- [x] `./mvnw checkstyle:checkstyle` executa e gera `target/checkstyle-complexity.xml`
- [x] `./mvnw clean verify` continua BUILD SUCCESS com o plugin adicionado
- [ ] `npm install` no `dociq-frontend` instala `@angular-eslint` e deps
- [ ] `ng lint --format=json` gera JSON válido (pode ter violations — não pode ter erro de configuração)

## Tarefas Técnicas

### Backend — ✅ Concluído

Os arquivos já foram criados:
- `dociq-backend/checkstyle-complexity.xml`
- Plugin `maven-checkstyle-plugin` adicionado ao `dociq-backend/pom.xml`

Validação:
```bash
cd dociq-backend
./mvnw checkstyle:checkstyle && ls -lh target/checkstyle-complexity.xml
# BUILD SUCCESS + arquivo gerado = OK
```

### Frontend — Pendente

- [ ] Instalar pacotes:

```bash
cd dociq-frontend
npm install --save-dev \
  @angular-eslint/builder@21 \
  @angular-eslint/eslint-plugin@21 \
  @angular-eslint/eslint-plugin-template@21 \
  @typescript-eslint/eslint-plugin@8 \
  @typescript-eslint/parser@8 \
  eslint@9
```

- [ ] Criar `dociq-frontend/eslint.config.js`:

```javascript
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("@angular-eslint/eslint-plugin");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: { "@angular-eslint": angular },
    rules: {
      complexity: ["warn", 10],
    },
  }
);
```

- [ ] Adicionar ao `angular.json` em `projects.dociq-frontend.architect`:

```json
"lint": {
  "builder": "@angular-eslint/builder:lint",
  "options": {
    "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
  }
}
```

- [ ] Validar:

```bash
cd dociq-frontend
ng lint --format=json 2>/dev/null | python3 -m json.tool > /dev/null && echo "ESLint OK"
```

## Riscos e Dependências

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| PMD não suporta Java 25 | Resolvido | Checkstyle usado no lugar (análise puramente sintática) |
| Peer deps conflitantes no Angular ESLint v21 | Médio | Verificar matriz de compatibilidade; usar `--legacy-peer-deps` se necessário |
| `checkstyle-complexity.xml` com severidade `warning` não bloqueia build | Intencional | `failOnViolation=false` — agente lê o XML gerado |

## Validação Final

```bash
# Backend
cd dociq-backend && ./mvnw checkstyle:checkstyle && echo "Backend OK"

# Frontend (após configurar)
cd dociq-frontend && ng lint --format=json 2>/dev/null | python3 -m json.tool > /dev/null && echo "Frontend OK"
```
