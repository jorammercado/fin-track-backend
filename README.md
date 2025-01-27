# Financial Insights and Tracking Application Backend Services

## Description

The FinTrack Backend Services power the FinTrack application by ensuring secure user authentication, seamless database management for accounts and financial transactions, and timely email notifications.

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Security**: bcryptjs, jsonwebtoken
- **Email Service**: nodemailer
- **Testing**: Jest

## Contents
- [Features Implemented](#features-implemented)
- [API Routes](#api-routes)
- [Middleware Functions](#middleware-functions)
- [Deployed Server](#deployed-server)
- [GitHub Repositories](#github-repositories)
- [Installation](#installation)
- [Next Steps](#next-steps)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

## Features Implemented

### User Authentication and Security
- **Sign Up/Login System**: Secure sign-up and login using hashed passwords, data validation and JWT tokens.
- **Password Security**: Strong password requirements enforced, and extra security measures for password update.
- **Multi-Factor Authentication (MFA)**: MFA is implemented during login through a one-time passcode (with a time limit) sent via email, adding an extra layer of security.

### Financial Transactions Management
- **Financial Transactions Table**: Stores information about user transactions, including deposits, income, expenses, and investments. This table allows users to track their financial activities in detail.
- **Data Integration**: Transactions are integrated into the application, enabling the frontend to present income, expenses, and investments, and provide insights through visualizations.

### Email Notifications
- **Account Updates**: Notifies users of important account updates, such as password changes or new logins from unfamiliar devices.

---

## API Routes
### Accounts
| Method | Endpoint                         | Description                                |
|--------|----------------------------------|--------------------------------------------|
| POST   | `/accounts/login-initiate`       | Start the login process by sending an OTP. |
| POST   | `/accounts/verify-otp`           | Complete login by verifying OTP.           |
| POST   | `/accounts`                      | Sign up a new user.                        |
| DELETE | `/accounts/:account_id`          | Delete an account by ID.                   |
| PUT    | `/accounts/:account_id`          | Update account details.                    |
| PUT    | `/accounts/:account_id/password` | Update user password.                      |
| POST   | `/accounts/guest-login`          | Login as a guest.                          |

### Transactions
| Method | Endpoint                                             | Description                                |
|--------|------------------------------------------------------|--------------------------------------------|
| POST   | `/accounts/:account_id/transactions/create`          | Create a transaction for an account.    |
| POST   | `/accounts/:account_id/transactions/:transaction_id` | Get one transaction by ID.                 |
| POST   | `/accounts/:account_id/transactions`                 | Get all transactions for an account.       |
| DELETE | `/accounts/:account_id/transactions/:transaction_id` | Delete a transaction.                      |
| PUT    | `/accounts/:account_id/transactions/:transaction_id` | Update a transaction.                      |

---

## Middleware Functions
### Account Validations
| Function                          | Description                                                                                          |
|-----------------------------------|------------------------------------------------------------------------------------------------------|
| `checkUsernameProvided`           | Ensures username is provided in the request body.                                                    |
| `checkUsernameExists`             | When signing up, checks if user name is taken.                                                       |
| `checkUsernameExistsOtherThanSelf`| When updating account, checks if user name is taken - unless its yours.                              |
| `checkEmailProvided`              | Ensures email is provided in the request body.                                                       |
| `checkEmailExists`                | When signing up, checks if email address is taken.                                                   |
| `checkEmailExistsOtherThanSelf`   | When updating account, checks if email is taken - unless its yours.                                  |
| `checkPasswordProvided`           | Ensures password is provided in the request body.                                                    |
| `checkNewPasswordProvided`        | When updating password, ensures new password is provided in the request body.                        |
| `checkValidUsername`              | Checks if username is in the database.                                                               |
| `checkAccountIndex`               | Checks if account ID is in the database.                                                             |
| `checkEmailFormat`                | Email format should be in example@domain.com format.                                                 |
| `checkFirstnameFormat`            | Must contain only letters, apostrophes, or hyphens and be between 2 and 50 chars.                    |
| `checkLastnameFormat`             | Must contain only letters, apostrophes, or hyphens and be between 2 and 50 chars.                    |
| `checkUsernameValidity`           | Multiple checks to username in addition to containing only letters, numbers, hyphens, or underscores.|
| `checkDobFormat`                  | Must be in the format ##/##/#### or #/#/#### format, be within last 100 years and not in future.     |
| `checkPasswordStrength`           | Ensures password meets multiple strength criteria.                                                   |

### Misc Utility
| Function                        | Description                                                   |
|---------------------------------|---------------------------------------------------------------|
| `verifyToken`                   | Verifies valid JWT token.                                     |
| `setDefaultAccountValues`       | For non essential fields, sets default values if non provided.|

### Transaction Validations
| Function                        | Description                                                          |
|---------------------------------|----------------------------------------------------------------------|
| `checkAmountProvided`           | Ensures transaction amount is provided and is a number.              |
| `checkTransactionTypeProvided`  | Validates the transaction type and ensures its presence.              |
| `checkCategoryProvided`         | Validates the transaction category and ensures its presence.          |
| `checkRecurringDetails`         | Validates the transaction recurring details.                         |
| `checkRiskLevelProvided`        | Validates the transaction risk level, sets default if none provided. |
| `checkTransactionID`            | Ensures a transaction id is part of a transaction in the database.   |
| `checkAccountID`                | Ensures an account id is part of an account in the database.         |
| `validateTransactionOwnership`  | Verifies a given transaction belongs to a given account.             |

---

## Deployed Server
- **Backend Server hosted on Render**: [https://fintrack-backend-services.onrender.com/](https://icapital-budgeter-backend-services.onrender.com/)

## GitHub Repositories
- **Frontend**: [https://github.com/JoramAMercado/fin-track-frontend](https://github.com/JoramAMercado/fin-track-frontend)
- **Backend**: [https://github.com/JoramAMercado/fin-track-backend](https://github.com/jorammercado/fin-track-backend)

## Installation

1. Fork the repository from [https://github.com/JoramAMercado/fin-track-backend](https://github.com/JoramAMercado/fin-track-backend).

2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fin-track-backend.git
   ```

3. Navigate to the project directory:
   ```bash
   cd fin-track-backend
   ```

4. Create a `.env` file in the root of the project directory with the following content:
   ```
   PORT=4001
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=icapital_dev
   PG_USER=postgres
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
   
   > - To generate the `JWT_SECRET`, run the following command from the terminal:
   >   ```sh
   >   node generateJWTSecret.js
   >   ```
   > - It will write a strong JWT secret to the .env file. Check that the generated JWT_SECRET has been successfully added to the .env file, if not, manually add a strong secret string.
   > - For `EMAIL_USER` and `EMAIL_PASS`, enter your Google email and password for an account. You may need to enable 'Less secure app access' in your Google account security settings to allow access from third-party applications.

5. Install dependencies:
   ```bash
   npm install
   ```

6. Ensure PostgreSQL is running locally.

7. Run the SQL scripts to set up the database schema and seed data:
   ```bash
   npm run db_schema
   npm run db_seed
   ```

8. To start the backend server:
   ```bash
   node server.js
   ```
   or for automatic server restart when a file is updated:
   ```bash
   nodemon server.js
   ```

This will run the backend services locally on the specified port.

## Next Steps
Now that the backend services are running, you can proceed to connect the frontend application to the backend server locally on your machine.

## Testing 
Several unit tests were implemented using Jest, when making changes and ensuring continued functionality, such test can be run using:
```bash
npm test
```

## License
This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for details.

## Contact
For any inquiries or feedback, please contact:

- Joram Mercado: [GitHub](https://github.com/JoramAMercado), [LinkedIn](https://www.linkedin.com/in/joramamercado)
