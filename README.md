# Sales Savvy — Modern Full-Stack E-Commerce Platform

Sales Savvy is a production-ready, full-stack e-commerce platform specifically designed for Small and Medium Businesses (SMBs). It provides dedicated workflows for both customers and store administrators, complete with secure JWT-based authentication in HttpOnly cookies, dynamic catalog browsing, inventory stock management, customer cart & order lifecycles, and Razorpay payment integration with server-side signature verification.

---

## Table of Contents

- [Project Overview](#project-overview)
- [The Six Core Functional Services](#the-six-core-functional-services)
- [Technology Stack](#technology-stack)
- [Architecture & Layering](#architecture--layering)
- [Project Directory Structure](#project-directory-structure)
- [Database Schema & Entity Relationships](#database-schema--entity-relationships)
- [REST API Documentation](#rest-api-documentation)
- [Authentication Workflow](#authentication-workflow)
- [Payment Workflow (Razorpay)](#payment-workflow-razorpay)
- [Environment Variables](#environment-variables)
- [Local Setup & Execution](#local-setup--execution)
- [Docker & Containerized Deployment](#docker--containerized-deployment)
- [Automated Testing](#automated-testing)
- [Known Limitations](#known-limitations)

---

## Project Overview

Sales Savvy focuses on practical, performant, and secure SMB retail needs without unnecessary enterprise bloat:
- **Single Currency & Single Language Focus**: Streamlined pricing in Indian Rupees (INR ₹) and clean English interface.
- **Strict Role-Based Access Control (RBAC)**: Distinct `CUSTOMER` and `ADMIN` roles enforced server-side via Spring Security 6.
- **Secure Credential Handling**: BCrypt password hashing, HttpOnly cookies protecting JWT tokens from XSS, and zero exposure of sensitive secrets in responses.
- **Authoritative Server-Side Logic**: Product availability, pricing, shipping tiers, order subtotals, and Razorpay HMAC-SHA256 signature verification calculated exclusively on the backend.

---

## The Six Core Functional Services

Sales Savvy is structured into six functional domain services:

1. **Authentication Service (`AuthService`)**
   - Handles customer and administrator credential validation (`POST /api/auth/login`).
   - Issues signed 256-bit JWT tokens containing username and role claims.
   - Sets secure `HttpOnly` session cookies (`jwt_token`) to prevent token theft via client scripts.
   - Manages token persistence in `jwt_tokens` and invalidation upon logout (`POST /api/auth/logout`).

2. **User Management Service (`UserService`)**
   - Public customer registration (`POST /api/users/register`) with strict validation (5–50 character username, valid unique email, complex password).
   - Enforces default `CUSTOMER` role upon registration (unauthorized customer registration cannot grant admin privileges).
   - Profile management (`GET/PUT /api/users/profile`).
   - Admin user lifecycle management (`/api/admin/users`), including activation/deactivation and role changes.
   - Built-in safeguard protecting against deactivation or deletion of the last remaining administrator account.

3. **Product Management Service (`ProductService` & `CategoryService`)**
   - Category department organization with unique names (`/api/categories`).
   - Product catalog with name, description, unit price, real-time inventory stock, category mapping, and multiple image URLs (`/api/products`).
   - Keyword search across product names and descriptions, category-specific filtering, and sorting (price low-to-high, high-to-low, newest).
   - Automatic stock deduction upon successful payment and stock restoration upon order cancellation.

4. **Cart Management Service (`CartService`)**
   - Isolated customer cart instances mapped strictly to the authenticated user ID (`/api/cart`).
   - Line item management: Add to cart, quantity increment/decrement, line removal, and complete cart wipe.
   - Live inventory validation ensuring requested quantities never exceed available stock.

5. **Order Management Service (`OrderService`)**
   - Converts customer cart items into formal orders preserving historical unit prices (`price_per_unit`) regardless of future product price changes.
   - Configurable shipping tiers:
     - **STANDARD**: ₹50.00 (3–5 business days)
     - **EXPRESS**: ₹120.00 (1–2 business days)
   - Decoupled Order Fulfillment Lifecycle: `PENDING` &rarr; `APPROVED` &rarr; `SHIPPED` &rarr; `DELIVERED` (or `CANCELLED`).
   - Customer order history and timeline tracking (`/api/orders`).
   - Administrative order status progression (`PUT /api/admin/orders/{id}/status`).

6. **Payment Management Service (`PaymentService`)**
   - Independent Payment Lifecycle: `PENDING` &rarr; `SUCCESS` &rarr; `FAILED`.
   - Authoritative server-side payable amount calculation in paise (INR cents).
   - Razorpay Order initialization via official Razorpay Java SDK.
   - Cryptographic `HMAC-SHA256` signature verification (`orderId + "|" + paymentId` hashed with key secret).
   - Atomic cart clearance and stock reduction executed inside a `@Transactional` boundary only after payment verification succeeds.

---

## Technology Stack

### Backend
- **Java**: 21 LTS
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6, BCrypt, JJWT 0.12.6
- **Database & ORM**: MySQL 8.0, Spring Data JPA, Hibernate ORM
- **Payment Gateway**: Razorpay Java SDK 1.4.7
- **API Documentation**: SpringDoc OpenAPI / Swagger UI 2.6.0
- **Build Tool**: Apache Maven 3.9+

### Frontend
- **Runtime & Build**: Node.js, Vite 5.4
- **UI Library**: React 18
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios (configured with `withCredentials: true`)
- **Icons**: Lucide React
- **Design System**: Custom Modern CSS with Plus Jakarta Sans typography, glassmorphism, responsive grids, and micro-interactions

---

## Architecture & Layering

The application adheres to clean layered architecture:

```text
React Frontend (Vite Single Page Application)
               ↕ (REST API JSON + HttpOnly Cookies)
Spring Boot Controllers (Request validation, auth context, HTTP status)
               ↓
Domain Services (Business logic, calculations, transaction boundaries)
               ↓
Spring Data JPA Repositories (Database access & index optimizations)
               ↓
MySQL Relational Persistence (sales_savvy database)
```

---

## Project Directory Structure

```text
sales_savvy/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sales/savvy/
│   │   │   │   ├── SalesSavvyApplication.java
│   │   │   │   ├── config/              # Security, CORS, OpenAPI configs
│   │   │   │   ├── controller/          # REST API endpoints
│   │   │   │   ├── dto/                 # Request/Response Data Transfer Objects
│   │   │   │   ├── entity/              # JPA domain entities & enums
│   │   │   │   ├── exception/           # Custom exceptions & RestControllerAdvice
│   │   │   │   ├── repository/          # Spring Data JPA repositories
│   │   │   │   ├── security/            # JWT filters, UserDetailsService, Token logic
│   │   │   │   └── service/             # Domain business logic & data seeder
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/                        # JUnit 5 & Mockito test suites
│   ├── Dockerfile                       # Multi-stage Java 21 build
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/                  # Navbar, Footer, ProductCard, AdminNav, ProtectedRoute
│   │   ├── context/                     # AuthContext, CartContext
│   │   ├── pages/                       # Customer pages (Login, Register, Home, Cart, Checkout, etc.)
│   │   │   └── admin/                   # Admin pages (Dashboard, Users, Products, Orders, Reports)
│   │   ├── services/                    # Axios API service integrations
│   │   ├── tests/                       # Vitest component unit tests
│   │   ├── App.jsx                      # Client router configuration
│   │   ├── index.css                    # Design tokens & responsive styles
│   │   └── main.jsx
│   ├── Dockerfile                       # Multi-stage Node/Nginx container
│   ├── nginx.conf                       # Reverse proxy for /api/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml                   # MySQL + Backend + Frontend orchestration
├── .env.example                         # Environment configuration template
└── README.md
```

---

## Database Schema & Entity Relationships

The MySQL database `sales_savvy` contains 9 primary tables with indexing and relational integrity:

```text
                    ┌──────────────┐
                    │  categories  │
                    └──────┬───────┘
                           │ 1
                           │ *
┌─────────────┐     ┌──────┴───────┐     ┌───────────────┐
│ users       │     │  products    ├────<│ productimages │
└──────┬──────┘     └──────┬───────┘     └───────────────┘
       │ 1                 │ 1
       │ *                 │ *
       ├───────────────────┼───────────┐
       │                   │           │
┌──────┴──────┐     ┌──────┴───────┐   │
│ jwt_tokens  │     │  cart_items  │   │
└─────────────┘     └──────────────┘   │
       │ 1                             │
       │ *                             │
┌──────┴──────┐     ┌──────────────┐   │
│ orders      ├────<│ order_items  ├───┘
└──────┬──────┘     └──────────────┘
       │ 1
       │ 1
┌──────┴──────┐
│ payments    │
└─────────────┘
```

### Table Definitions & Key Constraints

1. **`users`**:
   - `user_id` (PK, Auto-increment)
   - `username` (VARCHAR(50), Unique, Indexed)
   - `email` (VARCHAR(100), Unique, Indexed)
   - `password` (VARCHAR(255), BCrypt hashed)
   - `role` (VARCHAR(20), `ADMIN` or `CUSTOMER`)
   - `status` (VARCHAR(20), `ACTIVE` or `INACTIVE`)
   - `created_at`, `updated_at`

2. **`jwt_tokens`**:
   - `token_id` (PK, Auto-increment)
   - `user_id` (FK &rarr; `users.user_id`)
   - `token` (VARCHAR(500), Indexed)
   - `created_at`, `expires_at`, `revoked` (BOOLEAN)

3. **`categories`**:
   - `category_id` (PK, Auto-increment)
   - `category_name` (VARCHAR(100), Unique, Indexed)

4. **`products`**:
   - `product_id` (PK, Auto-increment)
   - `name` (VARCHAR(150), Indexed)
   - `description` (TEXT)
   - `price` (DECIMAL(10,2))
   - `stock` (INT, Min 0)
   - `category_id` (FK &rarr; `categories.category_id`, Indexed)
   - `created_at`, `updated_at`

5. **`productimages`**:
   - `image_id` (PK, Auto-increment)
   - `product_id` (FK &rarr; `products.product_id`, Indexed)
   - `image_url` (VARCHAR(1000))

6. **`cart_items`**:
   - `id` (PK, Auto-increment)
   - `user_id` (FK &rarr; `users.user_id`, Indexed)
   - `product_id` (FK &rarr; `products.product_id`)
   - `quantity` (INT, Min 1)
   - Unique constraint: (`user_id`, `product_id`)

7. **`orders`**:
   - `order_id` (PK, Auto-increment)
   - `user_id` (FK &rarr; `users.user_id`, Indexed)
   - `subtotal` (DECIMAL(10,2))
   - `shipping_option` (VARCHAR(20), `STANDARD` / `EXPRESS`)
   - `shipping_charge` (DECIMAL(10,2))
   - `total_amount` (DECIMAL(10,2))
   - `status` (VARCHAR(20), `PENDING`, `APPROVED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, Indexed)
   - `shipping_address` (TEXT)
   - `created_at`, `updated_at`

8. **`order_items`**:
   - `id` (PK, Auto-increment)
   - `order_id` (FK &rarr; `orders.order_id`, Indexed)
   - `product_id` (FK &rarr; `products.product_id`)
   - `quantity` (INT)
   - `price_per_unit` (DECIMAL(10,2)) &mdash; *Preserves exact purchase price at checkout time*
   - `total_price` (DECIMAL(10,2))

9. **`payments`**:
   - `payment_id` (PK, Auto-increment)
   - `order_id` (FK &rarr; `orders.order_id`, Indexed, 1-to-1)
   - `user_id` (FK &rarr; `users.user_id`)
   - `gateway_order_id` (VARCHAR(100), Razorpay order ID, Indexed)
   - `gateway_payment_id` (VARCHAR(100), Razorpay payment ID)
   - `gateway_signature` (VARCHAR(255))
   - `amount` (DECIMAL(10,2))
   - `currency` (VARCHAR(10), default `INR`)
   - `payment_method` (VARCHAR(50), default `RAZORPAY`)
   - `status` (VARCHAR(20), `PENDING`, `SUCCESS`, `FAILED`)
   - `created_at`, `updated_at`

---

## REST API Documentation

Interactive Swagger documentation is available locally at:
`http://localhost:8080/swagger-ui/index.html` (JSON OpenAPI spec at `/v3/api-docs`)

### Authentication & User Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Validates credentials, issues JWT via HttpOnly cookie |
| `POST` | `/api/auth/logout` | Public | Revokes token in DB, clears HttpOnly cookie |
| `GET` | `/api/auth/me` | Authenticated | Returns currently authenticated user session |
| `POST` | `/api/users/register` | Public | Customer self-registration (defaults to `CUSTOMER`) |
| `GET` | `/api/users/profile` | Authenticated | Get current user's profile |
| `PUT` | `/api/users/profile` | Authenticated | Update user email address |

### Catalog & Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products (optional filters: `categoryId`, `search`) |
| `GET` | `/api/products/page` | Public | Paginated product listing with sorting |
| `GET` | `/api/products/{id}` | Public | Get product details by ID |
| `POST` | `/api/products` | Admin | Create product with images and stock |
| `PUT` | `/api/products/{id}` | Admin | Update existing product details |
| `DELETE` | `/api/products/{id}` | Admin | Delete product |
| `GET` | `/api/categories` | Public | List all categories |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/{id}` | Admin | Update category |
| `DELETE` | `/api/categories/{id}` | Admin | Delete category |

### Cart Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Customer/Admin | Get current customer's cart |
| `POST` | `/api/cart/items` | Customer/Admin | Add item to cart with stock validation |
| `PUT` | `/api/cart/items/{id}` | Customer/Admin | Update line quantity |
| `DELETE` | `/api/cart/items/{id}` | Customer/Admin | Remove single item from cart |
| `DELETE` | `/api/cart` | Customer/Admin | Clear customer's cart |

### Order & Payment
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payment/create` | Customer/Admin | Server-side cart validation & Razorpay order creation |
| `POST` | `/api/payment/verify` | Customer/Admin | Verify Razorpay HMAC signature, deduct stock & finalize |
| `GET` | `/api/orders` | Customer/Admin | List orders for current user |
| `GET` | `/api/orders/{id}` | Customer/Admin | View order details and fulfillment timeline |
| `GET` | `/api/payment/history` | Customer/Admin | View customer's payment transactions |

### Admin Operations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all users |
| `PUT` | `/api/admin/users/{id}` | Admin | Update user role and active status |
| `DELETE` | `/api/admin/users/{id}` | Admin | Delete user (protected against last admin) |
| `GET` | `/api/admin/orders` | Admin | View all orders across all customers |
| `PUT` | `/api/admin/orders/{id}/status` | Admin | Advance order fulfillment status |
| `GET` | `/api/admin/payments` | Admin | View full payment gateway transaction audit logs |
| `GET` | `/api/admin/reports` | Admin | Sales KPI summary (Revenue, Orders, Conversion) |

---

## Authentication Workflow

```text
React Login Form
       │
       │ POST /api/auth/login { username, password }
       ▼
AuthController ──▶ AuthService ──▶ UserRepository
       │
       ├─ 1. Verify user exists and status == ACTIVE
       ├─ 2. passwordEncoder.matches(rawPassword, hashedPassword)
       ├─ 3. jwtService.generateToken(username, role)
       ├─ 4. jwtTokenRepository.save(new JWTToken(...))
       ├─ 5. Set-Cookie: jwt_token=<token>; HttpOnly; Path=/; SameSite=Lax
       ▼
JSON Response: { message: "Login successful", role: "CUSTOMER"|"ADMIN", username: "..." }
       │
       ▼
React AuthContext:
       ├─ Role == 'CUSTOMER' ──▶ Navigate to /customerhome
       └─ Role == 'ADMIN'    ──▶ Navigate to /adminhome
```

---

## Payment Workflow (Razorpay)

```text
Customer Cart ──▶ Select Shipping (STANDARD/EXPRESS) ──▶ Click Checkout
       │
       │ POST /api/payment/create { shippingOption, shippingAddress }
       ▼
Backend PaymentService:
       ├─ Validates cart items & stock server-side
       ├─ Calculates Subtotal + Shipping Charge (authoritative calculation)
       ├─ Creates internal Order (PENDING) and Payment (PENDING)
       ├─ Calls Razorpay API (amount in paise = total * 100)
       ▼
Returns { orderId, razorpayOrderId, amount, currency, keyId }
       │
       ▼
Frontend: Opens Razorpay Checkout Modal (Cards / UPI / NetBanking)
       │
       │ Customer completes payment in Razorpay modal
       ▼
Razorpay Checkout returns: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
       │
       │ POST /api/payment/verify { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
       ▼
Backend PaymentService (@Transactional):
       ├─ Verifies HMAC-SHA256(orderId + "|" + paymentId, secret) == signature
       ├─ Payment.status = SUCCESS
       ├─ Order.status = APPROVED
       ├─ Product inventory stock is decremented
       ├─ Customer shopping cart is cleared
       ▼
Response: Payment verified ──▶ Customer redirected to /payment-success
```

---

## Environment Variables

Copy `.env.example` to `.env` or pass the following variables:

```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sales_savvy
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here

# JWT Security Configuration (256-bit Hex Key)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=3600000

# Razorpay Payment Gateway Credentials
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Shipping Rates (in INR)
SHIPPING_RATE_STANDARD=50.00
SHIPPING_RATE_EXPRESS=120.00
```

---

## Local Setup & Execution

### Prerequisites
- Java 21 LTS JDK installed
- Apache Maven 3.9+
- Node.js 20+ and npm 10+
- MySQL 8.0 running locally on port 3306

### 1. Database Setup
Create database `sales_savvy`:
```sql
CREATE DATABASE IF NOT EXISTS sales_savvy;
```

### 2. Backend Execution
From the root directory:
```bash
cd backend
mvn clean test
mvn spring-boot:run
```
The backend starts on `http://localhost:8080`.
Upon startup, the `DataInitializer` automatically seeds:
- Administrator: `admin` / `Admin@123`
- Customer: `aka` / `aka123@123`
- Categories: Electronics, Fashion & Apparel, Home & Kitchen, Books & Stationery, Health & Fitness
- Products with real high-resolution images, descriptions, and stock quantities

### 3. Frontend Execution
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server starts on `http://localhost:5173` with reverse proxying to `http://localhost:8080/api`.

---

## Docker & Containerized Deployment

Deploy the entire stack with a single command:

```bash
docker-compose up --build -d
```

- **Frontend**: `http://localhost:3000` (Nginx SPA reverse-proxying API calls)
- **Backend API**: `http://localhost:8080`
- **MySQL Database**: `localhost:3306`

To shut down:
```bash
docker-compose down
```

---

## Automated Testing

### Backend Unit & Integration Tests (10 tests)
```bash
cd backend
mvn test
```
Tests cover:
- Customer registration validation and duplicate username/email rejection
- BCrypt password hashing and credential verification
- Successful authentication & HttpOnly cookie configuration
- Cart item addition and stock limit enforcement
- Product creation and stock reduction/restoration
- Payment verification and cart-to-order transaction consistency

### Frontend Unit & Component Tests
```bash
cd frontend
npm test
```
Tests cover:
- Product card rendering with INR formatting and stock badges
- Out-of-stock badge display and disabled CTA validation

---

## Default Seed Credentials

| Role | Username | Password | Purpose | Redirects To |
|---|---|---|---|---|
| **ADMIN** | `admin` | `Admin@123` | Store administration & management | `/adminhome` |
| **CUSTOMER** | `aka` | `aka123@123` | Customer browsing, cart & checkout | `/customerhome` |

---

## Known Limitations

1. **Single Currency Focus**: Currently locked to Indian Rupee (INR ₹) in alignment with core SMB requirements.
2. **Payment Gateway**: Primary integration is configured with Razorpay. Simulated gateway test signatures are supported in development mode for offline and staging tests without live network credentials.
3. **Product Image Storage**: Product images are hosted via validated external HTTPS image URLs (e.g. Unsplash CDN, Cloud Storage). Direct binary multipart file upload to local disk or S3 can be enabled if required.
#   s a l e s _ s a v v y  
 