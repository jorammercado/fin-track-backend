

const checkAmountProvided = (req, res, next) => {
    const { amount } = req.body

    if (typeof amount === 'undefined') {
        return res.status(400).json({ error: "Amount is required!" })
    }

    if (typeof amount !== 'number') {
        return res.status(400).json({ error: "Amount must be a number." })
    }

    return next()
}

const checkTransactionTypeProvided = (req, res, next) => {
    const { transaction_type } = req.body

    if (!transaction_type) {
        return res.status(400).json({ error: "Transaction type is required!" })
    }

    const allowedTypes = ['income', 'expense', 'investment']
    if (!allowedTypes.includes(transaction_type)) {
        return res.status(400).json({ error: `Invalid transaction type: ${transaction_type}. Allowed values are: ${allowedTypes.join(', ')}` })
    }

    return next()
}



module.exports = {
    checkAmountProvided,
    checkTransactionTypeProvided
}