const router = require("express").Router();
const Council = require('../modelSchema/educounDetails');
const Login = require('../modelSchema/userLogin');
const jwt = require('jsonwebtoken')

const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({storage: storage})
// fileFilter: (req,file,cb)=>{
//     if(file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' || file.mimetype=='image/png'){
//         cb(null,true)
//     }
//     else{
//         cb(null, false);
//         return cb(new Error('Only jpeg, jpg, png is allowed'))
//     }
// }})


//To Insert values inside mongodb database for Astrology Section
router.post("/details", async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
    }catch(err){
        console.log(err)
        res.status(401).json({message: "Unauthorized User"})
    }
        try{
            const check = await Login.findById(req.userId)
          if(!check.pack_status)
            {
            const newUser = new Council({
                name: req.body.name,
                dob: req.body.dob,
                marks_12: req.body.marks_12,
                marks_10: req.body.marks_10
            });
            if((req.file)){
                newUser.marksheet_10 = req.file.filename
                newUser.marksheet_12 = req.file.filename
            }
            await Login.updateOne({pack_status: true})
                newUser.save();
                res.json(newUser)
        }
        else {
            res.json({message: "Already has one package"})
        }
        } catch(err) {
            console.log(err);
        }
});

router.get("/fetchConcilDetails", async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }

        const check = await Astro.findOne({userId: req.userId})
        res.send(check)
        
    }catch(err){
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;