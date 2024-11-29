const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const accounts = express.Router()

const {
    getOneAccountByEmail,
    getOneAccount,
    createAccount,
    deleteAccountByAccountID,
    updateAccount,
    updateAccountPassword,
    updateAccountMFAOneTimePassword
} = require("../queries/accounts.js")

const {
    checkUsernameProvided,
    checkEmailProvided,
    checkPasswordProvided,
    checkAccountIndex,
    checkUsernameExists,
    checkEmailExists,
    checkUsernameExistsOtherThanSelf,
    checkEmailExistsOtherThanSelf,
    checkEmailFormat,
    checkFirstnameFormat,
    checkLastnameFormat,
    checkUsernameValidity,
    checkDobFormat,
    checkNewPasswordProvided,
    checkPasswordStrength
} = require("../validations/checkAccount.js")

const { verifyToken, setDefaultAccountValues } = require("../middleware/miscUtilityMiddleware.js")
const createMailOptions = require("../email/emailOptions.js")
const transporter = require('../email/emailTransporter.js')

// sign up
accounts.post(
    "/",
    checkUsernameProvided,
    checkEmailProvided,
    checkPasswordProvided,
    checkUsernameExists,
    checkEmailExists,
    checkEmailFormat,
    checkFirstnameFormat,
    checkLastnameFormat,
    checkUsernameValidity,
    checkDobFormat,
    setDefaultAccountValues,
    checkPasswordStrength("password"), async (req, res) => {
        try {
            const newAccount = req.body
            const salt = await bcrypt.genSalt(10)
            newAccount.password = await bcrypt.hash(newAccount.password, salt)

            let createdAccount = await createAccount(newAccount)
            if (createdAccount.account_id) {
                const token = jwt.sign(
                    {
                        account_id: createdAccount.account_id,
                        email: createdAccount.email,
                        username: createdAccount.username
                    },
                    JWT_SECRET,
                    { expiresIn: '30m' }
                )

                delete createdAccount.password

                const mailOptions = createMailOptions(
                    createdAccount.email,
                    'Welcome to Our Platform!',
                    'Thank you for signing up to iCapital\'s Budgeter App.'
                )

                transporter.sendMail(mailOptions)
                    .then(info => console.log('Confirmation email sent:', info.response))
                    .catch(err => console.error('Error sending email:', err))

                res.status(201).json({ status: 'success', data: { createdAccount, token } })
            } else {
                res.status(400).json({
                    error: `Failed to create user.`
                })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error. Please try again later." })
        }
    })

module.exports = accounts
