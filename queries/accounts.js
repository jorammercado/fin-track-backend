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

module.exports = {
    getOneAccount,
    getAllAccounts
}