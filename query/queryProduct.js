var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

class product_query {

    selectWhey(){

        return "SELECT name_whey, price_whey FROM `whey_protein`;";
    }
    selectMember(){

        return "SELECT list_member, price_member FROM `member_detail`;";
    }

}
module.exports = product_query