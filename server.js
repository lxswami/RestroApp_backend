const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv').config();
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

// ✅ Correct mongoose connect
mongoose.connect(`${process.env.MONGO_URL}${process.env.DATABASE_NAME}`)
  .then(() => console.log(`✅ Your ${process.env.DATABASE_NAME} Database connected successfully`))
  .catch((error) => console.log("❌ DB connection error:", error));

// ✅ Your routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const dishRoute = require("./routes/dishRoute");
app.use("/", dishRoute);

const recipeRoute = require('./routes/recipeRoute');
app.use("/", recipeRoute);


// ✅ Correct server start
const startServer = () => {
  server.listen(process.env.SERVER_PORT, () => {
    console.log('✅ Your project running on port ' + process.env.SERVER_PORT);
    console.log(`🌐 Your server ready: ${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}`);
  });
};

startServer();
