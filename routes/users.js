var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const cookieParser = require("cookie-parser");

var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const connection = require("../dbconnect");
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const crypto = require('../cryptosetting');
// const _Queryusers = require('../query/queryUsers.json');
const Queryusers = require('../query/queryUser');
const _Queryusers = new Queryusers();
var {v4: uuidv4} = require("uuid");
var jwt = require('jsonwebtoken');
const _auth = require('./middleware/auth');
var secret = "samza55wysfsa";

router.use(cookieParser());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
    
connection.query(`SELECT NOW();`,(err)=>{
     if (err) throw err;  
});  //เช็คการเชื่อมต่อกับ database  
    

router.get('/',(req,res,next)=>{   
       
        res.send("Hello Users Bro!"); 
    }); // เช็คว่าอยู่ใน router users 

router.get('/getuser',function(req,res,next){   
    
    let query = connection.query("SELECT * FROM users;",(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // getuser

router.get('/selectMember',_auth,function(req,res,next){   
    
    let query = connection.query(_Queryusers.selectMember(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select all member

router.post('/insertTrainer',_auth,function(req,res,next){   
    const {users_id, detail, hire_price, hire_date} = req.body
    let query = connection.query(_Queryusers.insertTrainer(),[
        uuidv4(),
        users_id,
        detail,
        hire_price,
        new Date(),
    ],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // insert trainer

router.post('/insertMember',function(req,res,next){   
    const {list_member, price_member} = req.body
    let query = connection.query(_Queryusers.insertMember(),[
        uuidv4(),
        list_member,
        price_member
    ],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // insert member

router.post('/insertWhey',function(req,res,next){   
    const {name_whey, price_whey} = req.body
    let query = connection.query(_Queryusers.insertWhey(),[
        uuidv4(),
        name_whey,
        price_whey
    ],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // insert whey

router.get('/select_trainer_all',function(req,res,next){   
    
    let query = connection.query(_Queryusers.select_trainer_detail(),(err, results)=>{
        if(err) throw err;
        res.json(results);
        console.log(results);
    });    
    
}); // select_trainer_all

router.post('/insertHistory',function(req,res,next){   
    const {users_id, buy_list, product_price} = req.body
    let query = connection.query(_Queryusers.insert_history(),[
        uuidv4(),
        users_id,
        buy_list,
        product_price
    ],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });   

}); // insert buy history

router.post('/selectHistory',_auth,function(req,res,next){   
    const {users_id} = req.body
    let query = connection.query(_Queryusers.select_history(),[users_id],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });   

}); // insert buy history

router.get('/selectBuy_history',_auth,function(req,res,next){   
    const {users_id, buy_list, product_price} = req.body
    let query = connection.query(_Queryusers.select_trainer_detail(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select_trainer_all

router.post('/postusers', (req,res,next) =>{   
    const {firstname, lastname, username, password,repassword, email, phone_number, age, role= "ลูกค้า", Token} = req.body
        if(password != repassword){
            res.json({status: 'error', message: 'mismatch password'});
        }
        try {
            let data = connection.query("SELECT username, email, phone_number FROM users WHERE username=? OR email=? OR phone_number=? ;", [username, email, phone_number], (err, results) => {

                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }

                if (results == 0) {

                    let data_regis = connection.query(_Queryusers.insertUser(), [
                        uuidv4(),
                        firstname,
                        lastname,
                        username,
                        crypto.encrypt(password),
                        email,
                        phone_number,
                        age,
                        role,
                        Token
                    ], (err, rr) => {
                        if (err)
                            throw err;
                        res.json({status: 'Ok', message: 'register successfully'});

                    });
                    // console.log(results);
                } else {
                    res.json({status: 'error', message: 'register failed'});

                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
   

}); // register

router.post('/login', (req, res)=>{
    const {username, password} = req.body
    connection.query(_Queryusers.select_login(),[username],(err, users)=>{
        try{ 
        if(!err){
        if(err){res.json ({status: 'error', message: err}); return}
        if(users.lenght == 0){res.json({status: 'error', message: 'no user found'}); return}
       
        if(password === crypto.decrypt( users[0].password) && username === users[0].username) {
                var token = jwt.sign({ 
                    username: users[0].username, 
                    password: users[0].password,
                    firstname:  users[0].firstname,
                    lastname:  users[0].lastname,    
                }, secret, {expiresIn: '1h'});

                connection.query("UPDATE users SET Token=? WHERE username=?;",[token, users[0].username]);
                // res.session(username,password, token);
                res.json({status: 'Ok', message: 'login successfully', token});
            }else{
                res.json({status: 'error', message: 'login failed'});
            }
        }else{
            res.json({status: 'error', message: err });
            res.json({status: 'error', message: 'login failed'});
        }
        }
    catch(err){
        res.json({status: 'error', message: ' failed'});
        }
    })
});


router.post('/authen', (req, res)=>{

    try{
        const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.json({status: 'Ok',decoded});
    }catch(err){

        res.json({status: 'error', message: err.message});
    }

});

router.post('/welcome', _auth ,(req, res)=>{

    res.status(200).send('Welcome');
})



  
module.exports = router;