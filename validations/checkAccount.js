const { getOneAccountByUserName,
    getOneAccountByEmail,
    getAllAccounts
} = require("../queries/accounts")

const checkUsernameProvided = (req, res, next) => {
    if (req.body?.username) {
        return next()
    } else {
        res.status(400).json({ error: "Username is required!" })
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
        const registeredAccount = await getOneAccountByUserName(req.body?.username)
        if (registeredAccount) {
            res.status(409).json({ error: "Account already registered with this username." })
        } else {
            next()
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkUsernameExists." })
    }
}

const checkUsernameExistsOtherThanSelf = async (req, res, next) => {
    try {
        const { account_id } = req.params
        if (isNaN(Number(account_id))) {
            return res.status(400).json({ error: "Invalid account ID." })
        }
        const registeredAccount = await getOneAccountByUserName(req.body?.username)
        if (registeredAccount?.account_id === Number(account_id) || !registeredAccount) {
            next()
        } else {
            res.status(409).json({ error: "Account already registered with this username." })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkUsernameExistsOtherThanSelf." })
    }
}

const checkEmailProvided = (req, res, next) => {
    if (req.body?.email) {
        return next()
    } else {
        res.status(400).json({ error: "Email is required!" })
    }
}

const checkEmailExists = async (req, res, next) => {
    try {
        const registeredAccount = await getOneAccountByEmail(req.body?.email)
        if (registeredAccount?.email) {
            res.status(409).json({ error: "Account already registered with this address." })
        } else {
            next()
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkEmailExists." })
    }
}

const checkEmailExistsOtherThanSelf = async (req, res, next) => {
    try {
        const { account_id } = req.params
        if (isNaN(Number(account_id))) {
            return res.status(400).json({ error: "Invalid account ID." })
        }
        const registeredAccount = await getOneAccountByEmail(req.body?.email)
        if (registeredAccount?.account_id === Number(account_id) || !registeredAccount) {
            next()
        } else {
            res.status(409).json({ error: "Account already registered with this email." })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkEmailExistsOtherThanSelf." })
    }
}

const checkPasswordProvided = (req, res, next) => {
    if (req.body?.password) {
        return next()
    } else {
        res.status(400).json({ error: "Password is required!" })
    }
}

const checkNewPasswordProvided = (req, res, next) => {
    if (req.body?.newPassword) {
        return next()
    } else {
        res.status(400).json({ error: "New password is required!" })
    }
}

const checkValidUsername = async (req, res, next) => {
    const allAccounts = await getAllUsers()
    const { username } = req.params
    const allUsernames = allUsers.map(e => e.username)
    if (allUsernames.includes(Number(username)))
        return next()
    else
        res.status(400).json({
            error: `server error - invalid username sent`
        })
}

module.exports = {
    checkUsernameProvided,
    checkUsernameExists,
    checkUsernameExistsOtherThanSelf,
    checkEmailProvided,
    checkEmailExists,
    checkEmailExistsOtherThanSelf,
    checkPasswordProvided,
    checkNewPasswordProvided
}