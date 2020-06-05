const express = require('express');
const router = express();
const mysql = require('mysql');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

var connection = mysql.createConnection(    {
    host: 'localhost', //mysql连接ip地址
    user: 'root',
    password: 'Xino.0914', //mySql用户名密码
    database: 'todolist',
    port: '3306' //mysql连接端口
})

connection.connect()

router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Orign', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

router.get('/',(req,res) =>{
    console.log(req)
    return;
})

router.post('/login', (req, res) => {
    console.log(req.body)
    var  sql = 'SELECT * FROM user WHERE username ="'+req.body.username+'"';
    connection.query(sql,function (err, result){
        if(err){
            console.log('[Login ERROR] - ',err.message);
            return;
        }
        if(result[0]===undefined){
            res.send('没有该用户');
            console.log("没有该用户");
        }
        else{
            if(result[0].password===req.body.password){
                res.send(result[0]);
                console.log(result[0]);
            }else
            {
                res.send('用户名或密码错误');
                console.log("用户名或密码错误");
            }
        }

    });
})

router.post('/updateapikey', (req, res) => {
    var  sql = 'SELECT * FROM user WHERE username ="'+req.body.username+'"';
    connection.query(sql,function (err, result){
        if(err){
            console.log('[Login ERROR] - ',err.message);
            return;
        }
        console.log(result);
        console.log(result[0]);
        if(result[0]===undefined){
            res.send("没有该用户");
        }
        else{
            if(req.body.apikey<result[0].apikey+60*1000){
                res.send(result[0]);
                var sql='UPDATE user SET apikey="'+req.body.apikey+'" WHERE username='+req.body.username;
                connection.query(sql,function (err, result) {
                    if (err) {
                        console.log('[apiupdate ERROR] - ', err.message);
                    }
                });
                res.send("身份信息更新成功！")
            }
            else{
                res.send("身份信息已过期，请重新登陆！");
            }
        }

    });
})

router.post('/regist', (req, res) => {
    var  sql = 'SELECT * FROM user WHERE username ="'+req.body.username+'"';
    connection.query(sql,function (err, result){
        if(result[0]){
            res.send("该用户已存在");
        }
        else{
            var  sql = 'insert into user (username, password, usertype) value (?,?,"游客")';
            connection.query(sql,[req.body.username, req.body.password],function (err, result){
                if(err){
                    res.send("未知错误");
                    return;
                }
                console.log(result.insertId);
            });
        }
    });
})

let server = router.listen('8080', function(){
    const port = server.address().port;
    console.log('server starts....');
    console.log('*===============*');
    console.log('server is running at port', port);
})