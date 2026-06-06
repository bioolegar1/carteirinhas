# REST API & RESTful

## Princípios Fundamentais

Siga os princípios REST para criar APIs escaláveis, consistentes e interoperáveis.

### Princípios REST

1. **Client-Server**: Separação de concerns entre cliente e servidor
2. **Stateless**: Cada request deve conter toda informação necessária
3. **Cacheable**: Respostas devem definir se são cacheáveis
4. **Layered System**: Cliente não sabe se está conectado diretamente ao servidor final
5. **Uniform Interface**: Interface consistente e padronizada
6. **Code on Demand** (opcional): Servidor pode enviar código executável

---

## Design de Endpoints

### Use Substantivos, Não Verbos

```java
// ✅ Correto - substantivos para recursos
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
PATCH  /api/v1/users/{id}
DELETE /api/v1/users/{id}

// ❌ Evite - verbos como endpoints
GET    /api/v1/getUsers
POST   /api/v1/createUser
DELETE /api/v1/deleteUser
```

### Use Plural para Recursos

```java
// ✅ Correto - plural consistente
/api/v1/users
/api/v1/orders
/api/v1/products

// ❌ Evite - mistura de singular/plural
/api/v1/user
/api/v1/orders
```

### Hierarquia de Recursos

```java
// ✅ Correto - hierarquia clara para recursos relacionados
GET /api/v1/users/{userId}/orders
GET /api/v1/orders/{orderId}/items
GET /api/v1/categories/{categoryId}/products

// ❌ Evite - hierarquia muito profunda (máximo 3 níveis)
GET /api/v1/users/{userId}/orders/{orderId}/items/{itemId}/details
```

### FilTROS, Ordenação e Paginação

```java
// ✅ Correto - query params para filtros
GET /api/v1/users?status=active&role=admin
GET /api/v1/products?minPrice=10&maxPrice=100
GET /api/v1/orders?dateFrom=2025-01-01&dateTo=2025-12-31

// ✅ Paginação baseada em offset
GET /api/v1/users?page=0&size=20
GET /api/v1/users?offset=0&limit=20

// ✅ Paginação baseada em cursor (melhor para grandes datasets)
GET /api/v1/users?cursor=eyJpZCI6MTAwfQ&limit=20

// ✅ Ordenação
GET /api/v1/users?sort=name,asc
GET /api/v1/users?sort=createdAt,desc&sort=name,asc

// ✅ Projeção de campos (field selection)
GET /api/v1/users?fields=id,name,email
```

---

## Métodos HTTP

### Use Métodos HTTP Corretamente

| Método | Operação | Idempotente | Safe | Body |
|--------|----------|-------------|------|------|
| GET | Ler recurso | Sim | Sim | Não |
| POST | Criar recurso | Não | Não | Sim |
| PUT | Substituir recurso | Sim | Não | Sim |
| PATCH | Atualizar parcialmente | Não* | Não | Sim |
| DELETE | Remover recurso | Sim | Não | Não |

*PATCH pode ser tornado idempotente com implementação adequada

```java
// ✅ GET - Ler recurso (safe, idempotente)
@GetMapping("/users/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(service.findById(id));
}

// ✅ POST - Criar recurso (não safe, não idempotente)
@PostMapping("/users")
public ResponseEntity<UserResponse> createUser(
    @Valid @RequestBody CreateUserRequest request
) {
    UserResponse created = service.create(request);
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .header(HttpHeaders.LOCATION, "/api/v1/users/" + created.id())
        .body(created);
}

// ✅ PUT - Substituir recurso completo (idempotente)
@PutMapping("/users/{id}")
public ResponseEntity<UserResponse> updateUser(
    @PathVariable Long id,
    @Valid @RequestBody UpdateUserRequest request
) {
    return ResponseEntity.ok(service.update(id, request));
}

// ✅ PATCH - Atualização parcial
@PatchMapping("/users/{id}")
public ResponseEntity<UserResponse> patchUser(
    @PathVariable Long id,
    @Valid @RequestBody JsonNode patchDocument
) {
    return ResponseEntity.ok(service.patch(id, patchDocument));
}

// ✅ DELETE - Remover recurso (idempotente)
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
}
```

---

## Códigos de Status HTTP

### Use Códigos de Status Apropriados

```java
// ✅ 200 OK - Sucesso em GET, PUT, PATCH
@GetMapping("/users/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(service.findById(id));
}

// ✅ 201 Created - Sucesso em POST com localização
@PostMapping("/users")
public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
    UserResponse created = service.create(request);
    return ResponseEntity
        .created(URI.create("/api/v1/users/" + created.id()))
        .body(created);
}

// ✅ 204 No Content - Sucesso em DELETE
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
}

// ✅ 400 Bad Request - Dados inválidos
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    return ResponseEntity.badRequest().body(toErrorResponse(ex));
}

// ✅ 401 Unauthorized - Não autenticado
@ExceptionHandler(AuthenticationException.class)
public ResponseEntity<ErrorResponse> handleUnauthorized(AuthenticationException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(...);
}

// ✅ 403 Forbidden - Autenticado mas sem permissão
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleForbidden(AccessDeniedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(...);
}

// ✅ 404 Not Found - Recurso não encontrado
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.notFound().build();
}

// ✅ 409 Conflict - Conflito (ex: email duplicado)
@ExceptionHandler(DuplicateResourceException.class)
public ResponseEntity<ErrorResponse> handleConflict(DuplicateResourceException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(...);
}

// ✅ 412 Precondition Failed - ETag/concorrência
@ExceptionHandler(OptimisticLockingFailureException.class)
public ResponseEntity<ErrorResponse> handlePreconditionFailed(OptimisticLockingFailureException ex) {
    return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(...);
}

// ✅ 429 Too Many Requests - Rate limit excedido
@ExceptionHandler(RateLimitExceededException.class)
public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex) {
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(...);
}

// ✅ 500 Internal Server Error - Erro genérico do servidor
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    log.error("Unexpected error", ex);
    return ResponseEntity.internalServerError().body(...);
}
```

### Tabela de Códigos de Status

| Código | Significado | Quando Usar |
|--------|-------------|-------------|
| 200 | OK | GET, PUT, PATCH bem-sucedidos |
| 201 | Created | POST bem-sucedido com criação |
| 204 | No Content | DELETE bem-sucedido |
| 400 | Bad Request | Dados inválidos, malformed request |
| 401 | Unauthorized | Não autenticado |
| 403 | Forbidden | Autenticado mas sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Conflito de estado (ex: duplicado) |
| 412 | Precondition Failed | ETag mismatch, concorrência |
| 422 | Unprocessable Entity | Validação semântica falhou |
| 429 | Too Many Requests | Rate limit |
| 500 | Internal Server Error | Erro interno do servidor |
| 502 | Bad Gateway | Upstream falhou |
| 503 | Service Unavailable | Serviço indisponível |

---

## Versionamento de API

### Use Versionamento na URL

```java
// ✅ Correto - versionamento na URL
/api/v1/users
/api/v2/users

// ✅ Spring Boot mapping
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 { ... }

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 { ... }
```

### Estratégias de Versionamento

| Estratégia | Exemplo | Prós | Contras |
|------------|---------|------|---------|
| URL Path | `/api/v1/users` | Clara, cacheável | Polui URL |
| Query Param | `/api/users?version=1` | URL limpa | Menos cacheável |
| Header | `Accept: application/vnd.api.v1+json` | URL limpa | Menos descoberta |
| Media Type | `Accept: application/json; version=1` | RESTful | Complexo |

**Recomendação:** Use URL path (`/api/v1/`) para clareza e cacheabilidade.

---

## Tratamento de Erros

### Estrutura de Resposta de Erro Padronizada

```java
// ✅ ErrorResponse padronizado
public record ErrorResponse(
    int status,
    String error,
    String message,
    String path,
    LocalDateTime timestamp,
    List<FieldError> errors
) {
    public record FieldError(
        String field,
        String message,
        String code
    ) {}
}
```

### Exemplo de Resposta de Erro

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/users",
  "timestamp": "2026-03-31T10:30:00Z",
  "errors": [
    {
      "field": "email",
      "message": "must be a well-formed email address",
      "code": "invalid_email"
    },
    {
      "field": "name",
      "message": "must not be blank",
      "code": "not_blank"
    }
  ]
}
```

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new ErrorResponse.FieldError(
                error.getField(),
                error.getDefaultMessage(),
                error.getCode()
            ))
            .toList();
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Bad Request")
            .message("Validation failed")
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .errors(fieldErrors)
            .build();
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error", ex);
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.internalServerError().body(error);
    }
}
```

---

## Headers HTTP

### Headers Essenciais

```java
// ✅ Content-Type e Accept
Content-Type: application/json
Accept: application/json

// ✅ Location após criação
POST /api/v1/users
Location: /api/v1/users/123

// ✅ ETag para cache e concorrência
ETag: "abc123"
If-Match: "abc123"
If-None-Match: "abc123"

// ✅ Rate Limiting
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1617187200

// ✅ Paginação
Link: </api/v1/users?page=1&size=20>; rel="next",
      </api/v1/users?page=5&size=20>; rel="last"
```

### Headers de Segurança

```java
// ✅ Security headers (configurar no filter/interceptor)
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## Idempotência

### Garanta Idempotência para Operações Críticas

```java
// ✅ PUT é naturalmente idempotente
@PutMapping("/users/{id}")
public ResponseEntity<UserResponse> updateUser(
    @PathVariable Long id,
    @Valid @RequestBody UpdateUserRequest request
) {
    // Múltiplas execuções produzem mesmo resultado
    return ResponseEntity.ok(service.update(id, request));
}

// ✅ DELETE é naturalmente idempotente
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
}

// ✅ POST com Idempotency-Key para operações críticas
@PostMapping("/payments")
public ResponseEntity<PaymentResponse> createPayment(
    @Valid @RequestBody CreatePaymentRequest request,
    @RequestHeader("Idempotency-Key") String idempotencyKey
) {
    // Verifica se request já foi processada
    if (idempotencyService.exists(idempotencyKey)) {
        return ResponseEntity.ok(idempotencyService.getExisting(idempotencyKey));
    }
    
    PaymentResponse response = service.createPayment(request);
    idempotencyService.store(idempotencyKey, response);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

---

## Concorrência Otimista

### Use ETags para Controle de Concorrência

```java
// ✅ Entity com @Version para otimistic locking
@Entity
public class User {
    @Id
    private Long id;
    
    private String name;
    
    @Version
    private Long version; // Usado como ETag
}

// ✅ Controller com ETag
@GetMapping("/users/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    User user = service.findById(id);
    String etag = "\"" + user.getVersion() + "\"";
    
    return ResponseEntity
        .ok()
        .eTag(etag)
        .body(toResponse(user));
}

@PutMapping("/users/{id}")
public ResponseEntity<UserResponse> updateUser(
    @PathVariable Long id,
    @RequestHeader("If-Match") String ifMatch,
    @Valid @RequestBody UpdateUserRequest request
) {
    // Spring verifica automaticamente @Version
    try {
        return ResponseEntity.ok(service.update(id, request));
    } catch (OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
    }
}
```

---

## HATEOAS (Hypermedia as the Engine of Application State)

### Inclua Links para Navegação da API

```java
// ✅ Response com links HATEOAS
public record UserResponse(
    Long id,
    String name,
    String email,
    List<Link> links
) {
    public record Link(
        String rel,
        String href,
        String method
    ) {}
}

// ✅ Controller gerando links
@GetMapping("/users/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    User user = service.findById(id);
    
    List<UserResponse.Link> links = List.of(
        new UserResponse.Link("self", "/api/v1/users/" + id, "GET"),
        new UserResponse.Link("update", "/api/v1/users/" + id, "PUT"),
        new UserResponse.Link("delete", "/api/v1/users/" + id, "DELETE"),
        new UserResponse.Link("orders", "/api/v1/users/" + id + "/orders", "GET")
    );
    
    return ResponseEntity.ok(new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        links
    ));
}
```

---

## Rate Limiting

### Implemente Rate Limiting para Proteção

```java
// ✅ Bucket4j para rate limiting
@RestController
@RequestMapping("/api/v1")
public class RateLimitedController {
    
    @GetMapping("/users")
    @RateLimit(limit = 100, duration = 60) // 100 requests por 60 segundos
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(service.findAll());
    }
}

// ✅ Headers de rate limiting na resposta
@GetMapping("/users")
public ResponseEntity<List<UserResponse>> getUsers(HttpServletResponse response) {
    response.setHeader("X-RateLimit-Limit", "100");
    response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));
    response.setHeader("X-RateLimit-Reset", String.valueOf(resetTime));
    
    return ResponseEntity.ok(service.findAll());
}
```

---

## Checklist de Qualidade REST API

- [ ] URLs usam substantivos no plural
- [ ] Hierarquia máxima de 3 níveis
- [ ] Métodos HTTP usados corretamente
- [ ] Códigos de status apropriados
- [ ] Versionamento definido (`/api/v1/`)
- [ ] Tratamento de erros padronizado
- [ ] Validação de inputs com mensagens claras
- [ ] Paginação para listas grandes
- [ ] Filtros via query params
- [ ] Headers de segurança configurados
- [ ] Rate limiting implementado
- [ ] Documentação OpenAPI/Swagger atualizada
- [ ] Idempotência onde necessário
- [ ] Concorrência otimista com ETags
- [ ] Links HATEOAS (opcional mas recomendado)
