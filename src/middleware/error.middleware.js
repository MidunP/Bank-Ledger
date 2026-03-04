/**
 * Global Error Handling Middleware for Express Application
 */
function errorHandler(err, req, res, next) {
    console.error("Unhandled Error:", err.stack || err.message || err)

    const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500

    res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
}

module.exports = errorHandler
