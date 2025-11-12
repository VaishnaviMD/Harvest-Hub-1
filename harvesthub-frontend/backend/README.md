# Harvest Hub Backend (Spring Boot)

This folder is reserved for the Spring Boot backend. The frontend runs independently and will work even if the backend is not started (it falls back to sample data for products and will gracefully handle auth/orders).

## Tech prerequisites

- Java 17+
- Maven 3.9+ (or Gradle if you prefer)
- Spring Boot 3.x
- MySQL 8.x

## Suggested project setup

Create a new Spring Boot project (using Spring Initializr or your IDE) with:
- Spring Web
- Spring Validation
- Spring Data JPA (optional if you will connect to DB)
- H2 or PostgreSQL (optional)
- Spring Security (optional for auth)
- MySQL Driver

Recommended base package: `com.harvesthub`

## Expected REST API

The frontend calls these endpoints (JSON):

- GET `/api/products`
  - Response: `[ { "id": number, "name": string, "price": number, "category": string, "image": string, "description": string } ]`

- GET `/api/products/{id}`
  - Response: `{ "id": number, "name": string, "price": number, "category": string, "image": string, "description": string }`

- POST `/api/orders`
  - Request:
    ```json
    {
      "customerName": "string",
      "address": "string",
      "paymentMethod": "card | cod",
      "items": [ { "productId": 1, "quantity": 2, "price": 99 } ]
    }
    ```
  - Response: `201 Created` (or `200 OK`) with order summary

- POST `/api/auth/signin` (optional)
  - Request: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "..." }` or user info

- POST `/api/auth/signup` (optional)
  - Request: `{ "email": "string", "password": "string", "role": "customer|farmer" }`
  - Response: `{ "id": 1 }` or user info

## CORS / Proxy

- Frontend dev proxy is set to `http://localhost:8080` (see frontend `package.json`).
- If you host backend on another origin, either:
  - Set env in frontend: `REACT_APP_API_BASE_URL=http://your-host:port`
  - Or enable CORS in Spring Boot (global or controller-level):
    ```java
    @CrossOrigin(origins = "http://localhost:3000")
    ```

## Run

```bash
# from backend root (once generated):
mvn spring-boot:run
# or
./mvnw spring-boot:run
```

App should listen on `http://localhost:8080`.

## Sample Controller (sketch)

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

  @GetMapping
  public List<ProductDto> getAll() {
    return List.of(
      new ProductDto(1L, "Organic Tomatoes", 99, "Vegetables", "/category-vegetables.jpg", "Juicy & fresh"),
      new ProductDto(2L, "Fresh Strawberries", 149, "Fruits", "/category-fruits.jpg", "Sweet and seasonal")
    );
  }

  @GetMapping("/{id}")
  public ProductDto getOne(@PathVariable Long id) {
    return new ProductDto(id, "Sample Product", 99, "General", "/category-vegetables.jpg", "Sample");
  }
}
```

Note: The DTO and entities are omitted for brevity. Implement proper persistence and validation as needed.

## MySQL integration (DBMS)

### Dependencies (pom.xml)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
  <scope>runtime</scope>
</dependency>
```

### Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/harvesthub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_mysql_user
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update  # or validate / create / create-drop in dev
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

server.port=8080
```

Alternatively, run the DDL from `backend/schema.sql` and set `spring.jpa.hibernate.ddl-auto=validate` in prod.

### Recommended schema (entities)

- Product: `id, name, price, category, image, description`
- User: `id, email, passwordHash, role`
- Order: `id, customerName, address, paymentMethod, total, createdAt, user_id (nullable)`
- OrderItem: `id, order_id, product_id, quantity, price`

A starter SQL is provided in `backend/schema.sql`.

### JPA Entities (sketch)

```java
@Entity
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private Integer price; // store in INR minor units or integer rupees; here integer rupees for simplicity
  private String category;
  private String image;
  @Column(length=2000)
  private String description;
}

@Entity
@Table(name="users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(unique = true, nullable = false)
  private String email;
  private String passwordHash;
  private String role; // customer|farmer|admin
}

@Entity
@Table(name="orders")
public class Order {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String customerName;
  private String address;
  private String paymentMethod; // card|cod
  private Integer total;
  private Instant createdAt = Instant.now();

  @ManyToOne(fetch = FetchType.LAZY)
  private User user; // nullable

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();
}

@Entity
public class OrderItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.LAZY) private Order order;
  @ManyToOne(fetch = FetchType.LAZY) private Product product;
  private Integer quantity;
  private Integer price;
}
```

### Spring Data repositories (sketch)

```java
public interface ProductRepository extends JpaRepository<Product, Long> {}
public interface OrderRepository extends JpaRepository<Order, Long> {}
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
```

### Controllers (minimal)

- Products
  - GET `/api/products` → `productRepository.findAll()`
  - GET `/api/products/{id}` → `productRepository.findById(id)`
- Orders
  - POST `/api/orders` → map DTO to entities, compute total, save
- Auth (optional, simple)
  - POST `/api/auth/signup` → hash password, save
  - POST `/api/auth/signin` → verify, return dummy token or session

### Sample data (optional)

Insert a few rows into `product` table for quick testing or use `data.sql`.


