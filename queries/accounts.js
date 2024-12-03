const db = require("../db/dbConfig.js")

const getOneAccount = async (id) => {
    try {
        const account = await db.one(`SELECT * FROM accounts WHERE account_id=$1`, id)
        return account
    } catch (err) {
        return { err: `${err}, sql query error - get one account` }
    }
}

const getAllAccounts = async () => {
    try {
        const allAccounts = await db.any(`SELECT * FROM accounts`)
        return allAccounts
    }
    catch (err) {
        return { err: `${err}, sql query error - get all accounts` }
    }
}

const getOneAccountByEmail = async (email) => {
    try {
        const account = await db.oneOrNone("SELECT * FROM accounts WHERE email=$1",
            email)
        return account
    }
    catch (err) {
        return { err: `${err}, sql query error - get one account by email` }
    }
}

const getOneAccountByUserName = async (username) => {
    try {
        const account = await db.oneOrNone("SELECT * FROM accounts WHERE username=$1",
            username)
        return account
    }
    catch (err) {
        return { err: `${err}, sql query error - get one account by username` }
    }
}

const createAccount = async (account) => {
    try {
        const createdAccount = await db.one(`INSERT INTO accounts (firstname,` +
            ` lastname,` +
            ` email,` +
            ` password_hashed,` +
            ` username,` +
            ` profile_img,` +
            ` about,` +
            ` dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [account?.firstname,
            account?.lastname,
            account?.email,
            account?.password,
            account?.username,
            account?.profile_img,
            account?.about,
            account?.dob])
        return createdAccount
    }
    catch (err) {
        return { err: `${err}, sql query error - create user` }
    }
}

const deleteAccountByUsername = async (username) => {
    try {
        const deletedAccount = await db.one(
            `DELETE FROM accounts WHERE username=$1 RETURNING *`,
            username
        )
        return deletedAccount
    }
    catch (err) {
        return { err: `${err}, sql query error in deleting an account` }
    }
}

const deleteAccountByAccountID = async (account_id) => {
    try {
        const deletedAccount = await db.one(
            `DELETE FROM accounts WHERE account_id=$1 RETURNING *`,
            account_id
        )
        return deletedAccount
    }
    catch (err) {
        return { err: `${err}, sql query error in deleting an account` }
    }
}

const updateAccount = async (account_id, account) => {
    try {
        const {
            firstname,
            lastname,
            profile_img,
            about,
            dob,
            username,
            email,
            checking_account,
            savings_account,
            investments
        } = account
        const updatedAccount = await db.one(
            `UPDATE accounts SET 
                firstname = COALESCE($1, firstname),
                lastname = COALESCE($2, lastname), 
                profile_img = COALESCE($3, profile_img),
                about = COALESCE($4, about), 
                dob = COALESCE($5, dob),
                username = COALESCE($6, username),
                email = COALESCE($7, email),
                checking_account = COALESCE($8, checking_account),
                savings_account = COALESCE($9, savings_account),
                investments = COALESCE($10, investments)
            WHERE account_id=$11 
            RETURNING *`,
            [
                firstname,
                lastname,
                profile_img,
                about,
                dob,
                username,
                email,
                Number(checking_account),
                Number(savings_account),
                Number(investments),
                account_id
            ]
        )
        return updatedAccount
    }
    catch (err) {
        return { err: `${err}, sql query error in updating an account` }
    }
}

const updateAccountPassword = async (account_id, password) => {
    try {
        const updatedAccount = await db.one(
            `UPDATE accounts SET password_hashed=$1 WHERE account_id=$2 RETURNING *`,
            [password, account_id]
        )
        return updatedAccount
    }
    catch (err) {
        return { err: `${err}, SQL query error in updating an account password` }
    }
}

const updateAccountMFAOneTimePassword = async (account_id, hashedOneTimePassword, expirationTime) => {
    try {
        await db.none(
            `UPDATE accounts SET mfa_otp=$1, mfa_otp_expiration=$2 WHERE account_id=$3`,
            [hashedOneTimePassword, expirationTime, account_id]
        )
    } catch (err) {
        console.error("Error updating an account's MFA - One Time Password: ", err)
        throw err
    }
}

module.exports = {
    getOneAccount,
    getAllAccounts,
    getOneAccountByEmail,
    getOneAccountByUserName,
    createAccount,
    deleteAccountByUsername,
    deleteAccountByAccountID,
    updateAccount,
    updateAccountPassword,
    updateAccountMFAOneTimePassword
}