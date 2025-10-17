# E-commerce API with Payment Processing

A robust NestJS-based e-commerce API featuring product management, transaction processing, and secure credit card tokenization with comprehensive validation and testing.

## 🚀 Features

- **Product Management**: Full CRUD operations for inventory control
- **Transaction Processing**: Complete purchase flow with payment gateway integration
- **Secure Card Tokenization**: PCI-compliant card handling (Visa/Mastercard)
- **Validation & Sanitization**: Comprehensive input validation using class-validator
- **Swagger Documentation**: Interactive API documentation
- **Modular Configuration**: Environment-based configuration management
- **High Test Coverage**: >80% code coverage with unit and integration tests
- **PostgreSQL Database**: Reliable data persistence with Sequelize ORM

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Transaction States](#transaction-states)
- [Validation & Sanitization](#validation--sanitization)
- [Project Structure](#project-structure)

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Payment gateway account (for production)

## 📥 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up the database**
```bash
# Create PostgreSQL database
createdb postgres

# Run migrations (if applicable)
npm run migration:run
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=postgres

# Payment Gateway Configuration
PUBLIC_KEY=pub_test_your_public_key
INTEGRITY_SECRET=your_integrity_secret
ENVIRONMENT_URL=https://sandbox.payment-gateway.com

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Environment Variables Description

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_USERNAME` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_NAME` | Database name | Yes |
| `PUBLIC_KEY` | Payment gateway public key | Yes |
| `INTEGRITY_SECRET` | Payment gateway integrity secret | Yes |
| `ENVIRONMENT_URL` | Payment gateway API URL | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Application port | No |

## 🏃 Running the Application

### Development Mode
```bash
yarn start:dev
```

### Production Mode
```bash
yarn build
yarn start:prod
```

### Watch Mode
```bash
yarn start:watch
```

The application will be available at:
- **API**: `http://18.116.39.97:3000:3000`
- **Swagger Documentation**: `http://18.116.39.97:3000/api/docs`

## 🧪 Testing

### Run All Tests
```bash
yarn test
```

### Run Tests in Watch Mode
```bash
yarn test:watch
```

### Run Tests with Coverage
```bash
yarn test:cov
```

### Run E2E Tests
```bash
yarn test:e2e
```

### Test Coverage Requirements

The project maintains **>80% code coverage** across:
- **Unit Tests**: Services, controllers, validators
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete user workflows

#### Coverage Report
```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   84    |    74.57 |   74.66 |   84.02 |
 products/          |   96    |    75    |   80    |   97.56 |
 transactions/      |   89.18 |    79.31 |   84    |   90.37 |
--------------------|---------|----------|---------|---------|
```

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at `http://18.116.39.97:3000/api/docs`

Features:
- **Interactive Testing**: Try endpoints directly from the browser
- **Request/Response Examples**: See real data samples
- **Schema Validation**: View input/output structures
- **Authentication**: Test secured endpoints

### Export Documentation

- **JSON**: `http://18.116.39.97:3000/api/docs-json`
- **YAML**: `http://18.116.39.97:3000/api/docs-yaml`

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | List all products | No |
| `POST` | `/products` | Create new product | No |
| `PUT` | `/products/:id` | Update product | No |

### Transactions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/transactions` | List all transactions | No |
| `GET` | `/transactions/:id` | Get transaction by ID | No |
| `POST` | `/transactions` | Create new transaction | No |
| `PUT` | `/transactions/:id` | Validate and finalize transaction | No |

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/transactions/aceptance` | Get acceptance token | No |
| `POST` | `/transactions/tokenize` | Tokenize credit card | No |

## 🔄 Transaction States

Transactions follow a specific lifecycle with the following states:

### State Flow Diagram

```
INITIALIZED → PENDING → APPROVED → ASSIGNED → FINISHED
                ↓
            DECLINED / VOIDED / ERROR
```

### State Descriptions

| State | Description | Trigger |
|-------|-------------|---------|
| **INITIALIZED** | Transaction created in local database but not yet sent to payment gateway | Transaction record created |
| **PENDING** | Transaction submitted to payment gateway, awaiting processing | Payment request sent |
| **APPROVED** | Payment successfully approved by payment gateway | Payment gateway approval |
| **DECLINED** | Payment rejected by payment gateway or card issuer | Payment gateway rejection |
| **VOIDED** | Transaction cancelled or voided | Manual cancellation |
| **ERROR** | Technical error occurred during payment processing | System error |
| **ASSIGNED** | Order ready for fulfillment/delivery | Stock validated and reserved |
| **FINISHED** | Product delivered and transaction completed | Delivery confirmation |

### State Transition Rules

- **INITIALIZED → PENDING**: Automatically when payment is submitted to gateway
- **PENDING → APPROVED/DECLINED/ERROR**: Based on payment gateway response
- **APPROVED → ASSIGNED**: After stock validation via `PUT /transactions/:id`
- **ASSIGNED → FINISHED**: Manual update after delivery confirmation
- **Any state → VOIDED**: Manual cancellation (if applicable)

## ✅ Validation & Sanitization

The API implements comprehensive validation and sanitization using `class-validator` and `class-transformer`.

### Input Validation

#### Product Validation
```typescript
{
  "name": "Laptop Gaming",           // Required, max 255 chars, trimmed
  "uri": "https://example.com",      // Required, valid URL, lowercase
  "description": "High performance", // Required, max 1000 chars, trimmed
  "quantity": 10,                    // Required, integer, min 0
  "value": 450000000                 // Required, integer, min 0 (cents)
}
```

#### Credit Card Validation
```typescript
{
  "number": "4111111111111111",    // Required, Visa/Mastercard only, Luhn algorithm
  "cvc": "123",                     // Required, 3-4 digits
  "exp_month": "12",                // Required, 01-12, auto-padded
  "exp_year": "25",                 // Required, exactly 2 digits, not expired
  "card_holder": "JOHN DOE"         // Required, letters only, uppercase
}
```

#### Transaction Validation
```typescript
{
  "customer": "client@example.com",    // Required, valid email
  "products": [                         // Required, min 1 product
    {
      "productId": 1,                   // Required, integer, min 1
      "quantity": 2                     // Required, integer, min 1
    }
  ],
  "cardToken": "tok_test_123...",      // Required, non-empty string
  "acceptance_token": "eyJhbGc...",    // Required, non-empty string
  "installments": 1                     // Required, integer, min 1
}
```

### Sanitization Features

- **Whitespace Trimming**: All string inputs are trimmed
- **Case Normalization**: Card holder names converted to uppercase
- **Special Characters**: Card numbers stripped of spaces/dashes
- **URL Normalization**: URLs converted to lowercase
- **Padding**: Month values padded to 2 digits (e.g., "6" → "06")

### Validation Rules

| Rule | Applied To | Description |
|------|-----------|-------------|
| `@IsNotEmpty()` | All required fields | Prevents empty strings |
| `@IsEmail()` | Email fields | Valid email format |
| `@IsInt()` | Numeric fields | Must be integer |
| `@Min(n)` | Numbers | Minimum value constraint |
| `@Max(n)` | Numbers | Maximum value constraint |
| `@MaxLength(n)` | Strings | Maximum character limit |
| `@IsUrl()` | URLs | Valid URL format |
| `@Matches()` | Patterns | Regex validation |
| Custom validators | Cards | Luhn algorithm, card type, expiry |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": [
    "El número de tarjeta es requerido",
    "CVV inválido (debe tener 3 o 4 dígitos)",
    "La tarjeta está vencida"
  ],
  "error": "Bad Request"
}
```

## 📁 Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts    # Product creation DTO
│   │   └── update-product.dto.ts    # Product update DTO
│   ├── product.model.ts             # Product entity
│   ├── product.controller.ts       # Product endpoints
│   ├── product.service.ts          # Product business logic
│   ├── product.module.ts           # Product module
│   └── product.*.spec.ts           # Product tests
├── transactions/
│   ├── dto/
│   │   ├── create-transaction.dto.ts      # Transaction creation DTO
│   │   ├── card-tokenization.dto.ts       # Card tokenization DTO
│   │   └── transaction-product.dto.ts     # Transaction products DTO
│   ├── validators/
│   │   └── card.validator.ts              # Custom card validators
│   ├── transaction.model.ts               # Transaction entity
│   ├── transaction-product.model.ts       # Junction table model
│   ├── transaction.controller.ts         # Transaction endpoints
│   ├── transaction.service.ts            # Transaction business logic
│   ├── payment.service.ts                 # Payment gateway integration
│   ├── transaction.module.ts             # Transaction module
│   └── *.spec.ts                          # Transaction tests
└── common/
    ├── filters/                     # Exception filters
    ├── interceptors/                # Request/response interceptors
    └── pipes/                       # Custom validation pipes
```

## 🔐 Security Considerations

- **PCI Compliance**: Card data is tokenized, never stored
- **Environment Variables**: Sensitive data in `.env` (not committed)
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection**: Protected by Sequelize ORM
- **XSS Prevention**: Input sanitization and output encoding

## 🛠️ Built With

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Sequelize](https://sequelize.org/)** - ORM for PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Swagger](https://swagger.io/)** - API documentation
- **[class-validator](https://github.com/typestack/class-validator)** - Validation library
- **[card-validator](https://github.com/braintree/card-validator)** - Card validation (Luhn algorithm)
- **[Axios](https://axios-http.com/)** - HTTP client for payment gateway

## 📝 Purchase Flow Example

### 1. Get Acceptance Token
```bash
curl -X GET http://18.116.39.97:3000/transactions/aceptance
```

### 2. Tokenize Card
```bash
curl -X POST http://18.116.39.97:3000/transactions/tokenize \
  -H "Content-Type: application/json" \
  -d '{
    "number": "4111111111111111",
    "cvc": "123",
    "exp_month": "12",
    "exp_year": "25",
    "card_holder": "JOHN DOE"
  }'
```

### 3. Create Transaction
```bash
curl -X POST http://18.116.39.97:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "client@example.com",
    "products": [{"productId": 1, "quantity": 2}],
    "cardToken": "tok_test_...",
    "acceptance_token": "eyJhbGc...",
    "installments": 1
  }'
```

### 4. Validate and Finalize
```bash
curl -X PUT http://18.116.39.97:3000/transactions/{transaction-id}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Davshn

## 🙏 Acknowledgments

- Payment gateway provider for secure transaction processing
- NestJS community for excellent documentation
- Contributors and testers

## 📞 Support

For support, email davshn@gmail.com or open an issue in the repository.

---

Made with ❤️ using NestJS