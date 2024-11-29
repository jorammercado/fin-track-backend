const db = require("../db/dbConfig.js")

const createLoginRecord = async (account_id, ip_address, device_fingerprint) => {
    try {
        const newLoginRecord = await db.one(
            `INSERT INTO login_history (account_id, ip_address, device_fingerprint) ` +
            `VALUES ($1, $2, $3) RETURNING *`,
            [account_id, ip_address, device_fingerprint]
        )
        return newLoginRecord
    } catch (err) {
        return { err: `${err}, sql query error - create login record.` }
    }
}

module.exports = {
    createLoginRecord
}