var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("../dbconnect");
const dotenv = require('dotenv').config();
const mysql = require('mysql');
// const _Queryusers = require('../query/queryUsers.json');
const Queryusers = require('../query/queryUser');
const _Queryusers = new Queryusers();
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


    
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

router.post('/postusers',function(req,res,next){   
    
    let query = connection.query(_Queryusers.insertUser(),[
        req.body.id,
        req.body.firstname,
        req.body.lastname,
        req.body.username,
        req.body.password,
    ], (err, results)=>{
        if(err) throw err;
        res.send("Add user success!");
        console.log("Add user success!");
    });  

    
}); // getuser 

module.exports = router;