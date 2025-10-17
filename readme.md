# 🚀 Backend Overview

This backend is deployed on **AWS EC2**, managed with **PM2** for continuous operation, and connected to a **PostgreSQL** database hosted on **AWS RDS**.

---

## 🌐 Production

- **Base URL:** [http://18.116.39.97:3000/](http://18.116.39.97:3000/)
- **Swagger Documentation:** [http://18.116.39.97:3000/api/docs#/](http://18.116.39.97:3000/api/docs#/)
- **Test Coverage:** Greater than **80%**

---

## ⚙️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (AWS RDS)
- **Process Manager:** [PM2](https://pm2.keymetrics.io/)
- **Hosting:** AWS EC2 (Ubuntu)
- **Documentation:** Swagger UI (OpenAPI 3)

---

## 🧠 Project Structure

A more detailed documentation about the backend modules, entities, and services is available inside:
📁 **`/backend/README.md`**

---

## 🔒 Security Measures

- **PCI Compliance:** Card data is tokenized, never stored
- **Environment Variables:** Sensitive data stored in `.env` (not committed)
- **Input Validation:** All inputs are validated and sanitized
- **SQL Injection Protection:** Managed through Sequelize ORM
- **XSS Prevention:** Input sanitization and output encoding

---

## 🧰 Local Setup

Follow these steps to run the backend locally:

1. **Create the PostgreSQL database** locally or remotely.
2. **Clone the development branch:**
   git clone -b dev <repo-url>
   cd backend
3. **Install dependencies:**
    yarn install
4. **Create a .env file in the /backend directory with the necessary environment variables (DB credentials, JWT secrets, API keys, etc.).**
5. **Run the development server:**
    yarn start:dev
6. **Run tests:**
    yarn test
7. **Check test coverage:**
    Coverage reports are automatically generated inside the /coverage folder after running tests.