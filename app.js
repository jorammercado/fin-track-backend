const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to iCapital's - Budgeter")
})

app.get("*", (req, res) => {
    res.status(404).json({ error: "Page not found!" })
})

module.exports = app