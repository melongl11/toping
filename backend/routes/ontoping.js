var express = require('express');
var models = require("../models/index.js");
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs');

/* GET 주요 기능 page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  res.render('ontoping/index', {
    title: "관리자 페이지",
    session: session
  });
});

router.post("/", function(req,res,next){
    let body = req.body;

    models.Admin.find({
        where: {id : body.id}
    })
    .then( result => {
        let dbPassword = result.dataValues.password;

        let inputPassword = body.password;

        if(dbPassword === inputPassword){
            console.log("비밀번호 일치");
            req.session.admin = body.id;
            /*
            res.cookie("user", body.userEmail, {
              expires: new Date(Date.now() + 900000),
              httpOnly: true
            });
            */
            res.redirect("/ontoping/notice");
        }
        else{
            console.log("비밀번호 불일치");
            res.redirect("/ontoping/");
        }
    })
    .catch( err => {
        console.log(err);
    });
});


router.get('/membermanage', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    models.User.findAll({

    }).then( result => {
      res.render('ontoping/manage_member', {
        title: '멤버 관리',
        session: session,
        users: result,
      })
    }).catch( err =>{
      console.log(err);
      res.redirect('/ontoping/');
    })
  } else {
    res.redirect('/ontoping/');
  }
});

router.post('/membermanage/delete/:id', function(req, res, next) {
  let postID = req.params.id;
  models.User.destroy({
    where: {id: postID}
  }).then(result => {
      res.redirect('/ontoping/membermanage/');
  }).catch(err => {
    console.log(err);
    res.redirect('/ontoping/');
  })
})


router.get('/faq', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    models.Faq.findAll({

    }).then(result => {
      res.render('ontoping/faq', {
        title:'FAQ 확인',
        session: session,
        faqs: result,
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/ontoping');
    })
  } else {
    res.redirect('/ontoping');
  }
})

router.get('/faq/edit', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    res.render('ontoping/editfaq', {
      title:'FAQ 확인',
      session: session
    });
  } else {
    res.redirect('/ontoping');
  }
})

router.post('/faq/edit', function(req, res, next) {
  let session = req.session;
  let body = req.body;
  if (session.admin) {

    models.Faq.create({
      title: body.title,
      description: body.description,
      category: body.category,
      lowerCategory: body.lowerCategory
    }).then(result => {
      res.redirect('/ontoping/faq');
    }).catch(err => {
      console.log(err);
      res.redirect('/ontoping');
    })


  } else {
    res.redirect('/ontoping');
  }
});

router.get('/deletefaq/:id', function(req, res, next) {
  let session = req.session;
  let body = req.body;

  if(session.admin) {
    models.Faq.destroy({
      where: {id: req.params.id}
    }).then(result => {
      res.redirect('/ontoping/faq');
    }).catch(err => {
      res.redirect('/ontoping/faq');
    })

  } else {
    res.redirect('/')
  }
});

router.get('/contact', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    models.Qna.findAll({
      where: {answer: null},
      include: {model: models.User}
    }).then(result => {
      result.forEach(function (item, index, array) {
        item.dataValues.createdAt = dateTrans(item.dataValues.createdAt);
      });

      res.render('ontoping/contact', {
        title: '문의사항 확인',
        session: session,
        qnas: result,
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/ontoping');
    });
  } else {
    res.redirect('/ontoping');
  }
});

router.get('/contact/:id', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    models.Qna.findOne({
      where: {id: req.params.id},
      include: {model: models.User}
    }).then(result => {
      result.dataValues.createdAt = dateTrans(result.dataValues.createdAt);
      res.render('ontoping/contactview', {
        title: '문의사항 확인',
        session: session,
        qna: result,
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/ontoping');
    });
  } else {
    res.redirect('/ontoping');
  }
});

router.post('/contact/:id', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    models.Qna.update(
      {answer: req.body.description},
      {
        where: {id: req.params.id},
        returning: true
      }
    ).then(result => {
      models.Qna.findAll({
        where: {answer: null},
        include: {model: models.User}
      }).then(result => {
        result.forEach(function (item, index, array) {
          item.dataValues.createdAt = dateTrans(item.dataValues.createdAt);
        });

        res.render('ontoping/contact', {
          title: '문의사항 확인',
          session: session,
          qnas: result,
        });
      }).catch(err => {
        console.log(err);
        res.redirect('/ontoping');
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/ontoping');
    });
  } else {
    res.redirect('/ontoping');
  }
});

router.post('/notice/edit', function(req, res, next) {
    let body = req.body;

    models.Notice.create({
        title: body.title,
        description: body.description,
    })
    .then( result => {
        res.redirect("/ontoping/notice");
    })
    .catch( err => {
        console.log(err);
    });
});

router.get('/notice/edit', function(req, res, next) {
  let session = req.session;
  if (session.admin) {
    res.render('ontoping/editnotice', {
      title: '공지사항 추가',
      session: session,
    });
  } else {
    res.redirect('/ontoping/');
  }
});


/* GET 서비스 신청하기 page. */
router.get('/notice', function(req, res, next) {
  let session = req.session;
  console.log(session);
  if (session.admin) {
    models.Notice.findAll({

    }).then( result => {
      res.render('ontoping/notice', {
        title: '공지사항 관리',
        session: session,
        notices: result,
      })
    }).catch( function(err) {
      console.log(err);
      res.redirect('/ontoping/');
    })

  } else {
    res.redirect('/ontoping/');
  }
});


router.get('/manual',function(req,res,next ){
  let session = req.session;
  let manualDir = path.join(__dirname, '/../../dist/public/manual');
  let manualThumbnailDir = path.join(__dirname, '/../../dist/public/manual/thumbnail');
  let filename = [];
  let cnt = 0;
  fs.readdir(manualThumbnailDir, function(error, filelist) {
    filelist.forEach(function(name) {
      var extension = path.extname(name);
      var separator = name.indexOf('!');
      var category = name.substring(0, separator);
      var title = name.replace(extension, '');
      title = title.replace(category+'!', '');
      console.log(name, extension);
      console.log(name.replace(extension, ''));
      cnt += 1;
      var uploadHost = 'https://' + req.get('host');
      filename.push([cnt, title, category, path.join('/manual/thumbnail', name)]);

    })
    res.render('ontoping/manual',{
      title: "매뉴얼",
      session: session,
      manuals: filename,
    });
  });

});

router.get('/manual/edit',function(req,res,next ){
  let session = req.session;
  res.render('ontoping/editmanual',{
    title: "매뉴얼 작성",
    session: session
  });
});


var manualStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    var extension = path.extname(file.originalname);
    if (extension === '.html') {
        callback(null, path.join(__dirname, '/../../dist/public/manual'));
    }
    else {
      callback(null, path.join(__dirname, '/../../dist/public/manual/thumbnail'));
    }
  },
  filename: function(req, file, callback) {
    var extension = path.extname(file.originalname);
    callback(null, req.body.category2 + '!' + req.body.manual_title + extension);
  }
});

var manualUpload = multer({
  storage: manualStorage
});


router.post('/manual/edit', manualUpload.fields([{name: 'thumbnail_image'}, {name: 'html_file'}]), function(req, res, next) {
  var files = req.files;

  res.redirect('/ontoping/manual');
});


var templateStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    var extension = path.extname(file.originalname);
    if (extension === '.html') {
        callback(null, path.join(__dirname, '/../../dist/public/template_design/'));
    }
    else {
      callback(null, path.join(__dirname, '/../../dist/public/template_design/thumbnail'));
    }

  },
  filename: function(req, file, callback) {
    var extension = path.extname(file.originalname);
    callback(null, req.body.paid + '_' + req.body.category + '_' + req.params.id + extension);

  }
});

var templateUpload = multer({
  storage: templateStorage
});

router.post('/template/edit/:id', templateUpload.fields([{name: 'thumbnail_image'}, {name: 'html_file'}]), function(req, res, next) {
  res.redirect('/ontoping/template');
});


router.get('/template/edit/:id',function(req,res,next ){
  let session = req.session;
  res.render('ontoping/edittemplate',{
    title: "템플릿 작성",
    session: session
  });
});


router.get('/template',function(req,res,next ){
  let templateDir = path.join(__dirname, '/../../dist/public/template_design');
  let filename = [];
  let cnt = 0;
  let session = req.session;
  models.Save.findAll({
    include: {model: models.User, where: {tier: 99999}},
  }).then(result => {
    console.log(result);
    fs.readdir(templateDir, function(error, filelist) {
      filelist.forEach(function(name) {
        var extension = path.extname(name);
        var separator = name.indexOf('_');
        var paid = name.substring(0, separator);
        var namePrime = name.substring(separator + 1);
        separator = namePrime.indexOf('_');
        var category = namePrime.substring(0, separator);
        var title = name.replace(extension, '');
        title = title.replace(paid+'_'+category+'_', '');

        var uploadHost = 'https://' + req.get('host');
        filename.push([cnt, title, paid, category, path.join(uploadHost, '/template_design/thumbnail', name)]);

      });
      console.log(filename);
      var templates = [];
      var cnt = 0;
      result.forEach(function (item, index, array) {
        var currentTemplate = [];
        var tmp = 0;
        cnt += 1;
        filename.forEach(function(name) {
          if(name[1] === item.dataValues.title) {
              currentTemplate.push(cnt);
              currentTemplate.push(name[1]);
              currentTemplate.push(name[2]);
              currentTemplate.push(name[3]);
              currentTemplate.push(name[4]);
              currentTemplate.push(item.dataValues.id);
              tmp = 1
          }
        });
        if(tmp == 0) {
          currentTemplate.push(cnt);
          currentTemplate.push(item.dataValues.title);
          currentTemplate.push("free");
          currentTemplate.push("프로모션");
          currentTemplate.push('/');
          currentTemplate.push(item.dataValues.id);
        }
        templates.push(currentTemplate);
      });
      console.log(templates);
      res.render('ontoping/template',{
        title: "매뉴얼",
        session: session,
        templates: templates,
      });

    });
  }).catch(err => {
    console.log(err);
    res.redirect('/ontoping/');
  });
});


function dateTrans(date) {
  var d = new Date(date);
  var month = '' + (d.getMonth() + 1);
  var day = '' + (d.getDate());
  var year = '' + (d.getFullYear());
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('.');
}

module.exports = router;
