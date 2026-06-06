# Software Architecture

## 12 Princípios de Arquitetura de Software (2026)

### 1. Separação de Concerns (Separation of Concerns)

Divida responsabilidades para manter mudanças contidas. Alterações em uma camada não devem afetar outras.

```java
// ✅ Correto - camadas bem separadas
// Controller layer - apenas HTTP
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService service;
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        UserResponse response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// Service layer - regras de negócio
@Service
@Transactional
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;
    
    public UserResponse create(CreateUserRequest request) {
        validateEmailUniqueness(request.email());
        User user = toEntity(request);
        User saved = repository.save(user);
        emailService.sendWelcomeEmail(saved.getEmail());
        return toResponse(saved);
    }
}

// Repository layer - acesso a dados
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

---

### 2. Responsabilidade Única em Componentes (Single Responsibility)

Cada módulo ou serviço deve existir por uma razão clara.

```java
// ❌ Evite - serviço com múltiplas responsabilidades
@Service
public class UserService {
    public User create(CreateUserRequest request) { }
    public void sendEmail(User user) { }  // Responsabilidade de email
    public String generateReport(User user) { }  // Responsabilidade de report
    public void logAudit(User user) { }  // Responsabilidade de audit
}

// ✅ Prefira - serviços com responsabilidade única
@Service
public class UserService {
    private final UserRepository repository;
    private final UserValidator validator;
    
    public User create(CreateUserRequest request) {
        validator.validate(request);
        return repository.save(toEntity(request));
    }
}

@Service
public class UserEmailService {
    public void sendWelcomeEmail(User user) { }
}

@Service
public class UserReportService {
    public String generateReport(User user) { }
}

@Service
public class UserAuditService {
    public void logCreation(User user) { }
}
```

---

### 3. Encapsulamento Através de Contratos Estáveis

Exponha comportamentos via contratos de API estáveis, não estruturas internas.

```java
// ✅ Correto - DTOs como contratos estáveis
public record UserResponse(
    Long id,
    String name,
    String email,
    LocalDateTime createdAt
) {}

// Entity interno pode mudar sem afetar clientes
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    private String name;
    private String email;
    
    // Campos internos não expostos
    private String passwordHash;
    private String internalNotes;
    private LocalDateTime lastLoginAt;
}
```

---

### 4. Inversão de Dependência para Código Crítico de Negócio

Mantenha a lógica de domínio independente de escolhas técnicas.

```java
// ✅ Correto - domínio não depende de framework
// Domain (puro Java, sem dependências)
public class Order {
    private final OrderId id;
    private final CustomerId customerId;
    private final Money totalAmount;
    private OrderStatus status;
    
    public void confirm() {
        if (status != OrderStatus.PENDING) {
            throw new InvalidOrderStateException();
        }
        status = OrderStatus.CONFIRMED;
        DomainEvents.raise(new OrderConfirmedEvent(id.value()));
    }
    
    public boolean canCancel() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }
}

// Infrastructure adapts to domain
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    private final JpaOrderRepository jpaRepository;
    private final OrderMapper mapper;
    
    public Order findById(OrderId id) {
        return jpaRepository.findById(id.value())
            .map(mapper::toDomain)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }
}
```

---

### 5. Dependências Explícitas em Vez de Magia Oculta

Torne dependências visíveis e injetadas explicitamente.

```java
// ❌ Evite - dependência oculta via static/singleton
@Service
public class OrderService {
    public Order create(OrderRequest request) {
        // Dependência oculta
        Database db = Database.getInstance();
        Config config = ConfigLoader.load();
        // ...
    }
}

// ✅ Prefira - dependências explícitas via construtor
@Service
@Transactional
public class OrderService {
    private final OrderRepository repository;
    private final PaymentGateway paymentGateway;
    private final NotificationService notificationService;
    
    // Dependências claras e visíveis
    public OrderService(OrderRepository repository,
                       PaymentGateway paymentGateway,
                       NotificationService notificationService) {
        this.repository = repository;
        this.paymentGateway = paymentGateway;
        this.notificationService = notificationService;
    }
}
```

---

### 6. Acoplamento Solto, Alta Coesão

Minimize conhecimento entre componentes, agrupe responsabilidades relacionadas.

```java
// ✅ Correto - módulos coesos com baixo acoplamento

// Módulo de Pedidos
// orders/
// ├── Order.java (entity)
// ├── OrderRepository.java
// ├── OrderService.java
// ├── OrderController.java
// └── events/
//     ├── OrderCreatedEvent.java
//     └── OrderConfirmedEvent.java

// Módulo de Pagamentos (não conhece detalhes de Pedidos)
// payments/
// ├── Payment.java
// ├── PaymentRepository.java
// ├── PaymentService.java
// └── listeners/
//     └── OrderPaymentListener.java (ouve eventos de pedidos)

// Comunicação via eventos de domínio
@Component
public class OrderPaymentListener {
    private final PaymentService paymentService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        paymentService.processPayment(event.getOrderId());
    }
}
```

---

## Coesão e Acoplamento - Guia Detalhado

### Tipos de Coesão (do melhor para o pior)

| Tipo | Nível | Descrição | Exemplo |
|------|-------|-----------|---------|
| **Funcional** | ✅ Ideal | Todas as partes contribuem para uma única função bem definida | `UserService.create()`, `OrderValidator.validate()` |
| **Sequencial** | ✅ Bom | Saída de uma parte é entrada da outra | `OrderProcessor` → `OrderShipper` |
| **Comunicacional** | ⚠️ Aceitável | Partes operam sobre os mesmos dados | `OrderRepository` (lê e escreve orders) |
| **Temporal** | ⚠️ Mediano | Partes são executadas no mesmo tempo | `@BeforeTransaction`, `@AfterTransaction` |
| **Procedural** | ❌ Ruim | Partes são agrupadas por sequência arbitrária | `Utils.process()`, `Utils.handle()` |
| **Coincidental** | ❌ Péssimo | Sem relação significativa entre partes | `MiscService`, `Helper`, `Util` |

### Tipos de Acoplamento (do pior para o melhor)

| Tipo | Nível | Descrição | Exemplo |
|------|-------|-----------|---------|
| **Conteúdo** | ❌ Péssimo | Módulo acessa dados internos de outro | `order.items.get(0).price` (acesso direto) |
| **Comum** | ❌ Péssimo | Compartilhamento de dados globais | `static Database.instance`, `Singleton.getInstance()` |
| **Controle** | ❌ Ruim | Passa flag para controlar comportamento | `service.process(data, true)` |
| **Carimbo** | ⚠️ Mediano | Passa estrutura de dados completa | `service.process(order)` quando só precisa de `orderId` |
| **Dados** | ✅ Bom | Passa apenas dados necessários | `service.process(orderId)` |
| **Mensagem** | ✅ Ideal | Comunicação via interface/mensagem | `eventPublisher.publish(event)` |

---

### Princípios para Alta Coesão

#### 1. Agrupe por Mudança Conjunta

```java
// ❌ Baixa coesão - muda por motivos diferentes
@Service
public class OrderService {
    public void createOrder() { }      // Muda com regra de negócio
    public void sendEmail() { }        // Muda com provedor de email
    public void generatePDF() { }      // Muda com template de relatório
    public void logAudit() { }         // Muda com requisito de compliance
}

// ✅ Alta coesão - cada serviço tem um motivo para mudar
@Service
public class OrderService {
    private final OrderRepository repository;
    
    public Order create(CreateOrderRequest request) {
        // Apenas regra de negócio de criação de pedido
    }
}

@Service
public class OrderEmailService {
    // Apenas envio de emails relacionados a pedidos
}

@Service
public class OrderReportService {
    // Apenas geração de relatórios
}
```

#### 2. Mantenha Dados e Operações Juntos

```java
// ❌ Baixa coesão - dados separados das operações
public class OrderData {
    public Long id;
    public String customerName;
    public BigDecimal total;
    // Sem comportamento
}

public class OrderOperations {
    public void calculateDiscount(OrderData order) { }
    public void validate(OrderData order) { }
    public void applyTax(OrderData order) { }
}

// ✅ Alta coesão - dados e operações no mesmo lugar
public class Order {
    private final OrderId id;
    private final CustomerId customerId;
    private Money totalAmount;
    
    public void applyDiscount(Discount discount) {
        this.totalAmount = this.totalAmount.subtract(discount.getAmount());
    }
    
    public void calculateTax(TaxRate rate) {
        this.totalAmount = this.totalAmount.multiply(rate.getValue());
    }
    
    public boolean isValid() {
        return !this.totalAmount.isZero() && this.customerId != null;
    }
}
```

#### 3. Evite Classes "Deus"

```java
// ❌ Classe Deus - sabe e faz tudo
@Service
public class OrderManager {
    public void createOrder() { }
    public void cancelOrder() { }
    public void shipOrder() { }
    public void invoiceOrder() { }
    public void refundOrder() { }
    public void notifyCustomer() { }
    public void updateInventory() { }
    public void generateReport() { }
    // 500+ linhas, 30+ métodos, 15+ dependências
}

// ✅ Classes focadas
@Service
public class OrderCreationService { }
@Service
public class OrderCancellationService { }
@Service
public class OrderShippingService { }
@Service
public class OrderInvoicingService { }
@Service
public class CustomerNotificationService { }
```

---

### Princípios para Baixo Acoplamento

#### 1. Use Interfaces, Não Implementações

```java
// ❌ Acoplamento forte - depende de implementação concreta
@Service
public class OrderService {
    private final JpaOrderRepository repository;  // Implementação específica
    
    public Order findById(Long id) {
        return repository.findById(id).orElseThrow();
    }
}

// ✅ Baixo acoplamento - depende de abstração
@Service
public class OrderService {
    private final OrderRepository repository;  // Interface
    
    public Order findById(Long id) {
        return repository.findById(id).orElseThrow();
    }
}

public interface OrderRepository {
    Optional<Order> findById(Long id);
}
```

#### 2. Evite Acoplamento Temporal

```java
// ❌ Acoplamento temporal - ordem de execução importa
@Service
public class OrderProcessor {
    public void process(Order order) {
        validateOrder(order);    // Deve ser chamado primeiro
        calculateTotal(order);   // Deve ser chamado segundo
        applyDiscount(order);    // Deve ser chamado terceiro
        saveOrder(order);        // Deve ser chamado por último
    }
    
    // Métodos públicos que podem ser chamados fora de ordem
    public void validateOrder(Order order) { }
    public void calculateTotal(Order order) { }
    public void applyDiscount(Order order) { }
    public void saveOrder(Order order) { }
}

// ✅ Sem acoplamento temporal - método único coeso
@Service
public class OrderProcessor {
    public Order process(CreateOrderRequest request) {
        // Toda lógica interna, ordem não importa para o caller
        Order order = toEntity(request);
        validate(order);
        calculateTotal(order);
        applyDiscounts(order);
        return repository.save(order);
    }
}
```

#### 3. Use Injeção de Dependência

```java
// ❌ Acoplamento forte - dependência hardcoded
@Service
public class OrderService {
    private final EmailSender emailSender = new SmtpEmailSender();
    
    public void notifyCustomer(Order order) {
        emailSender.send(order.getCustomerEmail(), "Order created");
    }
}

// ✅ Baixo acoplamento - dependência injetada
@Service
public class OrderService {
    private final NotificationService notificationService;
    
    // Injeção por construtor (explícita e testável)
    public OrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    public void notifyCustomer(Order order) {
        notificationService.notify(order.getCustomerEmail(), "Order created");
    }
}
```

#### 4. Use Eventos de Domínio

```java
// ❌ Acoplamento direto - OrderService conhece todos os listeners
@Service
public class OrderService {
    private final OrderRepository repository;
    private final EmailService emailService;
    private final SmsService smsService;
    private final InventoryService inventoryService;
    private final AnalyticsService analyticsService;
    
    public Order create(CreateOrderRequest request) {
        Order order = repository.save(toEntity(request));
        
        // Acoplamento forte com todos os dependentes
        emailService.sendOrderConfirmation(order);
        smsService.sendOrderSms(order);
        inventoryService.reserveItems(order);
        analyticsService.trackOrder(order);
        
        return order;
    }
}

// ✅ Baixo acoplamento - eventos de domínio
@Entity
public class Order {
    @Transient
    private final List<DomainEvent> events = new ArrayList<>();
    
    public void confirm() {
        if (status != OrderStatus.PENDING) {
            throw new InvalidOrderStateException();
        }
        status = OrderStatus.CONFIRMED;
        
        // Levanta evento, não conhece os listeners
        events.add(new OrderConfirmedEvent(this));
    }
    
    public List<DomainEvent> getEvents() {
        return new ArrayList<>(events);
    }
}

@Service
public class OrderService {
    public Order create(CreateOrderRequest request) {
        Order order = repository.save(toEntity(request));
        domainEventPublisher.publishAll(order.getEvents());
        return order;
    }
}

// Listeners independentes - baixo acoplamento
@Component
public class OrderEmailListener {
    @TransactionalEventListener
    public void handle(OrderConfirmedEvent event) {
        emailService.sendConfirmation(event.getOrder());
    }
}

@Component
public class OrderSmsListener {
    @TransactionalEventListener
    public void handle(OrderConfirmedEvent event) {
        smsService.sendSms(event.getOrder());
    }
}

@Component
public class OrderInventoryListener {
    @TransactionalEventListener
    public void handle(OrderConfirmedEvent event) {
        inventoryService.reserve(event.getOrder());
    }
}
```

#### 5. Evite Getters/Setters Anêmicos

```java
// ❌ Modelo anêmico - acoplamento de dados
@Entity
public class Order {
    @Getter @Setter
    private Long id;
    
    @Getter @Setter
    private String status;
    
    @Getter @Setter
    private BigDecimal total;
    
    @Getter @Setter
    private List<OrderItem> items;
}

// Service precisa conhecer todos os detalhes
@Service
public class OrderService {
    public void applyDiscount(Order order, Discount discount) {
        // Lógica vazada para o service
        BigDecimal discountAmount = order.getTotal()
            .multiply(discount.getPercentage());
        order.setTotal(order.getTotal().subtract(discountAmount));
    }
}

// ✅ Modelo rico - encapsulamento
@Entity
public class Order {
    @Getter
    private OrderId id;
    
    @Getter
    private OrderStatus status;
    
    @Embedded
    private Money totalAmount;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    // Comportamentos que mantêm invariantes
    public void applyDiscount(Discount discount) {
        if (status != OrderStatus.PENDING) {
            throw new InvalidOrderStateException();
        }
        this.totalAmount = this.totalAmount.subtract(discount.getAmount());
    }
    
    public void addItem(Product product, int quantity) {
        if (status != OrderStatus.PENDING) {
            throw new InvalidOrderStateException();
        }
        this.items.add(new OrderItem(product, quantity));
        recalculateTotal();
    }
    
    private void recalculateTotal() {
        this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
    }
}
```

---

### Métricas de Coesão e Acoplamento

#### Sinais de Baixa Coesão

```java
// 🚩 Nome genérico
class Utils { }
class Helper { }
class Manager { }

// 🚩 Muitos imports diferentes
import java.io.*;
import java.sql.*;
import java.net.*;
import javax.mail.*;
import org.json.*;

// 🚩 Muitos campos não relacionados
class OrderService {
    private final OrderRepository repository;
    private final EmailService email;
    private final SmsService sms;
    private final PdfGenerator pdf;
    private final ReportGenerator report;
    private final AuditLogger audit;
    // 10+ dependências = baixa coesão
}

// 🚩 Métodos com nomes não relacionados
class UserService {
    public void create() { }
    public void sendEmail() { }
    public void generateReport() { }
    public void connectToApi() { }
    public void processPayment() { }
}
```

#### Sinais de Alto Acoplamento

```java
// 🚩 Acesso a dados internos
order.getItems().get(0).getProduct().getPrice();

// 🚩 Uso excessivo de static
Database db = Database.getInstance();
Config config = ConfigLoader.load();

// 🚩 Passar "this" ou contexto completo
service.process(this);
handler.handle(context);

// 🚩 Flag parameters
processor.process(data, true, false);

// 🚩 Cadeia de getters
user.getProfile().getAddress().getCity().getName();
```

---

### Ferramentas de Análise

#### ArchUnit para Verificar Coesão/Acoplamento

```java
@TestConfiguration
public class CohesionCouplingTest {

    // Verificar que controllers não acessam repositories diretamente
    @Test
    void controllerShouldNotAccessRepository() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example");
        
        noClasses()
            .that().resideInAPackage("..controller..")
            .should().dependOnClassesThat().resideInAPackage("..repository..")
            .check(classes);
    }
    
    // Verificar que services não se comunicam entre si
    @Test
    void servicesShouldNotDependOnOtherServices() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example.service");
        
        classes().that().areAnnotatedWith(Service.class)
            .should().onlyDependOnClassesThat()
            .resideInAnyPackage(
                "..repository..",
                "..dto..",
                "..model..",
                "java..",
                "org.springframework..")
            .check(classes);
    }
    
    // Verificar que domain não depende de infraestrutura
    @Test
    void domainShouldNotDependOnInfrastructure() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example.domain");
        
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage(
                "..infrastructure..",
                "..adapter..",
                "org.springframework..",
                "javax.persistence..")
            .check(classes);
    }
    
    // Verificar que utils não existem
    @Test
    void noUtilityClasses() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example");
        
        classes().that().haveSimpleName("Utils")
            .or().haveSimpleName("Helper")
            .should().notExist()
            .check(classes);
    }
    
    // Verificar tamanho máximo de classe
    @Test
    void classesShouldNotBeTooLarge() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example");
        
        classes().that().haveNumberOfLinesGreaterThan(300)
            .should().notExist()
            .check(classes);
    }
}
```

---

### Checklist de Coesão e Acoplamento

#### Coesão

- [ ] Cada classe tem uma única responsabilidade bem definida
- [ ] Nome da classe reflete claramente seu propósito
- [ ] Todos os métodos contribuem para o propósito da classe
- [ ] Dados e operações estão no mesmo lugar
- [ ] Não existem classes "Utils", "Helper", "Manager"
- [ ] Classes têm no máximo 300 linhas
- [ ] Métodos têm no máximo 50 linhas
- [ ] Não há mais de 7-10 campos por classe

#### Acoplamento

- [ ] Depende de abstrações (interfaces), não implementações
- [ ] Injeção de dependência via construtor
- [ ] Não usa singletons ou estado global
- [ ] Não passa flags booleanas como parâmetro
- [ ] Não acessa dados internos de outras classes (lei de Demeter)
- [ ] Comunicação entre módulos via eventos ou interfaces
- [ ] Não há mais de 5-7 dependências por classe
- [ ] Controllers → Services → Repositories (camadas claras)
- [ ] Domain não depende de infraestrutura
- [ ] Services não dependem de outros services

---

### Regra Prática: 7 ± 2

- **Máximo 7 ± 2 dependências** por classe
- **Máximo 7 ± 2 métodos** públicos por classe
- **Máximo 7 ± 2 parâmetros** por método (use objetos se mais)
- **Máximo 7 ± 2 campos** por classe

Se ultrapassar, considere dividir a classe ou extrair responsabilidades.

---

### 7. Contextos Delimitados e Propriedade Clara (Bounded Contexts)

Defina limites de domínio onde termos e regras são consistentes.

```java
// ✅ Correto - bounded contexts claros

// Contexto: Sales (Vendas)
// sales/
// ├── Order.java (foco em venda, preços, descontos)
// │   - totalAmount
// │   - discount
// │   - commission
// └── OrderService.java (regras de venda)

// Contexto: Shipping (Entrega)
// shipping/
// ├── Order.java (foco em entrega, endereço, prazo)
// │   - shippingAddress
// │   - estimatedDelivery
// │   - trackingCode
// └── ShippingService.java (regras de entrega)

// Contexto: Billing (Cobrança)
// billing/
// ├── Order.java (foco em cobrança, impostos, pagamento)
// │   - taxAmount
// │   - paymentStatus
// │   - invoiceNumber
// └── BillingService.java (regras de cobrança)

// Cada contexto tem sua própria visão de "Order"
// Comunicação via APIs ou eventos
```

---

### 8. Propriedade de Dados e Contratos de Dados

Não compartilhe tabelas de banco de dados diretamente.

```java
// ❌ Evite - múltiplos bounded contexts acessando mesma tabela
// Sales e Shipping acessam diretamente a tabela 'orders'
// Isso cria acoplamento forte

// ✅ Prefira - cada contexto possui seus dados
// Sales possui tabela sales_orders
// Shipping possui tabela shipping_orders

// Sincronização via eventos
@Component
public class OrderSyncListener {
    @TransactionalEventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Shipping cria sua própria cópia dos dados necessários
        shippingRepository.save(ShippingOrder.from(event));
    }
}
```

---

### 9. Projetar para Falha, Não para o Caminho Feliz

Assuma falhas em sistemas distribuídos.

```java
// ✅ Correto - tratamento de falhas
@Service
public class PaymentService {
    
    private final PaymentGateway gateway;
    private final RetryTemplate retryTemplate;
    private final CircuitBreakerFactory circuitBreakerFactory;
    
    public PaymentResult processPayment(Order order) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("paymentGateway");
        
        return circuitBreaker.run(
            () -> retryTemplate.execute(ctx -> 
                gateway.charge(order.getTotalAmount(), order.getPaymentMethod())
            ),
            throwable -> handlePaymentFailure(order, throwable)
        );
    }
    
    private PaymentResult handlePaymentFailure(Order order, Throwable throwable) {
        log.error("Payment failed for order {}", order.getId(), throwable);
        
        // Compensating transaction
        order.cancel();
        notificationService.sendPaymentFailedEmail(order.getCustomerEmail());
        
        return PaymentResult.failed(throwable.getMessage());
    }
}

// ✅ Timeout configurado
@Configuration
public class HttpClientConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return RestTemplateBuilder.builder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}
```

---

### 10. Observabilidade e Operabilidade São Arquitetura

Integre logs, métricas e tracing desde o design.

```java
// ✅ Correto - observabilidade integrada
@Slf4j
@Service
public class OrderService {
    
    private final MeterRegistry meterRegistry;
    private final Tracer tracer;
    
    public Order create(CreateOrderRequest request) {
        Span span = tracer.buildSpan("createOrder").start();
        Timer.Sample timer = Timer.start(meterRegistry);
        
        try (Scope scope = span.activate()) {
            log.info("Creating order for customer {}", request.customerId());
            
            Order order = repository.save(toEntity(request));
            
            meterRegistry.counter("orders.created", "status", "success").increment();
            log.info("Order {} created successfully", order.getId());
            
            return order;
        } catch (Exception e) {
            meterRegistry.counter("orders.created", "status", "error").increment();
            log.error("Failed to create order", e);
            span.setTag("error", true);
            throw e;
        } finally {
            timer.stop(Timer.builder("order.creation.time")
                .register(meterRegistry));
            span.finish();
        }
    }
}

// ✅ Health checks
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(5)) {
                return Health.up().withDetail("database", "connected").build();
            }
        } catch (SQLException e) {
            return Health.down(e).withDetail("database", "connection failed").build();
        }
        return Health.down().withDetail("database", "unknown error").build();
    }
}
```

---

### 11. Preferir Simplicidade Até Ganhar Complexidade

Comece simples, introduza complexidade apenas quando necessário.

```java
// ✅ Comece com monólito modular
// app/
// ├── orders/
// ├── payments/
// ├── shipping/
// ├── customers/
// └── shared/

// Cada módulo é um pacote bem definido
// Comunicação via interfaces Java

// ✅ Evolua para microsserviços apenas quando necessário:
// - Equipe cresceu (> 8 pessoas)
// - Escala diferente por módulo
// - Deploy independente necessário
// - Tecnologias diferentes necessárias
```

**Critérios para introduzir complexidade:**

| Situação | Complexidade Justificada |
|----------|-------------------------|
| 1-2 desenvolvedores | Monólito simples |
| 3-8 desenvolvedores | Monólito modular |
| 8+ desenvolvedores | Considere microsserviços |
| Deploy frequente de partes específicas | Separe em serviço |
| Escala muito diferente entre módulos | Separe em serviço |
| Necessidade de tecnologias diferentes | Separe em serviço |

---

### 12. Registrar Decisões e Impor Guardrails

Documente escolhas arquiteturais e use verificações automatizadas.

```java
// ✅ ADR (Architecture Decision Record)
// docs/architecture/adr/001-use-hexagonal-architecture.md

# ADR 001: Usar Arquitetura Hexagonal

## Contexto
Precisamos de uma arquitetura que permita testabilidade e independência de frameworks.

## Decisão
Usar Arquitetura Hexagonal (Ports & Adapters) com:
- Domain no centro (puro Java)
- Ports como interfaces
- Adapters para infraestrutura

## Consequências
+ Testabilidade melhorada
+ Independência de frameworks
+ Mais boilerplate inicial

## Status
Aceito em 2026-01-15
```

```java
// ✅ Guardrails automatizados com ArchUnit
@TestConfiguration
public class ArchitectureTest {
    
    @Test
    void domainShouldNotDependOnInfrastructure() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example");
        
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .check(classes);
    }
    
    @Test
    void controllerShouldOnlyDependOnService() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example");
        
        classes().that().resideInAPackage("..controller..")
            .should().onlyDependOnClassesThat().resideInAnyPackage(
                "..controller..",
                "..service..",
                "..dto..",
                "java..",
                "org.springframework..")
            .check(classes);
    }
    
    @Test
    void serviceShouldBeTransactional() {
        JavaClasses classes = new ClassFileImporter().importPackages("com.example.service");
        
        classes().that().areAnnotatedWith(Service.class)
            .should().beAnnotatedWith(Transactional.class)
            .check(classes);
    }
}
```

---

## Padrões Arquiteturais

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────┐
│                   Adapters                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  REST    │  │   JPA    │  │  Message │         │
│  │Controller│  │Repository│  │  Queue   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
├───────┼─────────────┼─────────────┼────────────────┤
│       │    Ports    │             │                │
│  ┌────▼─────┐  ┌────▼─────┐       │                │
│  │  Input   │  │  Output  │       │   Domain       │
│  │  Port    │  │  Port    │◄──────┤   (Core)       │
│  │(Service) │  │(Repository)│      │                │
│  └──────────┘  └──────────┘       │                │
└─────────────────────────────────────────────────────┘
```

### Clean Architecture

```
        ┌─────────────────────────────────┐
        │      Frameworks & Drivers       │
        │  (Spring, JPA, REST, Database)  │
        └───────────────┬─────────────────┘
        ┌───────────────▼─────────────────┐
        │     Interface Adapters          │
        │  (Controllers, Presenters,      │
        │   Gateways, Repositories Impl)  │
        └───────────────┬─────────────────┘
        ┌───────────────▼─────────────────┐
        │     Use Cases                   │
        │  (Application Services,         │
        │   Business Rules)               │
        └───────────────┬─────────────────┘
        ┌───────────────▼─────────────────┐
        │     Entities                    │
        │  (Domain Models,                │
        │   Enterprise Business Rules)    │
        └─────────────────────────────────┘
```

---

## Checklist de Qualidade Arquitetural

- [ ] Separação de concerns clara (Controller → Service → Repository)
- [ ] Cada classe tem responsabilidade única
- [ ] Dependências injetadas explicitamente
- [ ] Domínio não depende de infraestrutura
- [ ] Contratos de API estáveis (DTOs)
- [ ] Bounded contexts bem definidos
- [ ] Tratamento de falhas implementado
- [ ] Observabilidade integrada (logs, métricas, tracing)
- [ ] ADRs documentados
- [ ] Guardrails automatizados (ArchUnit)
- [ ] Complexidade justificada pelo contexto
