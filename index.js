const express = require('express');
const app = express();
// const dotenv = require("dotenv");
const PORT = 3000;
const Redis = require("redis");
const client = Redis.createClient();
const { checkExistUser } = require('./middlewares')
var mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const categoryRote = require("./routes/category");
 

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// app.use(express.json());


/// redisInit 
client.connect();
global.cached = client;

// dotenv.config();

/// connect with mongo
mongoose.connect("mongodb+srv://phamtrithuc22022000:oAdzE3Vz4aKI89D7@cluster0.eq2bixo.mongodb.net/").then(() => console.log("DB connection successful")).catch((err) => {
    console.log(err);
});

/// using json express

app.listen(PORT, () => {
    console.log(`Your server is running at port: ${PORT}`)
})

app.use("/api/auth", checkExistUser, authRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRote);


