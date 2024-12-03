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
    checkAccountID
} = require("../validations/checkTransactions.js")

// get all

// get one

// delete

// create

// update

module.exports = transactions