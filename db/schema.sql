DROP DATABASE IF EXISTS icapital_dev;
CREATE DATABASE icapital_dev;

\c icapital_dev;

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL DEFAULT 'Unknown First Name',
    lastname VARCHAR(50) NOT NULL DEFAULT 'Unknown Last Name',
    email VARCHAR(100) NOT NULL,
    password_hashed VARCHAR(255) NOT NULL,
    profile_img TEXT DEFAULT 'Profile Image URL',
    about TEXT DEFAULT 'About Me',
    dob VARCHAR(20) DEFAULT '00/0/0000',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_otp VARCHAR(255),
    mfa_otp_expiration TIMESTAMP,
    checking_account DECIMAL(15, 2) DEFAULT 0.00,  
    savings_account DECIMAL(15, 2) DEFAULT 0.00,  
    investments DECIMAL(15, 2) DEFAULT 0.00);

    CREATE TABLE login_history_icap_bdgt (
    history_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id) ON DELETE SET NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    device_fingerprint TEXT);

CREATE TABLE financial_transactions (
    transaction_id SERIAL PRIMARY KEY,
    -- for development reasons use ON DELETE SET NULL instead of ON DELETE CASCADE
    account_id INTEGER REFERENCES accounts(account_id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('income', 'expense', 'investment', 'deposit')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) CHECK (category IN (
    'salary', 
    'bonus', 
    'interest', 
    'dividend', 
    'rental income', 
    'business income', 
    'investment', 
    'groceries', 
    'utilities', 
    'rent/mortgage', 
    'transportation', 
    'education', 
    'healthcare', 
    'entertainment', 
    'subscriptions', 
    'travel', 
    'savings', 
    'emergency fund', 
    'retirement',
    'clothing', 
    'dining', 
    'household supplies', 
    'charity', 
    'debt repayment',
    'other',
    'wages',
    'account funding',
    'loan disbursement',
    'checking' 
    )),
    description TEXT DEFAULT '',
    recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20) CHECK (recurring_frequency IN ('one-time', 'daily', 'weekly', 'monthly', 'yearly')) NOT NULL DEFAULT 'one-time',
    risk_level VARCHAR(10) CHECK (risk_level IN ('n/a', 'low', 'moderate', 'high')) NOT NULL DEFAULT 'n/a',
    is_planned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);