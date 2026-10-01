const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Serve the frontend UI static files
app.use(express.static(path.join(__dirname, '../frontend')))

/**
 * - Routes
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/accounts.routes")
const transactionRoutes = require("./routes/transaction.routes")
const errorHandler = require("./middleware/error.middleware")

/**
 * - API Health check (moved from / to /api/health)
 */
app.get("/api/health", (req, res) => {
    res.send("Ledger API Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

// Catch-all to serve the frontend index.html for any other route
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'), (err) => {
        if (err) next(err)
    })
})

// Global error handler middleware — MUST be last
app.use(errorHandler)

module.exports = app
