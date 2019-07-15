var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/sign-up', function(req, res, next) {
  let session = req.session;
  if (!session.email){
    res.render('sign-up', {
      title: "회원가입",
      session: session
    });
  } else {
    res.redirect('/');
  }
});


router.post('/sign-up', function(req, res, next) {
  let body = req.body;
  let session = req.session;
    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest("hex");
    console.log(hashPassword);
    models.User.create({
        name: body.userName,
        email: body.userEmail,
        phone: body.phone,
        password: hashPassword,
        salt: salt
    })
    .then( result => {
        console.log(result.dataValues.id);
        req.session.email = body.userEmail;
        req.session.name = body.userName;
        req.session.tier = 1;
        fs.mkdirSync(path.join(__dirname, '/../../dist/public/uploads', result.dataValues.id.toString()));
        fs.mkdirSync(path.join(__dirname, '/../../dist/public/uploads', result.dataValues.id.toString(), '/thumbnail'));
        res.status(200).send("success")
    })
    .catch( err => {
        console.log(err);
        res.status(500).send("unauthenticated")
    });
});

router.get('/login',function(req, res, next){
  let session = req.session;
  if(!session.email) {
  	res.render('login', {
  		title: "로그인",
      session: session
  	});
  } else {
    res.redirect('/');
  }
});

router.post("/login", function(req,res,next){
    let body = req.body;
    let session = req.session;
    console.log(session);
    models.User.findOne({
        where: {email : body.userEmail}
    })
    .then( result => {
      console.log(result.dataValues);
        let dbPassword = result.dataValues.password;

        let inputPassword = body.password;
        let salt = result.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

        if(dbPassword === hashPassword){
            console.log("비밀번호 일치");
            req.session.email = body.userEmail;
            req.session.uid = result.id;
            req.session.name = result.name;
            console.log(result.name);
            console.log(result.id);
            res.json({status: "Success", redirect: '/', uid: result.id});
        }
        else{
            console.log("비밀번호 불일치");
            res.status(401).send("unauthenticated")
        }
    }).catch( err => {
        console.log(err);
        res.status(401).send("unauthenticated")
    });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect('/');
});

router.post('/changepassword', function(req, res, next){
  let body = req.body;
  let session = req.session;
  console.log(session);
  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash('sha512').update(inputPassword + salt).digest("hex");
  models.User.update(
    {
      salt: salt,
      password: hashPassword
    },
    {
      where: {uid : session.uid},
      returning: true
    }
  )
  .then( result => {
    res.redirect('/mypage');
  }).catch( err => {
      console.log(err);
      res.status(401).send("unauthenticated")
  });
})




module.exports = router;
