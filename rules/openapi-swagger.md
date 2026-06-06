# OpenAPI / Swagger Documentation

## Configuração SpringDoc OpenAPI

### Dependência Maven

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.7.0</version>
</dependency>
```

### Configuração Application YAML

```yaml
springdoc:
  api-docs:
    enabled: true
    path: /v3/api-docs
    
  swagger-ui:
    enabled: true
    path: /swagger-ui.html
    operations-sorter: method
    tags-sorter: alpha
    
  default-consumes-media-type: application/json
  default-produces-media-type: application/json
  
  # Grupos de APIs
  group-configs:
    - group: public-api
      paths-to-match: /api/v1/**
      packages-to-scan: com.example.app.controller
    - group: admin-api
      paths-to-match: /api/v1/admin/**
      packages-to-scan: com.example.app.controller.admin
      
  # Segurança
  security:
    - bearerAuth: []
```

---

## Configuração do Bean OpenAPI

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI(
        @Value("${application.title}") String title,
        @Value("${application.version}") String version
    ) {
        return new OpenAPI()
            .info(new Info()
                .title(title)
                .version(version)
                .description("API documentation for " + title)
                .termsOfService("https://example.com/terms")
                .contact(new Contact()
                    .name("API Support")
                    .email("support@example.com")
                    .url("https://support.example.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0")))
            .servers(List.of(
                new Server()
                    .url("http://localhost:8080")
                    .description("Local development server"),
                new Server()
                    .url("https://api-staging.example.com")
                    .description("Staging server"),
                new Server()
                    .url("https://api.example.com")
                    .description("Production server")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token authentication"))
                .addSchemas("Error", errorSchema())
                .addSchemas("ErrorResponse", errorResponseSchema()))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
    
    private Schema errorSchema() {
        return new Schema<>()
            .type("object")
            .addProperty("field", new Schema<>().type("string"))
            .addProperty("message", new Schema<>().type("string"))
            .addProperty("code", new Schema<>().type("string"));
    }
    
    private Schema errorResponseSchema() {
        return new Schema<>()
            .type("object")
            .addProperty("status", new Schema<>().type("integer"))
            .addProperty("error", new Schema<>().type("string"))
            .addProperty("message", new Schema<>().type("string"))
            .addProperty("path", new Schema<>().type("string"))
            .addProperty("timestamp", new Schema<>().type("string").format("date-time"))
            .addProperty("errors", new Schema<>()
                .type("array")
                .items(errorSchema()));
    }
}
```

---

## Documentação de Controllers

### Controller com Tags e Operações

```java
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management APIs")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService service;
    
    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data",
        content = @Content(schema = @Schema(ref = "ErrorResponse")))
    @ApiResponse(responseCode = "409", description = "Email already exists")
    public ResponseEntity<UserResponse> createUser(
        @Parameter(description = "User creation data", required = true)
        @Valid @RequestBody CreateUserRequest request
    ) {
        UserResponse response = service.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .header(HttpHeaders.LOCATION, "/api/v1/users/" + response.id())
            .body(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> getUser(
        @Parameter(description = "User unique identifier", example = "123")
        @PathVariable Long id
    ) {
        UserResponse response = service.findById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @Operation(summary = "List users with pagination")
    @ApiResponse(responseCode = "200", description = "Users listed successfully")
    public ResponseEntity<Page<UserResponse>> getUsers(
        @Parameter(description = "Page number (0-indexed)", example = "0")
        @RequestParam(defaultValue = "0") int page,
        
        @Parameter(description = "Page size", example = "20")
        @RequestParam(defaultValue = "20") int size,
        
        @Parameter(description = "Sort field and direction", example = "name,asc")
        @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(SortDirection.fromString(sort)));
        Page<UserResponse> response = service.findAll(pageable);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update user completely")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> updateUser(
        @Parameter(description = "User unique identifier", example = "123")
        @PathVariable Long id,
        
        @Parameter(description = "User update data", required = true)
        @Valid @RequestBody UpdateUserRequest request
    ) {
        UserResponse response = service.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partially update user")
    @ApiResponse(responseCode = "200", description = "User partially updated")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> patchUser(
        @Parameter(description = "User unique identifier", example = "123")
        @PathVariable Long id,
        
        @Parameter(description = "Fields to update", required = true)
        @Valid @RequestBody JsonNode patchDocument
    ) {
        UserResponse response = service.patch(id, patchDocument);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user")
    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<Void> deleteUser(
        @Parameter(description = "User unique identifier", example = "123")
        @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Documentação de DTOs/Schemas

```java
@Schema(description = "User creation request")
public record CreateUserRequest(
    
    @Schema(description = "User full name", example = "John Doe", maxLength = 100)
    @NotBlank @Size(max = 100)
    String name,
    
    @Schema(description = "User email address", example = "john@example.com", format = "email")
    @NotBlank @Email
    String email,
    
    @Schema(description = "User password", example = "SecurePass123!", 
            minLength = 8, maxLength = 100, writeOnly = true)
    @NotBlank @Size(min = 8, max = 100)
    String password,
    
    @Schema(description = "User age", example = "30", minimum = "18", maximum = "150")
    @NotNull @Min(18) @Max(150)
    Integer age,
    
    @Schema(description = "User phone number", example = "+1234567890", 
            pattern = "^\\+?[1-9]\\d{1,14}$")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    String phone,
    
    @Schema(description = "User address")
    @Valid
    AddressRequest address
) {}

@Schema(description = "User address information")
public record AddressRequest(
    
    @Schema(description = "Street address", example = "123 Main St", maxLength = 200)
    @NotBlank @Size(max = 200)
    String street,
    
    @Schema(description = "City", example = "New York", maxLength = 100)
    @NotBlank @Size(max = 100)
    String city,
    
    @Schema(description = "State/Province", example = "NY", maxLength = 2)
    @NotBlank @Size(max = 2)
    String state,
    
    @Schema(description = "ZIP/Postal code", example = "10001", pattern = "^\\d{5}-?\\d{3}$")
    @NotBlank @Pattern(regexp = "^\\d{5}-?\\d{3}$")
    String zipCode
) {}

@Schema(description = "User response with full details")
public record UserResponse(
    
    @Schema(description = "User unique identifier", example = "123")
    Long id,
    
    @Schema(description = "User full name", example = "John Doe")
    String name,
    
    @Schema(description = "User email address", example = "john@example.com")
    String email,
    
    @Schema(description = "User age", example = "30")
    Integer age,
    
    @Schema(description = "User phone number", example = "+1234567890")
    String phone,
    
    @Schema(description = "User address")
    AddressResponse address,
    
    @Schema(description = "Account creation timestamp", example = "2026-01-15T10:30:00Z")
    LocalDateTime createdAt,
    
    @Schema(description = "Last update timestamp", example = "2026-03-31T14:20:00Z")
    LocalDateTime updatedAt,
    
    @Schema(description = "Links to related resources")
    List<Link> links
) {
    @Schema(description = "Resource link")
    public record Link(
        @Schema(description = "Relation type", example = "self")
        String rel,
        
        @Schema(description = "URL", example = "/api/v1/users/123")
        String href,
        
        @Schema(description = "HTTP method", example = "GET")
        String method
    ) {}
}

@Schema(description = "Paginated response of users")
public record PageResponse<T>(
    
    @Schema(description = "List of items")
    List<T> content,
    
    @Schema(description = "Current page number", example = "0")
    int page,
    
    @Schema(description = "Page size", example = "20")
    int size,
    
    @Schema(description = "Total number of elements", example = "150")
    long totalElements,
    
    @Schema(description = "Total number of pages", example = "8")
    int totalPages,
    
    @Schema(description = "Whether this is the first page", example = "false")
    boolean first,
    
    @Schema(description = "Whether this is the last page", example = "false")
    boolean last,
    
    @Schema(description = "Whether there is a next page", example = "true")
    boolean hasNext,
    
    @Schema(description = "Whether there is a previous page", example = "false")
    boolean hasPrevious
) {}
```

---

## Exemplos de Request/Response

```java
@Schema(description = "User creation request")
public record CreateUserRequest(
    
    @Schema(description = "User full name", 
            example = "John Doe",
            requiredMode = Schema.RequiredMode.REQUIRED)
    String name,
    
    @Schema(description = "User email address", 
            example = "john@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    String email
) {}

// Com exemplo completo de request
@Operation(summary = "Create a new user")
@io.swagger.v3.oas.annotations.parameters.RequestBody(
    description = "User creation data",
    required = true,
    content = @Content(
        schema = @Schema(implementation = CreateUserRequest.class),
        examples = @ExampleObject(
            name = "Valid user",
            value = """
                {
                  "name": "John Doe",
                  "email": "john@example.com",
                  "password": "SecurePass123!",
                  "age": 30,
                  "phone": "+1234567890",
                  "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "state": "NY",
                    "zipCode": "10001"
                  }
                }
                """
        )
    )
)
@PostMapping
public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
    // ...
}

// Com exemplos de response
@ApiResponse(
    responseCode = "201",
    description = "User created successfully",
    content = @Content(
        schema = @Schema(implementation = UserResponse.class),
        examples = @ExampleObject(
            name = "Created user",
            value = """
                {
                  "id": 123,
                  "name": "John Doe",
                  "email": "john@example.com",
                  "age": 30,
                  "phone": "+1234567890",
                  "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "state": "NY",
                    "zipCode": "10001"
                  },
                  "createdAt": "2026-01-15T10:30:00Z",
                  "updatedAt": "2026-01-15T10:30:00Z",
                  "links": [
                    {
                      "rel": "self",
                      "href": "/api/v1/users/123",
                      "method": "GET"
                    }
                  ]
                }
                """
        )
    )
)
```

---

## Documentação de Erros

```java
@Schema(description = "Error response structure")
public record ErrorResponse(
    
    @Schema(description = "HTTP status code", example = "400")
    int status,
    
    @Schema(description = "Error type", example = "Bad Request")
    String error,
    
    @Schema(description = "Error message", example = "Validation failed")
    String message,
    
    @Schema(description = "Request path", example = "/api/v1/users")
    String path,
    
    @Schema(description = "Error timestamp", example = "2026-03-31T10:30:00Z")
    LocalDateTime timestamp,
    
    @Schema(description = "Field-specific errors")
    List<FieldError> errors
) {
    @Schema(description = "Field-specific error")
    public record FieldError(
        
        @Schema(description = "Field name", example = "email")
        String field,
        
        @Schema(description = "Error message", example = "must be a well-formed email address")
        String message,
        
        @Schema(description = "Error code", example = "invalid_email")
        String code
    ) {}
}

// Global exception handler com documentação
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ApiResponse(responseCode = "404", description = "Resource not found")
    public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        ErrorResponse error = createErrorResponse(
            HttpStatus.NOT_FOUND,
            "Not Found",
            ex.getMessage(),
            request
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ApiResponse(responseCode = "400", description = "Validation failed")
    public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new ErrorResponse.FieldError(
                error.getField(),
                error.getDefaultMessage(),
                error.getCode()
            ))
            .toList();
        
        ErrorResponse error = createErrorResponse(
            HttpStatus.BAD_REQUEST,
            "Bad Request",
            "Validation failed",
            request
        ).withErrors(fieldErrors);
        
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

## Documentação de Segurança

```java
// Security scheme configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT token authentication. Obtain token from /api/v1/auth/login."
)
@SecurityRequirement(name = "bearerAuth")

// Uso em controller
@RestController
@RequestMapping("/api/v1")
@SecurityRequirement(name = "bearerAuth")
public class SecureController {
    
    @Operation(summary = "Access protected resource")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Success"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient permissions")
    })
    @GetMapping("/protected")
    public ResponseEntity<ProtectedResponse> getProtectedResource() {
        // ...
    }
}
```

---

## Checklist de Documentação OpenAPI

- [ ] OpenAPI bean configurado com info, servers, security
- [ ] Tags organizadas por recurso/domínio
- [ ] Todas as operações documentadas com @Operation
- [ ] Respostas documentadas com @ApiResponse
- [ ] DTOs documentados com @Schema
- [ ] Exemplos de request/response fornecidos
- [ ] Erros padronizados documentados
- [ ] Security schemes configurados
- [ ] Swagger UI acessível em /swagger-ui.html
- [ ] API docs acessível em /v3/api-docs
- [ ] Grupos de API configurados (pública/admin)
- [ ] Media types definidos (application/json)
