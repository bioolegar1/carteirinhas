# Java 21

## Versão e Configuração

Utilize Java 21 (LTS) com as features modernas disponíveis.

**Exemplo:**
```java
// ✅ Prefira - Java 21 features
// Records para DTOs
public record UserDTO(Long id, String name, String email) {}

// Pattern matching para switch
String formatValue(Object value) {
    return switch (value) {
        case Integer i -> "Number: " + i;
        case String s -> "Text: " + s;
        case null -> "Null";
        default -> "Unknown";
    };
}

// Text blocks para SQL/JSON
String query = """
    SELECT * FROM users
    WHERE active = true
    ORDER BY name
    """;
```

## Nomenclatura

Use PascalCase para classes, camelCase para métodos/variáveis, SCREAMING_SNAKE_CASE para constantes.

**Exemplo:**
```java
// ✅ Correto
public class UserService {}
public interface UserRepository {}
private final int MAX_RETRY = 3;
private String userName;
public void createUser() {}

// ❌ Evite
public class userService {}
public interface userrepository {}
private final int maxRetry = 3;
```

## Classes e Records

Use records para DTOs, value objects e dados imutáveis. Use classes para entidades com comportamento.

**Exemplo:**
```java
// ✅ Prefira records para DTOs
public record CreateUserRequest(String name, String email) {}
public record UserResponse(Long id, String name, String email) {}

// ✅ Use classes para entidades JPA
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // getters, setters, equals, hashCode
}
```

## Injeção de Dependência

Use constructor injection sempre. Evite field injection.

**Exemplo:**
```java
// ❌ Evite - field injection
@Service
public class UserService {
    @Autowired
    private UserRepository repository;
}

// ✅ Prefira - constructor injection
@Service
@Transactional
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

## Tratamento de Erros

Use exceções específicas e crie exceções customizadas para domínio.

**Exemplo:**
```java
// ✅ Exceção customizada
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public static ResourceNotFoundException of(String resource, Long id) {
        return new ResourceNotFoundException("%s not found with id %d".formatted(resource, id));
    }
}

// ✅ Uso no serviço
public UserResponse findById(Long id) {
    User user = repository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("User", id));
    return toResponse(user);
}
```

## Optional

Retorne Optional apenas em métodos privados ou internos. Em APIs públicas, retorne o valor ou lance exceção.

**Exemplo:**
```java
// ✅ Interno - retorna Optional
private Optional<User> findOptional(Long id) {
    return repository.findById(id);
}

// ✅ Público - retorna valor ou lança exceção
public UserResponse findById(Long id) {
    return repository.findById(id)
        .map(this::toResponse)
        .orElseThrow(() -> ResourceNotFoundException.of("User", id));
}

// ❌ Evite - Optional em parâmetros
public void process(Optional<User> user) {}

// ✅ Prefira - overloading
public void process(User user) {}
public void processEmpty() {}
```

## Streams e Collections

Use Streams para transformações. Prefira collections imutáveis.

**Exemplo:**
```java
// ✅ Prefira Streams
List<String> names = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .toList();

// ✅ Mapas imutáveis
Map<Long, String> userMap = users.stream()
    .collect(Collectors.toUnmodifiableMap(User::getId, User::getName));

// ✅ Set imutável
Set<String> roles = Set.of("USER", "ADMIN");
```

## Validações

Use Bean Validation (Jakarta Validation) para validações de entrada.

**Exemplo:**
```java
// ✅ DTO com validações
public record CreateUserRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotNull @Min(18) Integer age
) {}

// ✅ Controller com @Valid
@PostMapping
public ResponseEntity<UserResponse> create(
    @Valid @RequestBody CreateUserRequest request
) {
    UserResponse response = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

## Logs

Use SLF4J com Logback. Nunca use System.out.println.

**Exemplo:**
```java
// ✅ Correto
@Slf4j
@Service
public class UserService {
    public UserResponse findById(Long id) {
        log.debug("Finding user by id: {}", id);
        User user = repository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("User", id));
        log.info("User found: {}", user.getId());
        return toResponse(user);
    }
}

// ❌ Evite
System.out.println("User found: " + user);
logger.info("User found: " + user.getId()); // string concatenation
```

## Testes

Use JUnit 5 e Mockito. Siga o padrão AAA (Arrange, Act, Assert).

**Exemplo:**
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository repository;
    
    @InjectMocks
    private UserService service;
    
    @Test
    @DisplayName("Should create user when valid data is provided")
    void shouldCreateUser() {
        // Arrange
        var request = new CreateUserRequest("John", "john@example.com");
        var user = new User(1L, "John", "john@example.com");
        when(repository.save(any(User.class))).thenReturn(user);
        
        // Act
        var response = service.create(request);
        
        // Assert
        assertThat(response.name()).isEqualTo("John");
        verify(repository).save(any(User.class));
    }
    
    @Test
    @DisplayName("Should throw exception when user not found")
    void shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        when(repository.findById(1L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> service.findById(1L))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
```

## Código Moderno Java 21

Use features modernas do Java 21.

**Exemplo:**
```java
// ✅ Record patterns (Java 21)
public record Point(int x, int y) {}
public record ColoredPoint(Point p, String color) {}

String check(Object obj) {
    if (obj instanceof ColoredPoint(Point(int x, int y), String color)) {
        return "Point at %d,%d is %s".formatted(x, y, color);
    }
    return "Unknown";
}

// ✅ Switch expressions
DayType getDayType(Day day) {
    return switch (day) {
        case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> DayType.WEEKDAY;
        case SATURDAY, SUNDAY -> DayType.WEEKEND;
    };
}

// ✅ String templates (Preview)
String greeting = "Hello, \{user.name()}!";
```

## Padrões de Projeto

Use padrões estabelecidos: Builder para objetos complexos, Strategy para algoritmos variáveis, Factory para criação.

**Exemplo:**
```java
// ✅ Builder pattern para objetos complexos
public class SearchCriteria {
    private String keyword;
    private int page;
    private int size;
    private SortDirection sort;
    
    private SearchCriteria(Builder builder) {
        this.keyword = builder.keyword;
        this.page = builder.page;
        this.size = builder.size;
        this.sort = builder.sort;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String keyword = "";
        private int page = 0;
        private int size = 20;
        private SortDirection sort = SortDirection.ASC;
        
        public Builder keyword(String keyword) {
            this.keyword = keyword;
            return this;
        }
        
        public Builder page(int page) {
            this.page = page;
            return this;
        }
        
        public SearchCriteria build() {
            return new SearchCriteria(this);
        }
    }
}
```

## Convenções de Pacote

Siga a estrutura padrão Spring Boot.

**Exemplo:**
```
com.example.app/
├── Application.java
├── config/
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── controller/
│   └── UserController.java
├── service/
│   ├── UserService.java
│   └── dto/
│       ├── CreateUserRequest.java
│       └── UserResponse.java
├── repository/
│   └── UserRepository.java
├── model/
│   └── User.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
└── common/
    ├── BaseEntity.java
    └── AuditEntity.java
```
