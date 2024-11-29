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

const { createLoginRecord, getLoginRecordsByAccountID } = require("../queries/loginHistory.js")
const { verifyToken, setDefaultAccountValues } = require("../middleware/miscUtilityMiddleware.js")
const createMailOptions = require("../email/emailOptions.js")
const transporter = require('../email/emailTransporter.js')
const OTP_EXPIRATION_MS = 3 * 60 * 1000

// start login processs
accounts.post(
    "/login-initiate",
    checkEmailProvided,
    checkPasswordProvided,
    async (req, res) => {
        try {
            const oneAccount = await getOneAccountByEmail(req.body.email)
            const loginFailureMessage = {
                error: `Login failed. Please check your ` +
                    `email and password and try again.`
            }

            // failed login
            if (!oneAccount?.email) {
                return res.status(404).json(loginFailureMessage)
            }
            const isMatch = await bcrypt.compare(req.body.password, oneAccount.password)
            if (!isMatch) {
                return res.status(400).json(loginFailureMessage)
            }

            // generate 6 digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const hashedOtp = await bcrypt.hash(otp, 10)
            const expirationTimeForOTP = new Date(Date.now() + OTP_EXPIRATION_MS)
            await updateAccountMFAOneTimePassword(oneAccount.account_id, hashedOtp, expirationTimeForOTP)

            // send one time password
            const mailOptions = createMailOptions(
                oneAccount.email,
                "Your OTP for Login",
                `Your one-time password (OTP) is: ${otp}. It will expire in 3 minutes.`
            )
            transporter.sendMail(mailOptions)
                .then(info => console.log('OTP email sent successfully:', info.response))
                .catch(error => console.error('Failed to send OTP email:', error))

            return res.status(200).json({
                message: "Please check your email for the one-time password that has been sent to it.",
                account_id: oneAccount.account_id
            })
        } catch (error) {
            console.error("Error in initiate login:", error)
            res.status(500).json({
                error: `An error occurred while processing your request. ` +
                    `Please try again later.`
            })
        }
    })

// complete login
accounts.post(
    "/verify-otp",
    async (req, res) => {
        const { account_id, otp } = req.body
        const loginFailureMessage = { error: "Invalid account or OTP." }

        try {
            const account = await getOneAccount(account_id)
            if (!account?.account_id) {
                return res.status(404).json(loginFailureMessage)
            }

            const isMatch = await bcrypt.compare(otp, account.mfa_otp)
            if (!isMatch || new Date() > account.mfa_otp_expiration) {
                return res.status(400).json(loginFailureMessage)
            }

            const token = jwt.sign(
                {
                    account_id: account.account_id,
                    email: account.email,
                    username: account.username
                },
                process.env.JWT_SECRET,
                { expiresIn: '30m' }
            )

            delete account.password

            return res.status(200).json({ message: "Login successful.", token, account })
        } catch (error) {
            console.error("Error verifying OTP:", error)
            res.status(500).json({ error: "Server error, please try again later: " })
        }
    })

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
            const ip_address = req.ip
            const device_fingerprint = req.headers['user-agent'] || "unknown"
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

                await createLoginRecord(createdAccount.account_id, ip_address, device_fingerprint)
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
