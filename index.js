require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");

const port = process.env.PORT || 3000;
const db_uri = process.env.DB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute)
app.use("/api/chat", chatRoute)


mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connection is established");
}).catch((error) => {
    console.log("Connection Error: ", error);
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})