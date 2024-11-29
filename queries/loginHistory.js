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

const getLoginRecordsByAccountID = async (account_id) => {
    try {
        const loginRecord = await db.any(
            `SELECT * FROM login_history WHERE account_id=$1 ORDER BY login_time DESC`,
            [account_id]
        )
        return loginRecord
    } catch (err) {
        return { err: `${err}, sql query error - get login record by account_id` }
    }
}

const getAllLoginRecords = async () => {
    try {
        const allLoginRecords = await db.any(
            `SELECT * FROM login_history ORDER BY login_time DESC`
        )
        return allLoginRecords
    } catch (err) {
        return { err: `${err}, sql query error - get all login records` }
    }
}

module.exports = {
    createLoginRecord,
    getLoginRecordsByAccountID,
    getAllLoginRecords
}