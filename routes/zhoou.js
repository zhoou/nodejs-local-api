var low = require('lowdb');
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:jsonUrl', function (req, res, next) {
    //文件名称
    var jsonUrl = req.params.jsonUrl,
        jsonName = './data/' + jsonUrl + '.json';
    var read = new Promise(function (resolve, reject) {
        resolve(fs.readFileSync(jsonName));
    });
    read.then(function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.json(JSON.parse(response));
    }).catch(function (response) {
        res.render('404');
    })
});

module.exports = router;