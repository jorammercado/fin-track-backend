const { getOneAccountByUserName } = require("../queries/accounts")

const checkUsernameProvided = (req, res, next) => {
    if (req.body?.username) {
        return next()
    } else {
        res.status(400).json({ error: "username is required!" })
    }
}

const checkUsernameExists = async (req, res, next) => {
    const registeredAccount = await getOneAccountByUserName(req.body?.username)
    if (registeredAccount) {
        res.status(400).json({ error: "Account already registered with this username" })
    } else {
        next()
    }
}

module.exports = {
    checkUsernameProvided,
    checkUsernameExists
}