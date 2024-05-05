const express = require("express");
const cors = require('cors')
const mongoose = require('mongoose')
const rootRouter = require('./routes/index')

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/", rootRouter)

const connect = () => {
    try {
        mongoose.connect('mongodb+srv://admin:qtsGn7eNXcttU0zO@cluster0.9ekt417.mongodb.net/');
        console.log("Database Connected")
    }
    catch (err) {
        console.log(err.message)
    }
}
connect();
app.listen(3000, () => {
    console.log('App Started')
});