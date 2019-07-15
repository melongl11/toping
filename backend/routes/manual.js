var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/edit', function(req, res, next) {
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
      // var uploadHost = 'https://' + req.get('host');
      var uploadHost = 'https://toping.io';
      filename.push([title, category, path.join('/manual/thumbnail/', name), cnt]);

    })
    res.render('manual/manual',{
      title: "Toping 메뉴얼",
      session: session,
      manuals: filename,
    });
  });
});

router.get('/:id', function(req, res, next) {
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
      if (parseInt(req.params.id) === cnt) {
        // var uploadHost = 'https://' + req.get('host');
        var uploadHost = 'https://toping.io';
        filename.push([title, category, path.join('/manual/thumbnail', name), path.join('/manual/', name.replace(extension, '') + '.html')]);
        res.render('manual/manual_view',{
          title: "Toping 메뉴얼",
          session: session,
          manuals: filename,
        });
      }
    })

  });
});


module.exports = router;
