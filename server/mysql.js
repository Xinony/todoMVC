const moment = require("moment")
const express = require('express');
const router = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

const APIKEY_KEEP_TIME=60*1000*1000;//apikey有效时间
const API_CODE = {
    // API请求正常
    OK: '200',
    // API请求正常，数据异常
    ERR_DATA: '403',
    // API请求正常，空数据
    ERR_NO_DATA: '301',
    // API请求正常，登录异常
    ERR_LOGOUT: '401'
}
const connection = mysql.createConnection({
    host: 'localhost', //mysql连接ip地址
    user: 'root',
    password: 'Xino.0914', //mySql用户名密码
    database: 'todolist',
    port: '3306' //mysql连接端口
});

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());
connection.connect()

function checkapikey(userid,apikey,callback){
    try {
        var  sql = 'SELECT `apikey` FROM user WHERE userid =?';
        connection.query(sql,[userid],function (err, result){
            if(err){
                let data={
                    code: API_CODE.ERR_NO_DATA,
                    message: '数据库错误'
                };
                callback(data);
                return;
            }
            if(result[0]===undefined){
                let data={
                    code: API_CODE.ERR_LOGOUT,
                    message: '没有该用户'
                };
                callback(data);
            }
            else{
                const newapikey = Date.now();
                var getapikey=result[0].apikey;
                if(apikey === getapikey){
                    if(newapikey-apikey<APIKEY_KEEP_TIME){
                        let data={
                            code: API_CODE.OK,
                            message: '身份信息验证成功',
                        };
                        callback(data);
                    }
                    else{
                        let data={
                            code: API_CODE.ERR_LOGOUT,
                            message: '身份信息已过期，请重新登录！',
                        };
                        callback(data);
                    }

                }
                else
                {
                    let data = {
                        code: API_CODE.ERR_LOGOUT,
                        message: '身份信息错误，请重新登录！'
                    };
                    callback(data);
                }
            }
        });
    }catch (e) {
        console.log(e)
    }
}

router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Orign', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

router.post('/api/login', (req, res) => {
    try{
        var  sql = 'SELECT * FROM user WHERE username =?';
        connection.query(sql,[req.body.username],function (err, result){
            if(err){
                let data={
                    code:API_CODE.ERR_DATA,
                    message:'数据库错误'
                }
                res.send(data);
                return;
            }
            if(result[0]===undefined){
                let data={
                    code:API_CODE.ERR_NO_DATA,
                    message:'没有该用户'
                }
                res.send(data);
            }
            else{
                if(result[0].password === req.body.password){
                    let apikey = Date.now()
                    var sql1='UPDATE user SET `apikey`=?,`logintime`=? WHERE username=?';
                    connection.query(sql1,[apikey,moment().format('YYYY-MM-DD HH:mm:ss'),req.body.username],function (err, result1) {
                        if (err) {
                            let data={
                                code:API_CODE.ERR_LOGOUT,
                                message:'登录错误',
                            }
                            res.send(data);
                        }
                        else {
                            let data={
                                code:API_CODE.OK,
                                message:'登录成功',
                                data:result[0],
                                newapikey:apikey
                            }
                            res.send(data);
                        }
                    });
                }
                else
                {
                    let data={
                        code:API_CODE.ERR_DATA,
                        message:'用户名或密码错误'
                    }
                    res.send(data);
                }
            }

        });
    }catch (e) {
        console.log(e)
    }

})

router.post('/api/regist', (req, res) => {
    try{
        const  sql = 'SELECT * FROM user WHERE username ="'+req.body.username+'"';
        connection.query(sql,function (err, result){
            if(result[0]){
                let data={
                    code:API_CODE.ERR_DATA,
                    message:'该用户已存在'
                }
                res.send(data);
            }
            else{
                const apikey = Date.now();
                const logintime = moment().format('YYYY-MM-DD HH:mm:ss');
                const  sql1 = 'insert into user (username, password, usertype, apikey,logintime) value (?,?,"游客",?,?)';
                connection.query(sql1,[req.body.username, req.body.password,apikey,logintime],function (err, result){
                    if(err){
                        let data={
                            code:API_CODE.ERR_DATA,
                            message:'数据库错误'
                        }
                        res.send(data);
                        return;
                    }
                    let data={
                        code:API_CODE.OK,
                        messgae:'注册成功',
                        userInfo:{
                            userid:result.insertId,
                            username:req.body.username,
                            usertype:"游客",
                            apikey:apikey,
                            logintime:logintime
                        }
                    }
                    res.send(data);
                });
            }
        });
    }catch (e) {
        console.log(e)
    }
})

router.post('/api/getTodo', (req, res) => {
    try{
        checkapikey(req.body.userid, req.body.apikey, function (isApikey) {
            if (isApikey.code === API_CODE.OK) {
                const sql = 'SELECT * FROM list WHERE userid =? ';
                connection.query(sql, [req.body.userid], function (err, result) {
                    if (result) {
                        console.log(result)
                        let data = {
                            code: API_CODE.OK,
                            messgae: '获取任务成功',
                            data: result
                        }
                        res.send(data)
                    } else {
                        let data = {
                            code: API_CODE.ERR_NO_DATA,
                            data: '暂无数据'
                        }
                        res.send(data)
                    }
                });
            } else {
                res.send(isApikey)
            }
        })
    }catch (e) {
        console.log(e)
    }
})

router.post('/api/addTodo', (req, res) => {
    try{
        checkapikey(req.body.userid, req.body.apikey, function (isApikey) {
            if (isApikey.code === API_CODE.OK) {
                var sql = 'SELECT * FROM user WHERE userid =? ';
                connection.query(sql, [req.body.userid], function (err, result) {
                    if (result[0]) {
                        var sql = 'insert into list (`task`,`userid`,`key`,`creattime`) value (?,?,?,?)';
                        connection.query(sql, [req.body.task, req.body.userid, req.body.key, moment().format('YYYY-MM-DD HH:mm:ss')], function (err, result) {
                            if (err) {
                                let data = {
                                    code: API_CODE.ERR_DATA,
                                    data: '数据库错误'
                                }
                                res.send(data);
                                return;
                            }
                            let data = {
                                code: API_CODE.OK,
                                taskid: result.insertId
                            }
                            res.send(data);
                        });
                    } else {
                        let data = {
                            code: API_CODE.ERR_LOGOUT,
                            data: "该用户不存在"
                        }
                        res.send(data);
                    }
                });
            } else {
                res.send(isApikey)
            }
        })
    }catch (e) {
        console.log(e)
    }
})

router.post('/api/changeTodo', (req, res) => {
    try{
        checkapikey(req.body.userid, req.body.apikey, function (isApikey) {
            if (isApikey.code === API_CODE.OK) {
                var sql = 'SELECT * FROM user WHERE userid =?';
                connection.query(sql, [req.body.userid],function (err, result) {
                    if (result[0]) {
                        var sql = 'UPDATE list SET `isdone`=?,`task`=?,`key`=? WHERE taskid=?';
                        connection.query(sql, [req.body.isdone,req.body.task,req.body.key,req.body.taskid], function (err, result) {
                            if (err) {
                                let data = {
                                    code: API_CODE.ERR_DATA,
                                    message: '数据库错误'
                                }
                                res.send(data);
                                return;
                            }
                            console.log(result)
                            let data = {
                                code: API_CODE.OK,
                                message: '修改成功'
                            }
                            res.send(data);
                        });
                    } else {
                        let data = {
                            code: API_CODE.ERR_LOGOUT,
                            data: "该用户不存在"
                        }
                        res.send(data);
                    }
                })
            } else {
                res.send(isApikey)
            }
        })
    }catch (e) {
        console.log(e)
    }
})

router.post('/api/deleteTodo', (req, res) => {
    try{
        checkapikey(req.body.userid, req.body.apikey, function (isApikey) {
            if (isApikey.code === API_CODE.OK) {
                var sql = 'SELECT * FROM user WHERE userid =?';
                connection.query(sql, [req.body.userid], function (err, result) {
                    if (err) {
                        let data = {
                            code: API_CODE.ERR_DATA,
                            message: '数据库错误'
                        }
                        res.send(data);
                        return err;
                    }
                    if (result[0]) {
                        var sql1 = 'DELETE FROM list WHERE taskid=?';
                        connection.query(sql1, [req.body.taskid], function (err, result) {
                            if (err) {
                                let data = {
                                    code: API_CODE.ERR_DATA,
                                    message: '数据库错误'
                                }
                                res.send(data);
                                return err;
                            }
                            let data = {
                                code: API_CODE.OK,
                                message: '删除成功'
                            }
                            res.send(data);
                        });
                    }
                })
            } else {
                res.send(isApikey)
            }
        })
    }catch (e) {
        console.log(e)
    }
})

router.post('/api/collectLoadTime',(req,res)=>{
    try{
        var sql = 'insert into load_time (`loadtime`) value (?)';
        connection.query(sql, [req.body.loadtime], function (err, result) {
            if (err) {
                let data = {
                    code: API_CODE.ERR_DATA,
                    data: '数据库错误'
                }
                res.send(data);
                return;
            }
            let data = {
                code: API_CODE.OK,
                lid: result.insertId
            }
            res.send(data);
        });
    }catch (e) {
       console.log(e)
    }
})


let server = router.listen('8080', function(){
    const port = server.address().port;
    console.log('server starts....');
    console.log('*===============*');
    console.log('server is running at port', port);
})