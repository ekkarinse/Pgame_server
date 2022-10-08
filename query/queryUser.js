var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


class User_query {
    
        SELECTnow(){
            return "SELECT NOW();";
        }
         SELECTusers(){
            return "SELECT * FROM `users` WHERE id=$1;";
        }
        
        insertUser(){

            return "INSERT INTO `users` (id, firstname, lastname, username, password) VALUES (?, ?, ?, ?, ?);";
        }

}
module.exports = User_query