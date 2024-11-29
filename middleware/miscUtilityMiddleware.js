const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid authorization header format' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(err)
                }
                resolve(decoded)
            })
        })

        req.account = decoded

        if (req.params.account_id && req.account.account_id !== Number(req.params.account_id)) {
            return res.status(403).json({ error: 'Unauthorized action' })
        }

        next()
    } catch (err) {
        return res.status(401).json({ error: 'Failed to authenticate token' })
    }
}

module.exports = {
    verifyToken
}