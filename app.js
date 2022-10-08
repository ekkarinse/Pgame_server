const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");


var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var usersRouter = require("./routes/users");



app.use("/users", usersRouter);

app.listen(process.env.PORT, () => console.log("server is run on port :", `${process.env.PORT}`));