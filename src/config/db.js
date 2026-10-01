const mongoose = require("mongoose")

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3000

async function connectToDB(retryCount = 0) {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        })
        console.log("✅ Server Is Connected To DB")
    } catch (err) {
        console.error(`❌ Error connecting to DB (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err.message || err)
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`)
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS))
            return connectToDB(retryCount + 1)
        } else {
            console.error("💀 All DB connection attempts failed. Exiting.")
            process.exit(1)
        }
    }
}

// Auto-reconnect if Atlas drops the connection mid-run
mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...")
    connectToDB()
})

// Graceful shutdown handling
process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("MongoDB connection closed through app termination")
    process.exit(0)
})

module.exports = connectToDB
