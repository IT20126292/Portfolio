const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDB connected sucessfully");
});

app.listen(PORT, ()=>{
    console.log(`server is currently running on port number:${PORT}`);
});

app.get('/', (req, res)=>{
    res.send('<b> ITP BackEnd API </b>')
});

const adminRoutes = require("./BackEnd/Routes/Adminaccess_Routes/admins");

app.use("/admins",adminRoutes);
