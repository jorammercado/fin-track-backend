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

module.exports = {
    getAllTransactions
}