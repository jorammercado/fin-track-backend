const express = require("express")
const transactions = express.Router({ mergeParams: true })
const { getOneAccount } = require("../queries/accounts")

const { getAllTransactions,
    getOneTransaction,
    deleteTransaction,
    createTransaction,
    updateTransaction
} = require("../queries/transactions")
const { checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided,
    checkRecurringDetails,
    checkRiskLevelProvided,
    checkTransactionID,
    checkAccountID,
    validateTransactionOwnership
} = require("../validations/checkTransactions.js")

// create
transactions.post("/create", checkAccountID,
    checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided,
    checkRecurringDetails,
    checkRiskLevelProvided, async (req, res) => {
        try {
            const transactionData = req.body
            const newTransaction = await createTransaction(transactionData)
            return res.status(201).json(newTransaction)
        }
        catch (error) {
            console.error("Error creating new transaction:", error)
            return res.status(500).json({
                error: `Internal server error ` +
                    `while creating the transaction.`
            })
        }
    }
)

// get one
transactions.post("/:transaction_id",
    checkAccountID,
    checkTransactionID,
    async (req, res) => {
        const { account_id, transaction_id } = req.params
        try {
            const oneTransaction = await getOneTransaction(transaction_id)

            if (oneTransaction.error || oneTransaction.err) {
                return res.status(500).json({ error: oneTransaction.error || oneTransaction.err })
            }

            if (!oneTransaction) {
                return res.status(404).json({ error: "Transaction not found" })
            }

            if (oneTransaction.account_id !== account_id) {
                return res.status(404).json({ error: "Transaction not found for this account" })
            }

            return res.status(200).json(oneTransaction)
        } catch (error) {
            console.error("Error fetching one transaction:", error)
            return res.status(500).json({ error: "Internal server error" })
        }
    })

// get all
transactions.post("/", checkAccountID, async (req, res) => {
    const { account_id } = req.params
    try {
        const transactionsList = await getAllTransactions(account_id)

        if (transactionsList.err) {
            return res.status(500).json({ error: transactionsList.err })
        }

        if (transactionsList.length === 0) {
            return res.status(200).json([])
        }

        return res.status(200).json(transactionsList)
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

// delete
transactions.delete("/:transaction_id",
    checkAccountID,
    checkTransactionID,
    validateTransactionOwnership,
    async (req, res) => {
        const { transaction_id } = req.params
        try {
            const deletedTransaction = await deleteTransaction(transaction_id)

            if (deletedTransaction.error || deletedTransaction.err) {
                return res.status(500).json({ error: deletedTransaction.error || deletedTransaction.err })
            }

            if (!deletedTransaction) {
                return res.status(404).json({ error: "Transaction not found" })
            }

            return res.status(200).json(deletedTransaction)
        } catch (error) {
            console.error("Error in delete controller path for transactions:", error)
            return res.status(500).json({
                error: `${error} Error in delete controller path for transactions.`
            })
        }
    })

// update
transactions.put("/:transaction_id",
    checkAccountID,
    checkTransactionID,
    validateTransactionOwnership,
    checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided,
    checkRecurringDetails,
    checkRiskLevelProvided,
    async (req, res) => {
        const { transaction_id } = req.params
        const transactionToBeUpdated = req.body

        try {
            const updatedTransaction = await updateTransaction(transaction_id, transactionToBeUpdated)

            if (!updatedTransaction) {
                return res.status(404).json({ error: "Transaction not found or no changes were made." })
            }

            return res.status(200).json(updatedTransaction)

        } catch (error) {
            console.error("Error updating transaction:", error)
            return res.status(500).json({
                error: `Internal server error while updating the transaction.`
            })
        }
    }
)

module.exports = transactions