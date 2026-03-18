const mongoose = require("mongoose")

function connectToDB() {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Server Is Connected To DB")
        })
        .catch(err => {
            console.error("Error connecting to DB:", err.message || err)
            process.exit(1)
        })
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("MongoDB connection closed through app termination")
    process.exit(0)
})

module.exports = connectToDB
