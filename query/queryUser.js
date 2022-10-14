var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


class User_query {
    
        selectnow(){
            return "SELECT NOW();";
        }
        selectusers(){
            return "SELECT * FROM `users` WHERE id=$1;";
        }
        
        insertUser(){

            return "INSERT INTO `users` (id, firstname, lastname, username, password, email, phone_number, age, role, Token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        }
        Check_users(){

            return "SELECT username, email, phone_number FROM `users` WHERE username=? AND email=? AND phone_number=?;";
        }

        selectMember(){

            return "SELECT list_member, price_member FROM `member_detail` ;";
        }
        insertMember(){

            return "INSERT INTO `member_detail` (id, list_member, price_member) VALUES (?, ?, ?);";
        }
        insertTrainer(){

            return "INSERT INTO `trainer_detail` (id, users_id, detail, hire_price, hire_date) VALUES (?, ?, ?, ?, ?);";
        }
        insertWhey(){

            return "INSERT INTO `whey_protein` (id, name_whey, price_whey) VALUES (?, ?, ?);";
        }
        select_trainer_detail(){

            return "SELECT users.firstname, users.lastname, trainer_detail.detail, trainer_detail.hire_price, trainer_detail.hire_date FROM `trainer_detail` JOIN `users` ON trainer_detail.users_id = users.id;"
        }
        insert_history(){

            return "INSERT INTO `buy_history` (id, users_id, buy_list, product_price) VALUES (?, ?, ?, ?);";
        }
        select_history(){

            return "SELECT users.firstname, users.lastname, buy_history.buy_list, buy_history.product_price FROM `buy_history` JOIN `users` ON buy_history.users_id = users.id WHERE buy_history.users_id = ?;";
        }
        select_login(){

            return "SELECT * FROM `users` WHERE username=?;";
        }
     

}
module.exports = User_query