

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

const checkCategoryProvided = (req, res, next) => {
    const { category } = req.body

    if (!category) {
        return res.status(400).json({ error: "Category is required!" })
    }

    const allowedCategories = [
        'salary', 'bonus', 'interest', 'dividend', 'rental income',
        'business income', 'investment', 'groceries', 'utilities',
        'rent/mortgage', 'transportation', 'education', 'healthcare',
        'entertainment', 'subscriptions', 'travel', 'savings',
        'emergency fund', 'retirement', 'clothing', 'dining',
        'household supplies', 'charity', 'debt repayment'
    ]

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: `Invalid category: ${category}. Allowed values are: ${allowedCategories.join(', ')}` })
    }

    return next()
}




module.exports = {
    checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided
}