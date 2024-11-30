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

// start login 
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
            return res.status(500).json({
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
        const ip_address = req.ip
        const device_fingerprint = req.headers['user-agent'] || "unknown"

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

            res.status(200).json({ message: "Login successful.", token, account })

            // new browser login notification
            const previousLogins = await getLoginRecordsByAccountID(account.account_id)
            const isNewDevice = !previousLogins?.some(login =>
                login.ip_address === ip_address &&
                login.device_fingerprint === device_fingerprint
            )
            if (isNewDevice) {
                const mailOptionsNewDevice = createMailOptions(account.email,
                    "New Browser Login Detected",
                    `We detected a new browser login to your account.\nIP Address: ` +
                    `${ip_address}\nDevice: ${device_fingerprint}\nIf ` +
                    `this wasn't you, please reset your password or contact support.`
                )

                transporter.sendMail(mailOptionsNewDevice)
                    .then(info => console.log('New browser login email sent:', info.response))
                    .catch(error => console.error('Failed to send new browser login email:', error))

            }
            createLoginRecord(account.account_id, ip_address, device_fingerprint)
                .then(() => console.log('Login record created successfully.'))
                .catch(error => console.error('Failed to create login record:', error))
        } catch (error) {
            console.error("Error verifying OTP:", error)
            return res.status(500).json({ error: "Server error, please try again later: " })
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
    checkPasswordStrength("password"),
    async (req, res) => {
        try {
            const newAccount = req.body
            const ip_address = req.ip
            const device_fingerprint = req.headers['user-agent'] || "unknown"
            const salt = await bcrypt.genSalt(10)
            newAccount.password = await bcrypt.hash(newAccount.password, salt)

            const createdAccount = await createAccount(newAccount)
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
            return res.status(500).json({ error: "Internal server error. Please try again later." })
        }
    })

// delete account
accounts.delete(
    "/:account_id",
    verifyToken,
    checkAccountIndex,
    async (req, res) => {
        try {
            const { account_id } = req.params
            const deletedAccount = await deleteAccountByAccountID(account_id)
            if (deletedAccount) {
                return res.status(200).json({ message: "Account Deleted." })
            }
            else {
                return res.status(404).json({ error: "Failed to Delete Account." })
            }
        }
        catch (error) {
            console.error("Error deleting account: ", error)
            return res.status(500).json({ error: "Server error, please try again later." })
        }
    })

// update account
accounts.put(
    "/:account_id",
    verifyToken,
    checkAccountIndex,
    checkUsernameExistsOtherThanSelf,
    checkEmailExistsOtherThanSelf,
    checkEmailFormat,
    checkFirstnameFormat,
    checkLastnameFormat,
    checkUsernameValidity,
    checkDobFormat,
    setDefaultAccountValues,
    async (req, res) => {
        try {
            const { account_id } = req.params
            const accountToUpdate = req.body
            const updatedAccount = await updateAccount(account_id, accountToUpdate)
            if (updatedAccount.account_id) {
                delete updatedAccount.password
                return res.status(200).json(updatedAccount)
            }
            else {
                return res.status(404).json({
                    error: `Account not found or unable to update account.`
                })
            }
        }
        catch (error) {
            console.error("Error updating account: ", error)
            return res.status(500).json({ error: `Server error, please try again later.` })
        }
    })

// update password 
accounts.put(
    "/:account_id/password",
    verifyToken,
    checkAccountIndex,
    checkPasswordProvided,
    checkNewPasswordProvided,
    checkPasswordStrength("newPassword"),
    async (req, res) => {
        try {
            const { account_id } = req.params
            const { password, newPassword } = req.body

            const account = await getOneAccount(account_id)
            if (!account) {
                return res.status(404).json({ error: "Account not found." })
            }

            const isMatch = await bcrypt.compare(password, account.password)
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials. Please try again." })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            const updatedAccount = await updateAccountPassword(account_id, hashedPassword)
            if (updatedAccount.account_id) {
                delete updatedAccount.password
                return res.status(200).json(updatedAccount)
            } else {
                return res.status(500).json({
                    error: `Error in updating password, please try again later.`
                })
            }
        } catch (error) {
            console.error("Unable to update account password: ", error)
            return res.status(500).json({ error: `Server error, please try again later.` })
        }
    })

// guest login
accounts.post(
    "/guest-login",
    async (req, res) => {
        try {
            const guestAccount = await getOneAccountByEmail('guest_account@domain.com')
            const ip_address = req.ip
            const device_fingerprint = req.headers['user-agent'] || "unknown"

            if (!guestAccount) {
                return res.status(500).json({ error: "Guest account is not available. Please try again later." })
            }

            const token = jwt.sign(
                {
                    account_id: guestAccount.account_id,
                    email: guestAccount.email,
                    username: guestAccount.username
                },
                JWT_SECRET,
                { expiresIn: '30m' }
            )

            delete guestAccount.password

            res.status(200).json({ message: "Login successful.", token, guestAccount })

            createLoginRecord(guestAccount.account_id, ip_address, device_fingerprint)
                .then(() => console.log('Login record created successfully.'))
                .catch(error => console.error('Failed to create login record:', error))
        } catch (error) {
            console.error("Error during guest login:", error)
            return res.status(500).json({ error: "Server error, please try again later." })
        }
    })

module.exports = accounts
