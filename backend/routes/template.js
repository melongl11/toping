var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var models = require("../models/index.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  let templateDir = path.join(__dirname, '/../../dist/public/template_design/thumbnail');
  let filename = [];
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
      res.render('template/template',{
        title: "Toping 템플릿",
        session: session,
        templates: templates,
      });

    });
  }).catch(err => {
    console.log(err);
    res.redirect('/ontoping/');
  });
});

router.get('/:id', function(req, res, next) {
  let session = req.session;
  let templateDir = path.join(__dirname, '/../../dist/public/template_design/thumbnail/');
  let filename = [];
  let cnt = 0;
  models.Save.findOne({
    where:{ id: parseInt(req.params.id) }
  }).then( result => {
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

        if (result.dataValues.title === title) {
          // var uploadHost = 'https://' + req.get('host');
          var uploadHost = 'https://toping.io';
          filename.push([title, category, path.join('/template_design/thumbnail/', name), path.join('/template_design/', name.replace(extension, '') + '.html')]);
          res.render('template/template_view',{
            title: "Toping 템플릿",
            session: session,
            templates: filename,
          });
        }
      })

    });
  }).catch(err => {
    console.log(err);
    res.redirect('/template');
  })

});


module.exports = router;
