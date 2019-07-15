var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;

  if (session.email) {
    res.render('mypage/account', {
      title: "내 정보",
      session: session
    });
  } else {
    res.redirect('/');
  }

});

router.get('/template_history', function(req, res, next) {
  let session = req.session;
  if (session.email) {
    models.Save.findAll({
      where: {UserId: session.uid }
    }).then(result => {
      console.log(result);
      result.forEach(function (item, index, array) {
        item.dataValues.createdAt = dateTrans(item.dataValues.createdAt);
      });
      res.render('mypage/template_history', {
        title: "템플릿 제작내역",
        session: session,
        histories: result,
      });
    }).catch(err => {
      console.log(err);
      res.status(401).send("unauthenticated")
    });
  } else {
    res.redirect('/');
  }
});

router.post('/template_history/:id', function(req, res, next) {
  let session = req.session;
  if (session.email) {
    models.Save.destroy({
      where: {id: req.params.id}
    }).then(result => {
      res.redirect('/mypage/template_history');
    }).catch(err => {
      console.log(err);
      res.redirect('/');
    })
  } else {
    res.redirect('/');
  }
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
