DROP DATABASE IF EXISTS icapital_dev;
CREATE DATABASE icapital_dev;

\c icapital_dev;

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL DEFAULT 'Unknown First Name',
    lastname VARCHAR(50) NOT NULL DEFAULt 'Unknown Last Name',
    email VARCHAR(100) NOT NULL,
    password_hashed VARCHAR(255) NOT NULL,
    profile_img TEXT DEFAULT 'Profile Image URL',
    about TEXT DEFAULT 'About Me',
    dob VARCHAR(20) DEFAULT '1/1/2024',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_otp VARCHAR(255),
    mfa_otp_expiration TIMESTAMP );