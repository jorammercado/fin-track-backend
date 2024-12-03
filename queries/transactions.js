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

        if (!oneTransaction) {
            console.error(`Transaction with id ${transaction_id} not found`)
            return { error: `Transaction with id ${transaction_id} not found` }
        }

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
            return deletedTransaction
        } else {
            console.error('Transaction not found')
            return { error: 'Transaction not found' }
        }
    } catch (err) {
        console.error(err)
        return { err: `${err}, sql query error - delete a transaction` }
    }
}

const { updateAccount } = require("../queries/accounts")
const createTransaction = async (transactionData) => {
    const {
        account_id,
        transaction_type,
        amount,
        category,
        description = '',
        recurring = false,
        recurring_frequency = 'one-time',
        risk_level = 'n/a',
        is_planned = false,
        created_at = new Date()
    } = transactionData

    try {
        const newTransaction = await db.one(
            `INSERT INTO financial_transactions (
                account_id, transaction_type, amount, category, description,
                recurring, recurring_frequency, risk_level, is_planned, created_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) RETURNING *`,
            [
                account_id,
                transaction_type,
                Number(amount),
                category,
                description,
                recurring,
                recurring_frequency,
                risk_level,
                is_planned,
                created_at
            ]
        )

        let balanceColumn
        if (transaction_type === 'income') {
            balanceColumn = 'checking_account'
        } else if (transaction_type === 'expense') {
            balanceColumn = 'checking_account'
        } else if (transaction_type === 'investment') {
            if (['retirement', 'savings', 'emergency fund'].includes(category)) {
                balanceColumn = 'savings_account'
            } else {
                balanceColumn = 'investments'
            }
        }

        if (balanceColumn) {
            const updateValue = transaction_type === 'expense' ? -Number(amount) : Number(amount)
            const updatedData = {
                [balanceColumn]: updateValue
            }
            await updateAccount(account_id, updatedData)
        }

        return newTransaction
    } catch (err) {
        console.error(err)
        return { err: `${err}, sql query error - create a transaction` }
    }
}

const updateTransaction = async (transaction_id, transactionData) => {
    const {
        account_id,
        transaction_type,
        amount,
        category,
        description,
        recurring,
        recurring_frequency,
        risk_level,
        is_planned,
    } = transactionData

    try {
        const updatedTransaction = await db.oneOrNone(
            `UPDATE financial_transactions SET
                account_id = COALESCE($1, account_id),
                transaction_type = COALESCE($2, transaction_type),
                amount = COALESCE($3, amount),
                category = COALESCE($4, category),
                description = COALESCE($5, description),
                recurring = COALESCE($6, recurring),
                recurring_frequency = COALESCE($7, recurring_frequency),
                risk_level = COALESCE($8, risk_level),
                is_planned = COALESCE($9, is_planned)
            WHERE transaction_id = $10
            RETURNING *`,
            [
                account_id,
                transaction_type,
                Number(amount),
                category,
                description,
                recurring,
                recurring_frequency,
                risk_level,
                is_planned,
                transaction_id
            ]
        )

        if (updatedTransaction) {
            return updatedTransaction
        } else {
            console.error('Transaction not found')
            return { error: 'Transaction not found' }
        }
    } catch (err) {
        console.error(err)
        return { err: `${err}, sql query error - update a transaction` }
    }
}

module.exports = {
    getAllTransactions,
    getOneTransaction,
    deleteTransaction,
    createTransaction,
    updateTransaction
}