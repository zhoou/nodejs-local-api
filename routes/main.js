var express = require('express');
var router = express.Router();
var fs = require('fs');
var low = require('lowdb');
var path = require('path');

router.get('/', function (req, res, next) {
    var author = req.query.author;
    var jsonName = './data/apilists.json';
    var read = new Promise(function (resolve, reject) {
        resolve(fs.readFileSync(jsonName));
    });
    read.then(function (response) {
        response = JSON.parse(response);
        if (response.dataList) {
            res.render('main', { haveList: true, lists: response.dataList, txt: 'hello, express1' })
        } else {
            res.render('main', { haveList: false, lists: [], txt: 'hello, express2' })
        }
    }).catch(function (response) {
        res.render('main', { haveList: false, lists: [], txt: 'hello, express3' })
    });
});

// GET /main/create 新增API页
router.get('/create', function (req, res, next) {
    res.render('create', { errMsg: '' });
});

// 提交API
router.post('/', function (req, res, next) {
    var name = req.fields.name;
    var param = req.fields.param;
    var descript = req.fields.funcdescript;

    // console.log(req.files.jsonfile.path.split(path.sep).pop());
    // 文件重命名
    var reNameFile = path.join(__dirname, '../data/' + req.files.jsonfile.name);
    // 判断文件是否存在
    fs.access(reNameFile, (err) => {
        if (!err) {
            console.error('myfile already exists');
            return res.render('create', { errMsg: '文件已存在！file already exists！' });
        } else {
            fs.renameSync(req.files.jsonfile.path, reNameFile);
            // 校验参数
            try {
                if (!name.length) {
                    throw new Error('请填写API名称！');
                }
                if (!descript.length) {
                    throw new Error('请填写功能描述！');
                }
                if (!req.files.jsonfile.name) {
                    throw new Error('请上传json数据文件！');
                }
            } catch (e) {
                // 新增失败，异步删除上传的文件
                fs.unlink(reNameFile);
                req.flash('error', e.message);
                return res.render('create', { errMsg: '' });
            }

            var db = low(path.join(__dirname, '../data/apilists.json'));
            db.get('dataList')
                .push({ key: randomId(), name: '/zhoou/' + name, param: param, descript: descript, filePath: req.files.jsonfile.name })
                .write();
            return res.redirect('/main');
        }
    });
});

//编辑接口页面
router.get('/:id/edit', function (req, res) {
    //文件名称其实就是url最后的参数
    var id = req.params.id,
        jsonName = './data/apilists.json';
    if (!id) {
        res.redirect('/');
    } else {
        try {
            var db = low(path.join(__dirname, '../data/apilists.json'));
            var data = db.get('dataList')
                .find({ key: id })
                .value();
            res.render('edit', { data: data, errMsg: "" });
        } catch (e) {
            res.render('404');
        }
    }
});

// POST /posts/:postId/edit 更新api信息
router.post('/:postId/edit', function (req, res, next) {
    var postId = req.params.postId;
    var name = req.fields.name;
    var param = req.fields.param;
    var descript = req.fields.funcdescript.trim();
    try {
        var db = low(path.join(__dirname, '../data/apilists.json'));
        db.get('dataList')
            .find({ key: postId })
            .assign({ name: '/zhoou/' + name, param: param, descript: descript })
            .write();
        res.redirect('/');
    } catch (e) {
        res.render('404');
    }

});

// POST /posts/:postId/remove 删除api信息
router.get('/:postId/remove', function (req, res, next) {
    var postId = req.params.postId;
    //var filename = req.params.filePath;
    //console.log("=======================");
    try {
        var fpath = path.join(__dirname, '../data/' + filename + '.json');
        //fs.unlink(fpath);
        var db = low(fpath);
        db.get('dataList')
            .remove({ key: postId })
            .write();
        res.redirect('/');
    } catch (e) {
        res.render('404');
    }
})

function randomId() {
    var x = '0123456789abcdefghijklmnopqrstuvwxyz';
    var tmp = "";
    for (var i = 0; i < 6; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
}

module.exports = router;

