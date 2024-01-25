const express = require("express")
const router = express.Router();


router.get('/test_home', (req,res)=>{
    res.send("hello home");
})

router.get('/Synchronous_testing', (req,res)=>{
    express().set('view engine', 'ejs');
    res.render("home.ejs");
})






module.exports = router