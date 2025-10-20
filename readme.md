# 🧩 Full Stack Overview

This project consists of a **NestJS backend** and a **React Native CLI frontend**, both built in **TypeScript** and designed to provide a complete and modular e-commerce experience.
It includes product browsing, cart management, and credit card payment integration with validation and transaction tracking.

---

## 🚀 Backend Overview

The backend is deployed on **AWS EC2**, managed with **PM2** for continuous operation, and connected to a **PostgreSQL** database hosted on **AWS RDS**.

### 🌐 Production
- **Base URL:** [http://18.116.39.97:3000/](http://18.116.39.97:3000/)
- **Swagger Documentation:** [http://18.116.39.97:3000/api/docs#/](http://18.116.39.97:3000/api/docs#/)
- **Test Coverage:** > **80%**

### ⚙️ Tech Stack
- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (AWS RDS)
- **Hosting:** AWS EC2 (Ubuntu)
- **Process Manager:** [PM2](https://pm2.keymetrics.io/)
- **Documentation:** Swagger UI (OpenAPI 3)

### 🔒 Security Measures
- **PCI Compliance:** Card data is tokenized, never stored.
- **Environment Variables:** All sensitive credentials in `.env`.
- **Input Validation:** Managed with `class-validator` + `class-transformer`.
- **SQL Injection Protection:** Handled through Sequelize ORM.
- **XSS Prevention:** Input sanitization and output encoding.

### 🧰 Local Setup
1. **Clone and install dependencies:**
   ```bash
   git clone -b dev <repo-url>
   cd backend
   yarn install
   ```
2. **Configure environment variables:**
   Create a `.env` file with your database credentials, secrets, and API keys.
3. **Run in development:**
   ```bash
   yarn start:dev
   ```
4. **Run tests:**
   ```bash
   yarn test
   ```

> 📄 A detailed breakdown of backend modules, entities, and services is available in `/backend/README.md`.

---

## 📱 Frontend Overview

The frontend was developed with **React Native CLI**, using **Redux Toolkit** for state management and **Jest** for testing.
It allows users to browse products, manage their cart, add valid credit cards, and complete payments through a secure checkout flow integrated with the backend API.

### 🧠 Key Features
- **Product Listing:** Fetch products, search, and open detail modals.
- **Cart Management:** Add/remove items, change quantities, and calculate totals.
- **Credit Card Validation:** Uses `card-validator` + custom utility to verify Visa/Mastercard.
- **Checkout Flow:** Includes installment selection and payment confirmation screens.
- **Dark Mode:** Automatically follows the device’s theme.
- **Test Coverage:** > **80%** with Jest & React Native Testing Library.
- **Atomic Design:** Components organized as Atoms, Molecules, and Organisms for scalability.

> 🔎 A more detailed **frontend README** is available inside `/mobileApp/README.md`.

---

## 🧰 Development Tools & AI Assistance

Throughout development, several **AI-powered tools** were used to improve productivity and quality:

- 🤖 **Claude (Anthropic):** Assisted in generating unit tests and validation logic.
- 💬 **ChatGPT (OpenAI):** Used for creating technical documentation and PR templates.
- ⚡ **GitHub Copilot:** Provided intelligent code completions and boilerplate generation.

These tools helped accelerate repetitive tasks, maintain clean structure, and ensure consistent test coverage.

---

## 🧩 Architecture Summary

| Layer | Tech | Description |
|-------|------|-------------|
| **Frontend** | React Native CLI, Redux Toolkit | Mobile app for browsing, cart, and checkout |
| **Backend** | NestJS + Sequelize | API for products, payments, and transactions |
| **Database** | PostgreSQL (AWS RDS) | Persistent data storage |
| **Hosting** | AWS EC2 + PM2 | Continuous operation and deployment |
| **Testing** | Jest | Automated tests with 80%+ coverage |
| **Docs** | Swagger / Markdown | API and project documentation |

---

## 📄 Licensing & Notes

- Code and documentation are distributed under the **MIT License** (or project-specific license).
- Both frontend and backend are fully modular and can be extended for production-scale environments.
- The system architecture ensures separation of concerns and scalability across layers.
