var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var session    = require('express-session');
var flash = require('connect-flash');
var User = require('../modules/user.js');
var Post = require('../modules/post.js');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: '首页'
    });
    // res.render('index', {title: 'Express'});
});

router.get('/hello', function (req, res) {
    res.send('The time is ' + new Date().toString());
});

//start microblog part

index = function (req, res) {
    res.render('index', {
        title: '首页'
    });
};
user = function (req, res) {
};
post = function (req, res) {
};
reg = function (req, res) {
    res.render('reg', {
        title: '用户注册',
    });
};
doReg = function (req, res) {
    //检验用户两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
        console.log('两次输入的口令不一致');
        //req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body['password']).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password,
    });
        //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            //req.flash('error', err);
            console.log('===>'+err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err) {
            if (err) {
                //req.flash('error', err);
                console.log('===>'+err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            // req.flash('success', '注册成功');
            console.log('===>reg is succeed.');
            res.redirect('/');
        });
    });
};
login = function (req, res) {
    res.render('login', {
        title: '用户登入',
    });
};

doLogin = function (req, res) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username, function(err, user) {
        if (!user) {
            // req.flash('error', '用户不存在');
            console.log('===>user is not registered.')
            return res.redirect('/login');
        }
        if (user.password != password) {
            // req.flash('error', '用户口令错误');
            console.log('===>the password to the user is wrong.')
            return res.redirect('/login');
        }
        req.session.user = user;
        //req.flash('success', '登入成功');
        console.log("===>login succeed.")
        res.redirect('/');
    });
};
logout = function (req, res) {
    req.session.user = null;
    //req.flash('success', '登出成功');
    console.log('===>logout ok.')
    res.redirect('/');
};
//end microblog part


module.exports = router;
