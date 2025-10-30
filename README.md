# 📈 FinTrack Backend

FinTrack Backend provides the core services for the FinTrack application — managing user authentication, handling account and transaction data, and supporting email notifications for key account events.

## 🧰 Tech Stack

* **Backend**: Node.js, Express
* **Database**: PostgreSQL
* **Security**: bcryptjs, JWT (jsonwebtoken)
* **Email**: nodemailer
* **Testing**: Jest

## 📚 Table of Contents

* [Features](#features)
* [API Routes](#api-routes)
* [Middleware](#middleware)
* [Deployed Server](#deployed-server)
* [GitHub Repos](#github-repos)
* [Installation](#installation)
* [Next Steps](#next-steps)
* [Testing](#testing)
* [License](#license)
* [Contact](#contact)

## ✅ Features

### 🔐 Authentication & Security

* **Signup & Login** with hashed passwords and JWT tokens
* **Password Updates** with strong validation rules
* **MFA via Email OTP** to secure login with expiring verification codes

### 💸 Financial Transaction Management

* Supports **income**, **expenses**, **investments**, and **recurring payments**
* Transaction records are structured for **frontend charting and insights**

### 📧 Email Notifications

* Alerts for **account changes** and **logins from new devices**

## 📡 API Routes

### 👤 Accounts

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| POST   | `/accounts/login-initiate`       | Start login by sending OTP |
| POST   | `/accounts/verify-otp`           | Complete login with OTP    |
| POST   | `/accounts`                      | Register new user          |
| DELETE | `/accounts/:account_id`          | Delete user account        |
| PUT    | `/accounts/:account_id`          | Update account info        |
| PUT    | `/accounts/:account_id/password` | Change password            |
| POST   | `/accounts/guest-login`          | Access guest account       |

### 💼 Transactions

| Method | Endpoint                                     | Description               |
| ------ | -------------------------------------------- | ------------------------- |
| POST   | `/accounts/:id/transactions/create`          | Create a transaction      |
| POST   | `/accounts/:id/transactions/:transaction_id` | Retrieve one transaction  |
| POST   | `/accounts/:id/transactions`                 | Retrieve all transactions |
| DELETE | `/accounts/:id/transactions/:transaction_id` | Delete a transaction      |
| PUT    | `/accounts/:id/transactions/:transaction_id` | Update a transaction      |

## 🔗 Middleware 

### 🔍 Validation: Accounts

* Format checks for email, names, DOB
* Duplicate prevention (excluding self-updates)

### 🔐 Auth & Utilities

* Verify Token
* Set default account values

### 💳 Validation: Transactions

* Validates amount, type, category, risk level, ownership

## 🌐 Deployed Server

* [Render App – Backend](https://fintrack-backend-services.onrender.com/)

## 🗂 GitHub Repositories

* **Frontend**: [github.com/jorammercado/fin-track-frontend](https://github.com/jorammercado/fin-track-frontend)
* **Backend**: [github.com/jorammercado/fin-track-backend](https://github.com/jorammercado/fin-track-backend)

## ⚙️ Installation

```bash
# Clone project
git clone https://github.com/your-username/fin-track-backend.git
cd fin-track-backend

# Create environment variables - sample .env entires
PORT=4001
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=fintrack_dev
PG_USER=postgres
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Install dependencies
npm install

# Database setup
npm run db_schema
npm run db_seed

# Start server
node server.js
# or use
nodemon server.js
```

## 🧪 Testing

* Basic unit tests are included to verify routing and server response behavior.

```bash
npm test
```

## 📄 License

[MIT License](https://opensource.org/license/mit)

## 👤 Contact

**Joram Mercado**
[GitHub](https://github.com/jorammercado) | [LinkedIn](https://www.linkedin.com/in/jorammercado)
