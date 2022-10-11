var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("../dbconnect");
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const crypto = require('../cryptosetting');
// const _Queryusers = require('../query/queryUsers.json');
const Queryusers = require('../query/queryUser');
const _Queryusers = new Queryusers();
var {v4: uuidv4} = require("uuid");
var jwt = require('jsonwebtoken');
var secret = "samza55wysfsa";


router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

    
connection.query(`SELECT NOW();`,(err, results)=>{
     if(err) throw err;
        console.log("connect database-->",results);
            
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

router.get('/selectMember',function(req,res,next){   
    
    let query = connection.query(_Queryusers.selectMember(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select all member

router.post('/insertTrainer',function(req,res,next){   
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
        res.send(results);
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

router.post('/selectHistory',function(req,res,next){   
    const {users_id} = req.body
    let query = connection.query(_Queryusers.select_history(),[users_id],(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });   

}); // insert buy history

router.get('/selectBuy_history',function(req,res,next){   
    const {users_id, buy_list, product_price} = req.body
    let query = connection.query(_Queryusers.select_trainer_detail(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select_trainer_all

router.post('/postusers', (req,res,next) =>{   
    const {firstname, lastname, username, password, email, phone_number, age, role} = req.body
    
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
                    ], (err, rr) => {
                        if (err)
                            throw err;
                        res.send("Add user success!");
                        console.log("Add user success!");
                        res.status(200).json(rr);

                    });
                    // console.log(results);
                } else {
                    console.log("register fail");
                    res.send("register fail");

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

        if(err){res.json ({status: 'error', message: err}); return}
        if(users.lenght == 0){res.json({status: 'error', message: 'no user found'}); return}

        if(password === crypto.decrypt( users[0].password)) {
 
                var token = jwt.sign({ 
                    username: users[0].username, 
                    password: users[0].password,
                    firstname:  users[0].firstname,
                    lastname:  users[0].lastname,    
                }, secret, {expiresIn: '1h'});
                res.json({status: 'Ok', message: 'login success', token});
            }else{
                res.json({status: 'error', message: 'login failed'});
        }
    });


});


router.post('/authen', (req, res)=>{
    try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret);
    res.json({status: 'Ok',decoded});
    }catch(err){

        res.json({status: 'error', message: err.message});
    }


});
module.exports = router;