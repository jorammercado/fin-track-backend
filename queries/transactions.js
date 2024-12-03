const db = require(`../db/dbConfig.js`)

const getAllTransactions = async (account_id) => {
    try {
        const allTransactions = await db.any(`SELECT * FROM financial_transactions WHERE account_id=$1`,
            [account_id])
        return allTransactions
    }
    catch (err) {
        return { err: `${err}, sql query error - get all transactions` }
    }
}

const getOneTransaction = async (transaction_id) => {
    try {
        const oneTransaction = await db.oneOrNone(`SELECT * FROM financial_transactions WHERE transaction_id=$1`,
            [transaction_id])
        return oneTransaction
    }
    catch (err) {
        return { err: `${err}, sql query error - get one transaction` }
    }
}

module.exports = {
    getAllTransactions,
    getOneTransaction
}