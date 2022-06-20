const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const concat = require("concat");

const schema = mongoose.Schema;
const AdminSchema = new schema({
    adminID : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    Password1 : {
        type : String,
        required : false
    },
    managerName : {
        type : String,
        required : false
    },
    branchLocation : {
        type : String,
        required : false
    },
    branchTelNumber : {
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

AdminSchema.pre('save', async function(next){

    if(!this.isModified("Password")){
        next();
    }
    const salt = await bcrypt.genSalt(8);
    this.Password = await bcrypt.hash(this.Password, salt);
});

AdminSchema.methods.generateAuthToken = async function () {

    const posts = this;
    const token = jwt.sign({ _id: posts._id }, "jwtSecret");
    posts.tokens = posts.tokens.concat({ token });
    await posts.save();
    return token;
  
};

AdminSchema.statics.findByCredentials = async (email, Password) => {

    const pos = await Admin.findOne({ email });
    if (!pos){
      throw new Error("Please enter authorized email");
    }
    const isMatch = await bcrypt.compare(Password, pos.Password);
    if (!isMatch) {
      throw new Error("Password is not matched");
    }
    return pos;
};

const Admin = mongoose.model("Admin",AdminSchema);

module.exports = Admin;