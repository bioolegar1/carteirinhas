# API Security & Web Security

## OWASP API Security Top 10 (2025)

### 1. Broken Object Level Authorization (BOLA/IDOR)

**Problema:** Falha ao verificar se usuário tem permissão para acessar objeto específico.

```java
// ❌ Vulnerável - sem verificação de ownership
@GetMapping("/orders/{id}")
public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
    Order order = orderRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    return ResponseEntity.ok(toResponse(order));
}

// ✅ Seguro - verificar ownership
@GetMapping("/orders/{id}")
public ResponseEntity<OrderResponse> getOrder(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails currentUser
) {
    Order order = orderRepository.findByIdAndOwnerId(id, currentUser.getUsername())
        .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    return ResponseEntity.ok(toResponse(order));
}
```

**Mitigação:**
- Sempre verificar permissão de acesso a objetos
- Usar UUIDs em vez de IDs sequenciais
- Implementar checks de authorization em cada endpoint

---

### 2. Broken Authentication

**Problema:** Processos de autenticação fracos ou mal implementados.

```java
// ❌ Vulnerável - JWT sem expiração
public String generateToken(User user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
}

// ✅ Seguro - JWT com expiração e refresh
public String generateAccessToken(User user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
}

public String generateRefreshToken(User user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // 7 dias
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
}
```

**Mitigação:**
- Usar tokens com expiração curta (access token)
- Implementar refresh tokens
- Habilitar MFA (Multi-Factor Authentication)
- Rate limiting em endpoints de login
- Bloquear conta após múltiplas falhas

---

### 3. Broken Object Property Level Authorization

**Problema:** Exposição excessiva de dados ou mass assignment.

```java
// ❌ Vulnerável - mass assignment permite atualizar campos privilegiados
@PutMapping("/users/{id}")
public ResponseEntity<UserResponse> updateUser(
    @PathVariable Long id,
    @RequestBody Map<String, Object> allFields // Permite qualquer campo
) {
    // Usuário pode enviar {"role": "ADMIN", "active": true}
    userService.update(id, allFields);
}

// ✅ Seguro - DTOs específicos com campos permitidos
public record UpdateUserRequest(
    @Size(max = 100) String name,
    @Email String email
    // role, active NÃO incluídos
) {}

@PutMapping("/users/{id}")
public ResponseEntity<UserResponse> updateUser(
    @PathVariable Long id,
    @Valid @RequestBody UpdateUserRequest request
) {
    return ResponseEntity.ok(service.update(id, request));
}

// Admin endpoint separado para campos privilegiados
@PutMapping("/admin/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserResponse> adminUpdateUser(
    @PathVariable Long id,
    @Valid @RequestBody AdminUpdateUserRequest request // Inclui role, active
) {
    return ResponseEntity.ok(service.adminUpdate(id, request));
}
```

**Mitigação:**
- Usar DTOs específicos para cada operação
- Nunca aceitar `Map` ou `JsonNode` direto do usuário
- Separar endpoints para operações administrativas

---

### 4. Unrestricted Resource Consumption

**Problema:** APIs sem limites de recursos permitem DoS.

```java
// ❌ Vulnerável - sem paginação, sem limite
@GetMapping("/users")
public ResponseEntity<List<UserResponse>> getAllUsers() {
    return ResponseEntity.ok(service.findAll()); // Pode retornar milhões
}

// ✅ Seguro - paginação obrigatória com limite máximo
@GetMapping("/users")
public ResponseEntity<Page<UserResponse>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @AuthenticationPrincipal UserDetails currentUser
) {
    // Limitar tamanho máximo da página
    int limitedSize = Math.min(size, 100);
    Pageable pageable = PageRequest.of(page, limitedSize);
    return ResponseEntity.ok(service.findAll(pageable));
}

// ✅ Rate limiting
@RestController
@RateLimit(limit = 100, duration = 60) // 100 req/min
public class UserController {
    // ...
}
```

**Mitigação:**
- Implementar paginação obrigatória
- Limitar tamanho máximo de página (ex: 100)
- Rate limiting por usuário/IP
- Timeout em operações longas
- Limitar tamanho de request body

---

### 5. Broken Function Level Authorization

**Problema:** Acesso a funções administrativas sem verificação adequada.

```java
// ❌ Vulnerável - endpoint admin sem proteção
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id); // Qualquer usuário pode deletar
}

// ✅ Seguro - verificação de role
@DeleteMapping("/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id);
}

// ✅ Alternativa com annotation customizada
@DeleteMapping("/users/{id}")
@HasRole(Role.ADMIN)
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    service.delete(id);
}
```

**Mitigação:**
- Implementar RBAC (Role-Based Access Control)
- Proteger TODOS os endpoints administrativos
- Negar por padrão, permitir explicitamente
- Audit log para operações sensíveis

---

### 6. Unrestricted Access to Sensitive Business Flows

**Problema:** Fluxos de negócio podem ser abusados em escala.

```java
// ❌ Vulnerável - sem limite de compras
@PostMapping("/orders")
public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
    return ResponseEntity.ok(service.create(request));
}

// ✅ Seguro - limites de negócio
@PostMapping("/orders")
@RateLimit(limit = 10, duration = 3600) // Máximo 10 ordens por hora
public ResponseEntity<OrderResponse> createOrder(
    @RequestBody CreateOrderRequest request,
    @AuthenticationPrincipal UserDetails currentUser
) {
    // Verificar limite diário
    int todayOrders = orderRepository.countByUserAndDate(currentUser.getUsername(), LocalDate.now());
    if (todayOrders >= 50) {
        throw new BusinessLimitExceededException("Daily order limit exceeded");
    }
    
    // Verificar valor total
    if (request.totalAmount() > 10000) {
        throw new BusinessLimitExceededException("Order amount exceeds limit");
    }
    
    return ResponseEntity.ok(service.create(request));
}
```

**Mitigação:**
- Implementar limites de negócio
- Rate limiting específico por fluxo
- CAPTCHA para ações sensíveis
- Monitorar padrões anômalos

---

### 7. Server-Side Request Forgery (SSRF)

**Problema:** API busca URLs baseadas em input do usuário.

```java
// ❌ Vulnerável - URL do usuário sem validação
@PostMapping("/fetch")
public ResponseEntity<String> fetchUrl(@RequestBody String url) {
    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    return ResponseEntity.ok(response.getBody());
}

// ✅ Seguro - whitelist de domínios permitidos
private static final Set<String> ALLOWED_DOMAINS = Set.of(
    "api.github.com",
    "api.example.com"
);

@PostMapping("/fetch")
public ResponseEntity<String> fetchUrl(@RequestBody String url) {
    URI uri = URI.create(url);
    
    // Validar esquema
    if (!"https".equals(uri.getScheme())) {
        throw new SecurityException("Only HTTPS allowed");
    }
    
    // Validar domínio
    if (!ALLOWED_DOMAINS.contains(uri.getHost())) {
        throw new SecurityException("Domain not allowed");
    }
    
    // Validar que não é IP interno
    if (isInternalIp(uri.getHost())) {
        throw new SecurityException("Internal IP not allowed");
    }
    
    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    return ResponseEntity.ok(response.getBody());
}

private boolean isInternalIp(String host) {
    try {
        InetAddress address = InetAddress.getByName(host);
        return address.isAnyLocalAddress() || 
               address.isLoopbackAddress() || 
               address.isSiteLocalAddress();
    } catch (UnknownHostException e) {
        return false;
    }
}
```

**Mitigação:**
- Whitelist de domínios/URLs permitidos
- Validar esquema (apenas HTTPS)
- Bloquear IPs internos
- Desabilitar redirecionamentos automáticos

---

### 8. Security Misconfiguration

**Problema:** Configurações inseguras expõem a API.

```yaml
# ❌ Vulnerável - application.yml inseguro
spring:
  jpa:
    show-sql: true  # Expõe queries em produção
    hibernate:
      ddl-auto: update  # Pode modificar schema em produção

server:
  error:
    include-message: always  # Expõe detalhes de erro
    include-stacktrace: always

# ✅ Seguro - application.yml para produção
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate  # Apenas valida schema

server:
  error:
    include-message: never
    include-stacktrace: never
    include-exception: false

# Headers de segurança
security:
  headers:
    content-type-options: nosniff
    xss-protection: true
    frame-options: DENY
```

```java
// ✅ Configurar headers de segurança
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'")
                )
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(Customizer.withDefaults())
                .xssProtection(xss -> xss
                    .block(true)
                    .mode(XXssProtectionHeaderWriter.BlockMode.ENABLED_MODE_BLOCK)
                )
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
            );
        return http.build();
    }
}
```

**Mitigação:**
- Desabilitar stack traces em produção
- Configurar headers de segurança
- Desabilitar features não usadas
- Revisar configurações default
- Usar scanners de configuração

---

### 9. Improper Inventory Management

**Problema:** Falta de visibilidade sobre APIs (shadow APIs).

```java
// ✅ Documentar TODOS os endpoints com OpenAPI
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management APIs")
public class UserController {
    
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        // ...
    }
    
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        // ...
    }
}
```

**Mitigação:**
- Manter inventário atualizado de todas as APIs
- Documentar com OpenAPI/Swagger
- Versionar APIs claramente
- Remover endpoints deprecated
- Monitorar tráfego de API

---

### 10. Unsafe Consumption of APIs

**Problema:** Dados de APIs externas não são validados.

```java
// ❌ Vulnerável - confiar cegamente em API externa
@GetMapping("/users/{id}/github")
public ResponseEntity<UserProfile> getGitHubProfile(@PathVariable Long id) {
    String githubUsername = userService.getGitHubUsername(id);
    
    // Dados do GitHub usados sem validação
    UserProfile profile = githubClient.getProfile(githubUsername);
    userService.updateProfile(id, profile);
    
    return ResponseEntity.ok(profile);
}

// ✅ Seguro - validar dados de API externa
@GetMapping("/users/{id}/github")
public ResponseEntity<UserProfile> getGitHubProfile(@PathVariable Long id) {
    String githubUsername = userService.getGitHubUsername(id);
    
    UserProfile rawProfile = githubClient.getProfile(githubUsername);
    
    // Validar dados antes de usar
    UserProfile validatedProfile = validateGitHubProfile(rawProfile);
    
    // Sanitizar inputs
    validatedProfile = sanitizeProfile(validatedProfile);
    
    userService.updateProfile(id, validatedProfile);
    return ResponseEntity.ok(validatedProfile);
}

private UserProfile validateGitHubProfile(Profile raw) {
    if (raw.getLogin() == null || raw.getLogin().isBlank()) {
        throw new InvalidExternalDataException("GitHub login required");
    }
    
    if (raw.getLogin().length() > 100) {
        throw new InvalidExternalDataException("GitHub login too long");
    }
    
    return new UserProfile(
        raw.getLogin().substring(0, Math.min(raw.getLogin().length(), 100)),
        raw.getEmail() != null ? raw.getEmail().substring(0, 255) : null,
        raw.getBio() != null ? raw.getBio().substring(0, 500) : null
    );
}
```

**Mitigação:**
- Validar TODOS os dados de APIs externas
- Sanitizar inputs antes de usar
- Implementar circuit breaker
- Timeout em chamadas externas
- Rate limiting para APIs externas

---

## Autenticação e Autorização

### JWT com Spring Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtFilter,
                                           AuthenticationProvider authProvider) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://app.example.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "X-RateLimit-Remaining"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### Password Hashing

```java
// ✅ Usar BCrypt ou Argon2
@Configuration
public class PasswordConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt com strength 12 (default é 10)
        return new BCryptPasswordEncoder(12);
    }
}

@Service
public class UserService {
    
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.email());
        // Password automaticamente hash pelo entity listener
        user.setPassword(passwordEncoder.encode(request.password()));
        return repository.save(user);
    }
    
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
```

---

## Input Validation

### Validação com Bean Validation

```java
public record CreateUserRequest(
    @NotBlank @Size(max = 100) String name,
    
    @NotBlank @Email String email,
    
    @NotBlank @Size(min = 8, max = 100) String password,
    
    @NotNull @Min(18) @Max(150) Integer age,
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phone,
    
    @Valid AddressRequest address
) {}

public record AddressRequest(
    @NotBlank @Size(max = 200) String street,
    
    @NotBlank @Size(max = 50) String city,
    
    @NotBlank @Size(max = 2) String state,
    
    @NotBlank @Pattern(regexp = "^\\d{5}-?\\d{3}$") String zipCode
) {}
```

### XSS Prevention

```java
// ✅ Sanitizar inputs HTML
@Component
public class HtmlSanitizer {
    
    private final PolicyFactory policy = Sanitizers.FORMATTING.and(Sanitizers.LINKS);
    
    public String sanitize(String input) {
        if (input == null) return null;
        return policy.sanitize(input);
    }
}

// Uso
@PostMapping("/comments")
public ResponseEntity<CommentResponse> createComment(
    @Valid @RequestBody CreateCommentRequest request
) {
    // Sanitizar conteúdo HTML
    String sanitizedContent = htmlSanitizer.sanitize(request.content());
    commentService.create(sanitizedContent);
}
```

---

## SQL Injection Prevention

```java
// ❌ Vulnerável - string concatenation
@Query("SELECT u FROM User u WHERE u.name = '" + ":name" + "'")
List<User> findByName(@Param("name") String name);

// ✅ Seguro - parameterized query
@Query("SELECT u FROM User u WHERE u.name = :name")
List<User> findByName(@Param("name") String name);

// ✅ Seguro - Spring Data JPA method naming
List<User> findByName(String name);
```

---

## Checklist de Segurança de API

### Autenticação e Autorização
- [ ] JWT com expiração curta (15-30 min)
- [ ] Refresh tokens implementados
- [ ] MFA habilitado para operações sensíveis
- [ ] RBAC (Role-Based Access Control) implementado
- [ ] Verificação de ownership em todos os endpoints

### Input Validation
- [ ] Validação com Bean Validation (@Valid)
- [ ] Sanitização de inputs HTML
- [ ] Validação de tipos e formatos
- [ ] Limites de tamanho definidos

### Proteção de Dados
- [ ] HTTPS obrigatório
- [ ] Dados sensíveis criptografados em repouso
- [ ] Password hashing com BCrypt/Argon2
- [ ] Logs não registram dados sensíveis

### Headers e CORS
- [ ] Headers de segurança configurados
- [ ] CORS restrito a origens permitidas
- [ ] Content-Type validation

### Rate Limiting e Throttling
- [ ] Rate limiting por usuário/IP
- [ ] Limites de negócio implementados
- [ ] Timeout em operações longas

### Monitoramento
- [ ] Audit log para operações sensíveis
- [ ] Monitoramento de padrões anômalos
- [ ] Alertas de segurança configurados

### Documentação
- [ ] OpenAPI/Swagger atualizado
- [ ] Inventário de APIs mantido
- [ ] Endpoints deprecated removidos
