require("dotenv").config();
const express = require("express");

const app = express();

// For Testing
app.get("/", (req, res) => res.send("Swvl Notification API!! --"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
