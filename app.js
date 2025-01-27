const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to FinTrack\'s backend services')
})

const accountsController = require('./controllers/accountsController')
app.use('/accounts', accountsController)

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Page not found!' })
})

module.exports = app