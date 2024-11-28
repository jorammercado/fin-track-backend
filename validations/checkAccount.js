const checkUsernameProvided = (req, res, next) => {
    if (req.body?.username) {
        return next()
    } else {
        res.status(400).json({ error: "username is required!" })
    }
}

module.exports = {
    checkUsernameProvided
}