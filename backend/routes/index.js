var express = require('express');
var router = express.Router();
var upload = require('jquery-file-upload-middleware');
var fs = require('fs');
var path = require('path');
var gmagic = require('gm');
var models = require("../models/index.js");
const config = require(__dirname + '/../config/server-config.js');
var gm = gmagic.subClass({imageMagick: true});
var conversion = require('phantom-html-to-pdf')();
var nodemailer = require('nodemailer');
var _ = require('lodash');
var url = require('url');
var base64Img = require('base64-img-promise');

var multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/../../dist/public/uploadTemp/'))
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadEditted = multer({
  storage: storage
}).single("imgFile");

router.post('/upload_editted/:id', function(req, res){
  var source = path.join(__dirname, "/../.tmp/", ""); // path where the editted image will be temporarily saved
  var imgName = path.join(path.parse(path.basename(url.parse(req.body.imgUrl).pathname)).name.replace('%20', '') + "_edit"); // the original name of image
  var destination = path.join(__dirname, "/../uploads/", req.params.id); // path where the editted image will be finally saved
  var thumbnailDestinataion = path.join(
    __dirname,
    "/../uploads/",
    req.params.id,
    "/thumbnail/"
  ); // path where the thumbnail of editted image will be finally saved
  var extension = "";
  var newUrl = "";
  var stat = 0;
  // Since the tui image editor uses canvas, the data is transferred in base64 format.
  base64Img
    .img(req.body.imgFile, source, imgName)
    .then(function(result) {
      // convert base64 image to image file.
      newUrl = result; // path where the editted image will be temporarily saved. it include the name of image
      extension = path.parse(newUrl).ext;
      destination = path.join(destination, imgName + extension)
      fs.copyFileSync(newUrl, destination); // copy the image file from temporarily folder to upload folder
    })
    .then(function(result) {
      try {
        fs.unlinkSync(newUrl); // delete the temporarily image file
      } catch (err) {
        console.log(err);
      }
    })
    .then(function(result) {
      stat = fs.statSync(destination)
    })
    .then(function(result) {
      gm(destination) // make thumbnail.
        .resize(90, 90, "^")
        .gravity("center")
        .extent(90, 90)
        .write(path.join(thumbnailDestinataion, imgName + extension), function(err) {
          if (err) console.log(err);
        });
      var url = req.protocol + "://" + req.get("host") + "/uploads/" + req.params.id + "/" + imgName + extension;
      var thumbnailUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.params.id + "/thumbnail/" + imgName + extension;
      res.status(200).json({
        "url": url,
        "thumbnailUrl" : thumbnailUrl,
        "name": imgName + extension,
        "size" : stat.size,
        "deleteType": "DELETE",
        "deleteUrl": url,
        "originalName" : imgName + extension,
        "type" : "image/" + extension.replace('.', '')
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send("error");
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  let templateDir = path.join(__dirname, '/../../dist/public/template_design/thumbnail');
  let filename = [];
  console.log(session);
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

        // var uploadHost = 'https://' + req.get('host');
        var uploadHost = 'https://toping.io';
        filename.push([cnt, title, paid, category, path.join('/template_design/thumbnail/', name)]);

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
        templates.push(currentTemplate);
      });
      console.log(templates);
      res.render('index',{
        title: "Toping",
        session: session,
        templates: templates,
      });

    });
  }).catch(err => {
    res.render('index', {
      title: "Toping",
      session: session
    });
  });

});


var listFiles = function (req, options, callback) {

    var files = [];
    var counter = 1;
    var finish = function () {
        if (!--counter)
            callback(files);
    };

    //var uploadHost = req.protocol + '://' + req.get('host');
    var uploadHost = "https://toping.io/";
    fs.readdir(options.uploadDir, _.bind(function (err, list) {
      console.log(options.uploadDir);
        _.each(list, function (name) {
            var stats = fs.statSync(options.uploadDir + '/' + name);
            if (stats.isFile()) {
                var file = {
                    name: name,
                    url: uploadHost + options.uploadUrl + '/' + name,
                    size: stats.size
                };
                _.each(options.imageVersions, function (value, version) {
                    counter++;
                    fs.exists(options.uploadDir + '/' + version + '/' + name, function (exists) {
                        if (exists)
                            file.thumbnailUrl = uploadHost + options.uploadUrl + '/' + version + '/' + name;
                        finish();
                    });
                });
                files.push(file);
            }
        }, this);
        finish();
    }, this));

};

var uploadOptions = {
  tmpDir: '.tmp',
  uploadDir: path.join(__dirname, '/../../dist/public/uploads'),
  //uploadDir: './uploads',
  uploadUrl: '/uploads',
  ssl: true,
  hostname: "toping.io/",
  imageVersions: { thumbnail: { width: 90, height: 90 } }
};

router.post('/save/:id', function(req, res, next) {
  let body = req.body;
  let session = req.session;
  console.log(session);
  if (req.params.id !== '0') {
    models.Save.findOne({
      where: {
        mdkey: body.mdkey,
        UserId: req.params.id
      },
      include: {model: models.User}
    }).then(result => {
      if(result === null) {
        models.Save.create({
          title: body.title,
          mdkey: body.mdkey,
          metadata: body.metadata,
          json: body.json,
          userID: req.params.id,
          html: body.html,
          UserId: session.uid
        }).then(result => {
          res.status(200).send("success");
        }).catch( err => {
          console.log(err);
          res.status(500).send("unauthenticated");
        });
      } else {
        models.Save.update(
          {
          mdkey: body.mdkey,
          metadata: body.metadata,
          json: body.json,
          userID: req.params.id,
          html: body.html
        }, {
          where: {mdkey: body.mdkey, userID: req.params.id}
        }
        ).then(result => {
          res.status(200).send("success");
        }).catch( err => {
          console.log(err);
          res.status(500).send("unauthenticated");
        });
      }
    }).catch( err => {
      consele.log(err)
    });

  }
});

router.post('/load', function(req, res, next) {
  let body = req.body;
  models.Save.findOne({
    where: {id : body.hash}
  }).then( result => {

    let metadata = result.dataValues.metadata;
    let mdkey = result.dataValues.mdkey;
    let metadataBuffer = new Buffer(metadata);
    let metadataString = metadataBuffer.toString('utf8');

    let json = result.dataValues.json;
    let jsonBuffer = new Buffer(json);
    let jsonString = jsonBuffer.toString('utf8');

    res.json({status: "Success", metadata: metadataString, mdkey: mdkey, json: jsonString});
  }).catch( err => {
    console.error(err);
    res.status(401).send("unauthenticated");
  });
});

router.get('/upload/:id', function(req, res) {
  // uploadOptions.uploadDir = './uploads/' + req.params.id;
  uploadOptions.uploadDir = path.join(__dirname, '/../../dist/public/uploads', req.params.id);
  uploadOptions.uploadUrl = '/uploads/' + req.params.id;
    listFiles(req, uploadOptions, function (files) {
console.log(files);
      res.json({ files: files });
    });
});

router.use('/upload/:id', function(req, res, next){
    console.log(req);
    upload.fileHandler({
        tmpDir: '.tmp',
        uploadDir: function () {
            return path.join(__dirname, '/../../dist/public/uploads', req.params.id);
        },
        uploadUrl: function () {
            return '/uploads/' + req.params.id;
        },
        ssl: true,
        hostname: "toping.io/",
        imageVersions: { thumbnail: { width: 90, height: 90 } },
    })(req, res, next);
});

// imgProcessorBackend + "?src=" + encodeURIComponent(src) + "&method=" + encodeURIComponent(method) + "&params=" + encodeURIComponent(width + "," + height);
router.get('/img/', function(req, res) {

    var params = req.query.params.split(',');
    if (req.query.method == 'placeholder') {
        // var out = gm(params[0], params[1], '#707070');
        // res.set('Content-Type', 'image/png');
        // var x = 0, y = 0;
        // var size = 40;
        // // stripes
        // while (y < params[1]) {
        //     out = out
        //       .fill('#808080')
        //       .drawPolygon([x, y], [x + size, y], [x + size*2, y + size], [x + size*2, y + size*2])
        //       .drawPolygon([x, y + size], [x + size, y + size*2], [x, y + size*2]);
        //     x = x + size*2;
        //     if (x > params[0]) { x = 0; y = y + size*2; }
        // }
        // // text
        // out.fill('#B0B0B0').fontSize(20).drawText(0, 0, params[0] + ' x ' + params[1], 'center').stream('png').pipe(res);

        var logoSrc = path.join(__dirname, "/../../dist/public/img/placeholder.png");
        console.log(logoSrc);
        var placeGm = gm(logoSrc);
        placeGm.format(function(err, format) {
          if (!err) {
            res.set('Content-Type', 'image/'+format.toLowerCase());
            placeGm.autoOrient().resize(params[0],params[1]+'^').gravity('Center').extent(params[0], params[1]+'>').stream().pipe(res);
          }
        })


    } else if (req.query.method == 'resize' || req.query.method == 'cover') {
        // NOTE: req.query.src is an URL but gm is ok with URLS.
        // We do parse it to localpath to avoid strict "securityPolicy" found in some ImageMagick install to prevent the manipulation
        var urlparsed = url.parse(req.query.src);
        // var src = "./"+decodeURI(urlparsed.pathname);

        var src = path.join(__dirname, '/../../dist/public/', decodeURI(urlparsed.pathname));
        var ir = gm(src);
        ir.format(function(err,format) {
            if (!err) {
                res.set('Content-Type', 'image/'+format.toLowerCase());
                if (req.query.method == 'resize') {
                    ir.autoOrient().resize(params[0] == 'null' ? null : params[0], params[1] == 'null' ? null : params[1]).stream().pipe(res);
                } else {
                    ir.autoOrient().resize(params[0],params[1]+'^').gravity('Center').extent(params[0], params[1]+'>').stream().pipe(res);
                }
            } else {
                console.error("ImageMagick failed to detect image format for", src, ". Error:", err);
                res.status(404).send('Error: '+err);
            }
        });

    }

});

router.post('/dl/', function(req, res) {
    var response = function(source) {

      if (req.body.action == 'download') {
          res.setHeader('Content-disposition', 'attachment; filename=' + req.body.filename);
          res.setHeader('Content-type', 'text/html');
          var text = '      body{ margin: auto; padding: 0; background: #f1f1f1;}';
          var text1 = '      body{ margin: auto; padding: 0; background: #f1f1f1;}';
          res.write(source.replace(text, text1));
          console.log(source);
          res.end();
      } else if (req.body.action == 'pdf') {
        res.setHeader('Content-disposition', 'attachment; filename=test.pdf');
        new Promise(function (resolve, reject) {
          conversion({html: source}, function(err, pdf) {
            var output = fs.createWriteStream('output.pdf')
            // pdf.stream.pipe(output);
            pdf.stream.pipe(res);
          });
        }).then(function(result) {
          res.end();
        });


      } else if (req.body.action == 'email') {
        console.log(req.body);
        console.log(typeof req.body.rcpt);
        var rcptToJson;
        if (req.body.isJson === 'true') {
          rcptToJson = JSON.parse(req.body.rcpt);
          console.log(rcptToJson[0]['이메일']);
          console.log(rcptToJson.length);
        } else {
          rcptToJson = null;
          console.log(req.body.rcpt);
        }
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'on@toping.io',
            pass: 'Mini0706!'
          }
        });
        var fromEmail = '';
        if(typeof req.body.sourceEmail !== 'undefined' && req.body.sourceEmail !== null && req.body.sourceEmail !== ''){
          fromEmail = req.body.sourceEmail;
        } else {
          fromEmail = 'on@toping.io'
        }
        console.log(fromEmail);
        if (rcptToJson === null) {
          var mailOptions = {
              from: '"toping" <on@toping.io>',
              to: req.body.rcpt, // list of receivers
              subject: req.body.subject, // Subject line
              html: source // html body
          };
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  console.log(error);
                  res.status(500).send('Error: '+error);
              } else {
                  console.log('Message sent: ' + info.response);
                  res.send('OK: '+info.response);
              }
          });
        } else {
          for(var i = 0; i < rcptToJson.length; i++) {
            var mailOptions = {
                from: ' <' + fromEmail + '>',
                to: rcptToJson[i]['이메일'], // list of receivers
                subject: req.body.subject, // Subject line
                html: source // html body
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.status(500).send('Error: '+error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
          }
          res.send('OK');
        }

      }

    };
    response(req.body.html);
});
// mosaico

module.exports = router;
