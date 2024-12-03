const db = require(`../db/dbConfig.js`)

const getAllTransactions = async (account_id) => {
    try {
        const allTransactions = await db.any(`SELECT * FROM financial_transactions WHERE account_id=$1`,
            [account_id])
        return allTransactions
    }
    catch (err) {
        console.error(err)
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
        console.error(err)
        return { err: `${err}, sql query error - get one transaction` }
    }
}

const deleteTransaction = async (transaction_id) => {
    try {
        const deletedTransaction = await db.oneOrNone(`DELETE FROM financial_transactions WHERE transaction_id=$1 RETURNING *`,
            [transaction_id])
        if (deletedTransaction) {
            return deletedTransaction;
        } else {
            console.error('Transaction not found')
            return { error: 'Transaction not found' }
        }
    } catch (err) {
        console.error(err)
        return { err: `${err}, sql query error - delete a transaction` }
    }
}

module.exports = {
    getAllTransactions,
    getOneTransaction,
    deleteTransaction
}