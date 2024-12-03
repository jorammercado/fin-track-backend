

const checkAmountProvided = (req, res, next) => {
    const { amount } = req.body

    if (typeof amount === 'undefined') {
        return res.status(400).json({ error: "Amount is required!" })
    }

    if (typeof amount !== 'number' ) {
        return res.status(400).json({ error: "Amount must be a number." })
    }

    return next()
}


module.exports = {
    checkAmountProvided
}