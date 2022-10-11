var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("../dbconnect");
const dotenv = require('dotenv').config();
const mysql = require('mysql');
// const _Queryusers = require('../query/queryUsers.json');
const Query_product = require('../query/queryProduct');
const _Queryproduct = new Query_product();
var {v4: uuidv4} = require("uuid");
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));


router.get('/select_whey',function(req,res,next){   
    
    let query = connection.query(_Queryproduct.selectWhey(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select_whey 

router.get('/select_member',function(req,res,next){   
    
    let query = connection.query(_Queryproduct.selectMember(),(err, results)=>{
        if(err) throw err;
        res.send(results);
        console.log(results);
    });    
    
}); // select_whey 

router.get('/',(req,res,next)=>{   
    console.log("Hello Product Bro!");
    res.send("Hello Product Bro!"); 
}); // เช็คว่าอยู่ใน router Product 
module.exports = router;
