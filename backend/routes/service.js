var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET home page. */
router.get('/cs', function(req, res, next) {
  let session = req.session;
  if (session.email) {
    models.Qna.findAll({
      where: {UserId: session.uid}
    }).then(result => {
      if (Array.isArray(result)) {
        result.forEach(function (item, index, array) {
          item.dataValues.createdAt = dateTrans(item.dataValues.createdAt);
        });
      } else {
        result.dataValues.createdAt = dateTrans(result.dataValues.createdAt);
      }
      res.render('service/csnotice', {
        title: 'Q&A',
        session: session,
        qnas: result,
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

router.get('/cs/:id', function(req, res, next) {
  let session = req.session;
  if (session.email) {
    models.Qna.findOne({
      where: {id: req.params.id},
      include: {model: models.User}
    }).then(result => {
      console.log(result);
      result.dataValues.createdAt = dateTrans(result.dataValues.createdAt);
      result.dataValues.updatedAt = dateTrans(result.dataValues.updatedAt);

      res.render('service/csview', {
        title: 'Q&A',
        session: session,
        qna: result,
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

router.get('/question', function(req, res, next) {
  let session = req.session;
  res.render('service/cswrite', {
    title: "Q&A",
    session: session
  });
});


router.post('/question', function(req, res, next) {
  let session = req.session;
  let body = req.body;
  console.log(body);
  if(session) {
    models.Qna.create({
      title: body.title,
      inqeuiry: body.description,
      UserId: session.uid
    }).then(result => {
      res.redirect('/cs')
    }).catch(err => {
      console.log(err);
      res.redirect('/');
    })
  } else{
    res.redirect('/');
  }
});


router.get('/qna', function(req, res, next) {
  let session = req.session;
  res.render('service/cscenter', {
    title: "고객 문의",
    session: session
  });
});

router.get('/faq', function(req, res, next) {
  let session = req.session;
  models.Faq.findAll({

  }).then(result => {
    res.render('service/faq', {
      title: "FAQ",
      session: session,
      faqs: result
    })
  }).catch(err =>{
    res.redirect('/');
  });
});

router.get('/contact', function(req, res, next) {
  let session = req.session;
  res.render('service/contact', {
    title: "고객센터",
    session: session
  });
});


router.get('/notice/:id', function(req, res, next) {
  let session = req.session;
  let paramID = req.params.id;
  models.Notice.findOne({
    where: {id: paramID}
  }).then(result => {
    result.dataValues.createdAt = dateTrans(result.dataValues.createdAt);
    res.render('service/notice_view', {
      title: "공지사항",
      session: session,
      notice: result,
    })
  }).catch(err => {
    console.log(err);
    res.redirect('/service/notice');
  })
});

router.get('/notice', function(req, res, next) {
  let session = req.session;
  models.Notice.findAll({

  }).then(result=> {
    console.log(result);
    result.forEach(function (item, index, array) {
      item.dataValues.createdAt = dateTrans(item.dataValues.createdAt);
      console.log(item.dataValues.createdAt);
    });
    res.render('service/notice', {
      title: "공지사항",
      session: session,
      notices: result,
    });
  }).catch(err=> {
    console.log(err);
    res.redirect('/');
  });

});

router.get('/agreement', function(req, res, next) {
  let session = req.session;
  res.render('service/agreement', {
    title: "이용약관",
    session: session
  });
});


router.get('/privacy', function(req, res, next) {
  let session = req.session;
  res.render('service/privacy', {
    title: "개인정보취급방침",
    session: session
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
