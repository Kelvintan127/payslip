# Payslip Management System

A backend service for managing employee payslips, payrolls, reimbursements, and overtime, built with Node.js, Express, and Prisma ORM.

## 🔧 Tech Stack

* **Node.js**
* **Express**
* **Prisma (PostgreSQL/MySQL)**
* **Jest** (Unit Testing)
* **ES Modules (ESM)**

---

## 📦 Features

* Attendance period management
* Payroll calculation and execution
* Payslip generation
* Reimbursement submission
* Overtime submission with time restriction logic
* Audit logging
* Fully tested with Jest (100% test coverage)

---

## 📁 Project Structure

```bash
src/
│
├── controllers/        # Route handlers
├── services/           # Business logic
├── repositories/       # DB access with Prisma
├── utils/              # Helpers (e.g., transaction runner)
└── prisma/             # Prisma schema and client
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kelvintan127/payslip.git
cd payslip
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Run cp .env.example .env and fill in the environment variables.

### 4. Run database migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the server

```bash
npm start
```

Server will run at `http://localhost:3000`.

---

## 📘 API Documentation

### ➔ Authentication

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| POST   | `/login`  | User login  |
| POST   | `/logout` | User logout |

### ➔ Attendance Period

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | `/attendance-periods` | Create attendance period |
| GET    | `/attendance-periods` | List attendance periods  |

### ➔ Payroll

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/payroll/run` | Run payroll process |

### ➔ Payslip

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/payslips/:employeeId` | Get payslips by employee  |
| POST   | `/payslips`             | Manually create a payslip |

### ➔ Reimbursement

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | `/reimbursements` | Submit reimbursement |

### ➔ Overtime

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| POST   | `/overtime` | Submit overtime (After 5 PM only) |

---

## 📌 Business Rules

* Overtime can only be submitted:

  * After 5 PM of the same day.
  * Up to a maximum of 3 hours.
  * Not for future dates.

* Reimbursements are fetched per employee per payroll period.

* A payslip will not be regenerated if already exists for that payroll.

---

## 💡 Running Tests

```bash
npm test
```

Test coverage summary:

```text
Statements   : 100%
Branches     : ~99%
Functions    : 100%
Lines        : 100%
```

---

## 🏗️ Software Architecture

* **MVC Structure**: Follows separation of concerns:

  * **Controllers** handle HTTP logic.
  * **Services** contain business rules.
  * **Repositories** communicate with the database.
* **Transaction Management**: Handled by `runTransaction` utility, wrapping operations in a safe DB transaction.
* **Audit Logging**: Captures all write operations (e.g., payroll run, payslip create).

---

## 📄 License

MIT License

---

## 📬 Contact

Built by [Kelvintan127](https://github.com/Kelvintan127)
Contributions & Issues welcome!
