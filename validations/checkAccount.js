const { getOneAccountByUserName,
    getOneAccountByEmail,
    getAllAccounts
} = require("../queries/accounts")

const reservedUsernames = new Set(['admin', 'root', 'superuser', 'administrator', 'support',
    'help', 'moderator', 'system', 'guest', 'owner', 'master', 'test', 'user', 'manager'])

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
            return res.status(400).json({ error: "Invalid or malformed account ID" })
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
            return res.status(400).json({ error: "Invalid or malformed account ID" })
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
    try {
        const allAccounts = await getAllAccounts()
        const { username } = req.params
        const allUsernames = allAccounts.map(e => e.username)
        if (allUsernames.includes(username)) {
            return next()
        } else {
            res.status(400).json({ error: "Invalid username provided." })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkValidUsername." })
    }
}

const checkAccountIndex = async (req, res, next) => {
    try {
        const allAccounts = await getAllAccounts()
        const { account_id } = req.params
        if (isNaN(Number(account_id))) {
            return res.status(400).json({ error: "Invalid or malformed account ID" })
        }
        const ids = allAccounts.map(e => e.account_id)
        if (ids.includes(Number(account_id))) {
            return next()
        } else {
            res.status(400).json({ error: "Account ID does not exist." })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error at checkAccountIndex." })
    }
}

const checkEmailFormat = (req, res, next) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const email = req.body?.email

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format!" })
    }

    const [localPart, domainPart] = email?.split('@')
    const [domainName, topLevelDomain] = domainPart?.split('.')

    if (reservedUsernames.has(localPart.toLowerCase()) ||
        reservedUsernames.has(domainName.toLowerCase()) ||
        reservedUsernames.has(topLevelDomain.toLowerCase())) {
        return res.status(400).json({ error: "Email cannot contain reserved words in any part!" })
    }

    return next()
}

const checkFirstnameFormat = (req, res, next) => {
    const nameRegex = /^[a-zA-Z-']+$/
    const firstname = req.body?.firstname

    if (!firstname || (nameRegex.test(firstname) && firstname.length >= 2 && firstname.length <= 50 && !reservedUsernames.has(firstname.toLowerCase()))) {
        return next()
    } else {
        res.status(400).json({
            error: `Firstname must contain only letters, apostrophes, or hyphens, ` +
                `and must be between 2 and 50 characters long!`
        })
    }
}

const checkLastnameFormat = (req, res, next) => {
    const nameRegex = /^[a-zA-Z-']+$/
    const lastname = req.body?.lastname

    if (!lastname || (nameRegex.test(lastname) && lastname.length >= 2 && lastname.length <= 50 && !reservedUsernames.has(lastname.toLowerCase()))) {
        return next()
    } else {
        res.status(400).json({
            error: `Lastname must contain only letters, apostrophes, or hyphens, ` +
                `and must be between 2 and 50 characters long!`
        })
    }
}

const checkUsernameValidity = (req, res, next) => {
    const { username, firstname, lastname, dob } = req.body

    const isReservedUsername = (username) => reservedUsernames.has(username.toLowerCase())
    if (isReservedUsername(username)) {
        return res.status(400).json({ error: "Username cannot be a reserved name!" })
    }

    if (firstname?.toLowerCase() + lastname?.toLowerCase() === username?.toLowerCase()) {
        return res.status(400).json({ error: "Username cannot be the same as your firstname and lastname combined!" })
    }

    if (dob && username === dob) {
        return res.status(400).json({ error: "Username cannot be your date of birth!" })
    }

    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: "Username must be between 3 and 30 characters long!" })
    }

    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!validUsernameRegex.test(username)) {
        return res.status(400).json({ error: "Username must contain only letters, numbers, hyphens, or underscores!" })
    }

    return next()
}

const checkDobFormat = (req, res, next) => {
    const dobRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const dob = req.body?.dob

    if (!dob || !dobRegex.test(dob)) {
        return res.status(400).json({ error: "Date of birth must be in the format ##/##/#### or #/#/####" })
    }

    const [, month, day, year] = dob.match(dobRegex)
    const dobDate = new Date(`${year}-${month}-${day}`)
    const today = new Date()
    const minDob = new Date()
    minDob.setFullYear(minDob.getFullYear() - 100)

    if (dobDate < minDob || dobDate > today) {
        return res.status(400).json({ error: "Date of birth must be within the last 100 years and cannot be in the future." })
    }

    return next()
}

const checkPasswordStrength = (passwordField) => (req, res, next) => {
    const password = req.body[passwordField]

    if (!/(?=.*\d)/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one digit." })
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one lowercase letter." })
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter." })
    }

    if (!/(?=.*[\W_])/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one special character." })
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." })
    }

    if (password.length > 128) {
        return res.status(400).json({ error: "Password must not exceed 128 characters." })
    }

    next()
}


module.exports = {
    checkUsernameProvided,
    checkUsernameExists,
    checkUsernameExistsOtherThanSelf,
    checkEmailProvided,
    checkEmailExists,
    checkEmailExistsOtherThanSelf,
    checkPasswordProvided,
    checkNewPasswordProvided,
    checkValidUsername,
    checkAccountIndex,
    checkEmailFormat,
    checkFirstnameFormat,
    checkLastnameFormat,
    checkUsernameValidity,
    checkDobFormat,
    checkPasswordStrength
}