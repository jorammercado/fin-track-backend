# <img src="./icapital-logo-full-name.svg" alt="iCapital Logo"> - Budgeter Backend Services

## Description

The iCapital Budgeter Backend Services provides the server-side logic and secure data management functionalities for the iCapital Budgeter application. It focuses on implementing secure user authentication, email verification, and notification services. This ensures users have a safe experience managing their financial information. As the project expands, additional services will be added.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Security**: bcryptjs, jsonwebtoken
- **Email Service**: nodemailer

## Features Implemented

### User Authentication and Security
- **Sign Up/Login System**: Secure sign-up and login using hashed passwords.
- **Password Security**: Strong password requirements enforced, with hashing for password storage using `bcryptjs`.
- **Email Verification**: An email verification link is sent upon account creation to confirm the user’s email address.
- **Multi-Factor Authentication (MFA)**: MFA is implemented during login through a one-time passcode sent via email, adding an extra layer of security.

### Email Notifications
- **Account Updates**: Notifies users of important account updates, such as password changes or new logins from unfamiliar devices.
- **Investment Alerts**: Periodic emails providing updates on investment recommendations and/or portfolio summaries based on changing market conditions.

## Deployed Server
- **Backend Server hosted on Render**: [https://icapital-budgeter-backend-services.onrender.com/](https://icapital-budgeter-backend-services.onrender.com/)

## GitHub Repositories
- **Frontend**: [https://github.com/jorammercado/icapital-budgeter-frontend](https://github.com/jorammercado/icapital-budgeter-frontend)
- **Backend**: [https://github.com/jorammercado/icapital-budgeter-backend](https://github.com/jorammercado/icapital-budgeter-backend)

## Installation

1. Fork the repository from [https://github.com/jorammercado/icapital-budgeter-backend](https://github.com/jorammercado/icapital-budgeter-backend).

2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/icapital-budgeter-backend.git
   ```

3. Navigate to the project directory:
   ```bash
   cd icapital-budgeter-backend
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

## License
This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for details.

## Contact
For any inquiries or feedback, please contact:

- Joram Mercado: [GitHub](https://github.com/jorammercado), [LinkedIn](https://www.linkedin.com/in/jorammercado)
