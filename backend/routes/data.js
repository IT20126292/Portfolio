const router = require("express").Router();
let admin = require("../../Models/Adminaccess_Models/admin.js");
let sysadmin = require("../../Models/Adminaccess_Models/systemadmins.js");
let logbook = require("../../Models/Adminaccess_Models/adminlogbook.js");
const jwt = require("jsonwebtoken");
const auth = require("../../../FrontEnd/admin/src/Components/auth");
const sysauth = require("../../../FrontEnd/admin/src/Components/sysauth");

//CREATE FUNCTION 1
router.route("/add").post((req,res)=>{
     const adminID = req.body.adminID;
     const username = req.body.username;
     const email = req.body.email;
     const Password = req.body.Password;

     const newAdmin = new admin({
        adminID,
        username,
        email,
        Password
     })

     newAdmin.save().then(()=>{
         res.json("New Admin Added to the database");
     }).catch((err)=>{
         console.log(err);
     })

})

//CREATE FUNCTION 2
router.post('/post/save',(req,res)=>{
    let newAdmin = new admin(req.body);

    newAdmin.save((err)=>{
        if(err){
            return res.status(400).json({
                error:err
            });
        }
        return res.status(200).json({
            success:"Posts Saved Successfully"
        });
    });
});

//SUB ADMIN CREATE FUNCTION 3
router.post("/newAdd", async (req, res) => {
    try {
      const {adminID,username,email,Password,Password1} = req.body;

      let pos = await admin.findOne({ email })

        if (pos) {
            throw new Error("User already exists");
        }
        pos = {
            adminID:adminID,
            username:username,
            email:email,
            Password:Password,
            Password1:Password1
        };

      const newAdmin = new admin(pos);
      await newAdmin.save();
      const token = await newAdmin.generateAuthToken();
      res
        .status(201)
        .send({ status:"posts Created", admin: newAdmin, token: token });

    }catch (error) {

      console.log(error.message);

      res.status(500).send({error: error.message});

    }
});

//SYSTEM ADMIN CREATE FUNCTION 3
router.post("/systemAdminAdd", async (req, res) => {
    try {
      const {SysadminID,Sysusername,Sysemail,SysPassword,SysPassword1, SysmanagerName, SysbranchLocation, SysbranchTelNumber} = req.body;

      let pos = await sysadmin.findOne({ Sysemail })

        if (pos) {
            throw new Error("User already exists");
        }
        pos = {
            SysadminID:SysadminID,
            Sysusername:Sysusername,
            Sysemail:Sysemail,
            SysPassword:SysPassword,
            SysPassword1:SysPassword1,
            SysmanagerName:SysmanagerName,
            SysbranchLocation:SysbranchLocation,
            SysbranchTelNumber:SysbranchTelNumber

        };

      const systemAdmin = new sysadmin(pos);
      await systemAdmin.save();
      const token = await systemAdmin.generateAuthToken();
      res
        .status(201)
        .send({ status:"System Admin Posts Created", systemadmin: systemAdmin, token: token });

    }catch (error) {

      console.log(error.message);

      res.status(500).send({error: error.message});

    }
});

//RETRIEV FUNCTION 1
router.route("/").get((req,res)=>{
    admin.find().then((admin)=>{
        res.json(admin)
    }).catch((err)=>{
        console.log(err)
    })
})

//RETRIEV FUNCTION 2
router.get('/posts',(req,res)=>{
    admin.find().exec((err,admin)=>{
        if(err){
            return res.status(400).json({
                error:err
            });
        }
        return res.status(200).json({
            success:true,
            existingAdmins:admin
        });
    });
});

//RETRIEV FUNCTION 3
router.get('/logbook',(req,res)=>{
    logbook.find().exec((err,book)=>{
        if(err){
            return res.status(400).json({
                error:err
            });
        }
        return res.status(200).json({
            success:true,
            existingLogbooks:book
        });
    });
});

//SUB ADMIN UPDATE FUNCTION 1
router.route("/update/:id").put(async(req,res)=>{
    let adminId = req.params.id;
    const {adminID,username,email,Password1} = req.body;
    const updateAdmin = {
        adminID,
        username,
        email,
        Password1
    }
    const update = await admin.findByIdAndUpdate(adminId, updateAdmin).then(()=>{
        res.status(200).send({status:"Admin Updated"});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status:"Error Generated in the Admin updated part", error: err.message});
    })

    
})

//UPDATE FUNCTION 2
router.put('/post/update/:id',(req,res)=>{
    admin.findByIdAndUpdate(
        req.params.id,{
            $set:req.body
        },
        (err,update)=>{
            if(err){
                return res.status(400).json({
                    error:err
                });
            }
            return res.status(200).json({
                success:"Updated Successfully",update
            });
        }
    );
});

//DELETE FUNCTION 1
router.route("/delete/:id").delete(async(req,res)=>{
    let adminId = req.params.id;
    await admin.findByIdAndDelete(adminId).then(()=>{
        res.status(200).send({status:"admin deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error with delete admin", error: err.message});
    })
})

//SUB ADMIN DELETE FUNCTION 2
router.delete('/post/delete/:id',(req,res)=>{
    admin.findByIdAndDelete(req.params.id).exec((err,deleteAdmin)=>{
        if(err){
            return res.status(400).json({
                message:"Delete Unsuccessful",err
            });
        }
        return res.json({
            message:"Delete Successfull", deleteAdmin
        });
    });
});

//SUB ADMIN DELETE FUNCTION 3
router.delete('/logbook/delete/:id',(req,res)=>{
    logbook.findByIdAndDelete(req.params.id).exec((err,deletelogs)=>{
        if(err){
            return res.status(400).json({
                message:"Delete Unsuccessful",err
            });
        }
        return res.json({
            message:"Delete Successfull", deletelogs
        });
    });
});

//SEARCH FUNCTION 1
router.route("/get/:id").get(async(req,res)=>{
    let adminId = req.params.id;
    const Admin = await admin.findById(adminId).then((Admin)=>{
        res.status(200).send({status:"Admin fetched"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error with search admin", error: err.message});
    })
})

// SUB ADMIN SEARCH FUNCTION 2
router.get('/posts/:id',(req,res)=>{
    let getid = req.params.id;

    admin.findById(getid,(err,search)=>{
        if(err){
            return res.status(400).json({
                success:false,err
            });
        }
        return res.status(200).json({
            success:true,
            search
        })
    });
});

//SUB ADMIN LOGIN FUNCTION
router.post('/post/login', async (req, res) => {
    try {
      const {email, Password, SysloginDate, SysloginTime} = req.body
      const pos = await admin.findByCredentials(email, Password)
      const token = await pos.generateAuthToken()
      res.status(200).send({token: token, pos: pos});
        try{
            const adminLog = new logbook({
                Sysemail: email,
                SysloginDate,
                SysloginTime

            })
            adminLog.save().then(()=>{
                console.log("date & time added successfully");
            }).catch((err)=>{
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
      res.status(500).send({ error: error.message });
      console.log(error);
    }
});

//SYSTEM ADMIN LOGIN LOGIN FUNCTION
router.post('/post/systemlogin', async (req, res) => {
    try {
      const {Sysemail, SysPassword, SysloginDate, SysloginTime} = req.body
      const pos = await sysadmin.findByCredentials(Sysemail, SysPassword)
      const token = await pos.generateAuthToken()
      res.status(200).send({token: token, pos: pos});
        try{
            const SysadminLog = new logbook({
                Sysemail,
                SysloginDate,
                SysloginTime

            })
            SysadminLog.save().then(()=>{
                console.log("date & time added successfully");
            }).catch((err)=>{
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
      res.status(500).send({ error: error.message });
      console.log(error);
    }
});

//System Admin profile
router.get("/profile", sysauth, async (req, res) => {
    try {

      res.status(201)

      res.send({ status: "User fetched", pos: req.pos});

    } catch (error) {

      res.status(500)

      res.send({ status: "Error with /profile", error: error.message });

    }

});

//Sub Admin profile
router.get("/profile", auth, async (req, res) => {
    try {

      res.status(201)

      res.send({ status: "User fetched", pos: req.pos});

    } catch (error) {

      res.status(500)

      res.send({ status: "Error with /profile", error: error.message });

    }
});



module.exports = router;

