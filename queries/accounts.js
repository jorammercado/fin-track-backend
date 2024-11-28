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

module.exports = {
    getOneAccount,
    getAllAccounts,
    getOneAccountByEmail,
    getOneAccountByUserName
}