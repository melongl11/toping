var express = require('express');
var router = express.Router();

/* GET 주요 기능 page. */
router.get('/production', function(req, res, next) {
  let session = req.session;
  res.render('introduction/topingsolution', {
    title: "토핑 솔루션",
    session: session
  });
});

router.get('/prices', function(req, res, next) {
  let session = req.session;
  res.render('introduction/prices', {
    title: "요금제",
    session: session
  });
});

/* GET 서비스 신청하기 page. */
router.get('/apply', function(req, res, next) {
  let session = req.session;
  res.render('index', {
    title: "서비스 신청하기",
    session: session
  });
});

module.exports = router;
