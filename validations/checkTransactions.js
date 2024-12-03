const { getOneTransaction } = require("../queries/transactions")

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

const checkRecurringDetails = (req, res, next) => {
    const { recurring, recurring_frequency } = req.body

    if (recurring) {
        const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly']
        if (!recurring_frequency || !allowedFrequencies.includes(recurring_frequency)) {
            return res.status(400).json({
                error: `Recurring frequency is required when recurring is true! Allowed values are: ${allowedFrequencies.join(', ')}`
            })
        }
    }

    if (!recurring && recurring_frequency && recurring_frequency !== 'one-time') {
        return res.status(400).json({
            error: `Recurring frequency should be 'one-time' when the transaction is not recurring.`
        })
    }

    return next()
}

const checkRiskLevelProvided = (req, res, next) => {
    const { risk_level } = req.body

    if (!risk_level) {
        req.body.risk_level = 'n/a'
    }

    const allowedRiskLevels = ['n/a', 'low', 'moderate', 'high']
    if (!allowedRiskLevels.includes(req.body.risk_level)) {
        return res.status(400).json({ error: `Invalid risk level: ${risk_level}. Allowed values are: ${allowedRiskLevels.join(', ')}` })
    }

    return next()
}

const checkTransactionID = async (req, res, next) => {
    const { transaction_id } = req.params

    if (!transaction_id || isNaN(Number(transaction_id)) || Number(transaction_id) <= 0) {
        return res.status(400).json({ error: "Invalid or missing transaction ID. It must be a positive number." })
    }

    try {
        const transaction = await getOneTransaction(transaction_id)
        
        if (!transaction || transaction?.error) {
            return res.status(404).json({ error: "Transaction not found." })
        }

        return next()
    } catch (err) {
        console.error(`Error retrieving transaction: ${err}`)
        return res.status(500).json({ error: "Internal Server Error while validating transaction ID." })
    }
}



module.exports = {
    checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided,
    checkRecurringDetails,
    checkRiskLevelProvided,
    checkTransactionID
}