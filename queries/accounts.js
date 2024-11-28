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

const getOneAccountByEmail = async ( email ) => {
    try {
        const account = await db.oneOrNone("SELECT * FROM accounts WHERE email=$1",
            email)
        return account
    }
    catch (err) {
        return { err: `${err}, sql query error - get one account by email` }
    }
}

const getOneAccountByUserName = async ( username ) => {
    try {
        const account = await db.oneOrNone("SELECT * FROM accounts WHERE username=$1",
            username)
        return account
    }
    catch (err) {
        return { err: `${err}, sql query error - get one account by username` }
    }
}

const createAccount = async (user) => {
    try {
        const createdUser = await db.one(`INSERT INTO accounts (firstname,` +
            ` lastname,` +
            ` email,` +
            ` password_hashed,` +
            ` username,` +
            ` profile_img,` +
            ` about,` +
            ` dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.username,
            user.profile_img,
            user.about,
            user.dob])
        return createdUser
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

module.exports = {
    getOneAccount,
    getAllAccounts,
    getOneAccountByEmail,
    getOneAccountByUserName,
    createAccount,
    deleteAccountByUsername
}