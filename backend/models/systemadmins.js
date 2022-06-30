const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const concat = require("concat");

const schema = mongoose.Schema;
const SysadminSchema = new schema({
    SysadminID : {
        type : String,
        required : true
    },
    Sysusername : {
        type : String,
        required : true
    },
    Sysemail : {
        type : String,
        required : true
    },
    SysPassword : {
        type : String,
        required : true
    },
    SysPassword1 : {
        type : String,
        required : false
    },
    SysmanagerName : {
        type : String,
        required : false
    },
    SysbranchLocation : {
        type : String,
        required : false
    },
    SysbranchTelNumber : {
        type : String,
        required : false
    },
    tokens: [
        {
          token: {
            type: String,
            required: true
          },
        },
    ]
})

const SystemAdmin = mongoose.model("SystemAdmin",SysadminSchema);

module.exports = SystemAdmin;