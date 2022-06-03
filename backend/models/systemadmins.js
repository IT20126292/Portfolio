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

SysadminSchema.pre('save', async function(next){

    if(!this.isModified("SysPassword")){
        next();
    }
    const salt = await bcrypt.genSalt(8);
    this.SysPassword = await bcrypt.hash(this.SysPassword, salt);
});

SysadminSchema.methods.generateAuthToken = async function () {

    const posts = this;
    const token = jwt.sign({ _id: posts._id }, "jwtSecret");
    posts.tokens = posts.tokens.concat({ token });
    await posts.save();
    return token;
  
};

SysadminSchema.statics.findByCredentials = async (Sysemail, SysPassword) => {

    const pos = await SystemAdmin.findOne({ Sysemail });
    if (!pos){
      throw new Error("Please enter authorized email");
    }
    const isMatch = await bcrypt.compare(SysPassword, pos.SysPassword);
    if (!isMatch) {
      throw new Error("Password is not matched");
    }
    return pos;
};

const SystemAdmin = mongoose.model("SystemAdmin",SysadminSchema);

module.exports = SystemAdmin;